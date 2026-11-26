# Lab 05 · Presigned Multipart Uploads

**Goal:** Contrast proxying binary payloads through an application server against direct-to-object-store multipart uploads using presigned URLs, including partial failure recovery.
**Level:** Beginner → Intermediate
**Estimated effort:** 60 minutes

## Scenario and setup

You are building the upload pipeline for a video-sharing tool. A mobile client needs to upload a 50 MiB test file (representing a 2 GiB video) reliably over flaky networks. Your API server runs inside a container capped at **256 MiB RAM**.

### Prerequisites & safety
- Docker Engine, Python 3.10+, `boto3`, and `requests` (`pip install boto3 requests`).
- Zero cloud cost: runs against local **MinIO** (S3-compatible object storage).

Start MinIO locally and create a bucket:

```bash
docker run --name minio-lab05 -p 9000:9000 -p 9001:9001 \
  -e MINIO_ROOT_USER=minioadmin -e MINIO_ROOT_PASSWORD=minioadmin \
  quay.io/minio/minio server /data --console-address ":9001" -d
```

Create a 50 MiB random test file and a bucket named `media-uploads`:

```bash
dd if=/dev/urandom of=/tmp/sample-50m.bin bs=1M count=50
python3 -c "
import boto3
s3 = boto3.client('s3', endpoint_url='http://localhost:9000',
                  aws_access_key_id='minioadmin', aws_secret_access_key='minioadmin')
s3.create_bucket(Bucket='media-uploads')
print('Bucket ready')
"
```

## Starting assumptions

| Input | Value | How to validate |
|---|---:|---|
| Test payload size | 50 MiB (52,428,800 bytes) | `ls -lh /tmp/sample-50m.bin` |
| Multipart chunk size | 5 MiB (S3 minimum for non-final parts) | `5 * 1024 * 1024 = 5,242,880` bytes |
| Expected part count | 10 parts | `50 MiB / 5 MiB = 10` |
| API container RAM budget | 256 MiB | `docker stats` or process RSS measurement |
| Presigned URL expiry | 300 seconds | Inspect `X-Amz-Expires=300` query parameter |

## Tasks

- [ ] **Task 1 — Inspect Multipart Presign Flow:** Write a Python script `presigned_mpu.py` that acts as two separate roles:
  1. **Control Plane (API):** Calls `create_multipart_upload`, generates 10 `upload_part` presigned URLs (`ExpiresIn=300`), and returns `{uploadId, urls}`.
  2. **Data Plane (Client):** Reads `/tmp/sample-50m.bin` in 5 MiB slices, uploads parts directly to MinIO with `requests.put(url, data=chunk)` using a 4-worker thread pool, collects each `ETag`, and calls the API to execute `complete_multipart_upload`.

- [ ] **Task 2 — Verify Integrity & Memory Footprint:** Record the API server's peak resident memory (RSS in MiB) during the upload—it should stay flat (`< 40 MiB`) because zero payload bytes traverse the API. Verify the uploaded object's byte length and MD5/ETag match `/tmp/sample-50m.bin`.

- [ ] **Task 3 — Simulate Mid-Upload Failure & Resume:** Modify the client to intentionally abort after uploading parts 1–6 (or fail part 7 with a simulated timeout). List existing uploaded parts via `s3.list_parts(Bucket='media-uploads', Key=..., UploadId=...)`, upload *only* parts 7–10, and complete the upload without re-sending parts 1–6.

- [ ] **Task 4 — Orphan Multipart Cleanup Audit:** Start an upload, send 3 parts, and never call `complete_multipart_upload`. Run `s3.list_multipart_uploads(Bucket='media-uploads')` to prove that incomplete parts still consume storage until an `AbortIncompleteMultipartUpload` lifecycle policy (e.g., 7 days) cleans them up.

## Expected evidence

- Output of `presigned_mpu.py` showing `uploadId`, per-part `ETag`s, elapsed wall time (seconds), throughput (`MiB/s`), and API process peak RSS (`MiB`).
- Evidence of Task 3 resuming from part 7 using `list_parts` without re-uploading parts 1–6.
- Output of `list_multipart_uploads` showing the orphaned upload before calling `abort_multipart_upload`.

## Reflection

1. What did you expect to happen to API memory and CPU if 20 clients simultaneously uploaded 50 MiB files *through* a Python/Node API server instead of presigned URLs?
2. What actually happened to the API server's memory footprint and request latency during the presigned multipart run?
3. Which assumption breaks if a user takes 20 minutes on slow 3G to upload part 8, while `ExpiresIn=300`? How should the client renew part URLs?
4. What would you change at 10× scale (5 GiB 4K videos) and 100× scale (global users uploading from Asia/Europe to a single US bucket)?

## Cleanup

```bash
rm -f /tmp/sample-50m.bin
docker stop minio-lab05 && docker rm minio-lab05
```

## References

- [AWS S3 User Guide · Uploading and copying objects using multipart upload](https://docs.aws.amazon.com/AmazonS3/latest/userguide/mpuoverview.html)
- [AWS S3 User Guide · Sharing objects with presigned URLs](https://docs.aws.amazon.com/AmazonS3/latest/userguide/ShareObjectPreSignedURL.html)
- [AWS S3 · Multipart upload limits (5 MiB minimum part size, 10,000 max parts)](https://docs.aws.amazon.com/AmazonS3/latest/userguide/qfacts.html)
