import React from 'react';
import { getCatalog } from '@/lib/courses';
import { CatalogueClient } from '@/components/CatalogueClient';

export default function CoursesCataloguePage() {
  const catalog = getCatalog();
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <header className="mb-8 border-b border-[var(--border)] pb-6">
        <h1 className="text-3xl font-bold tracking-tight">Course Catalogue</h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--ink-muted)]">
          Multi-course engineering library for StackShade on YouTube. Each course includes written lessons, diagrams, interactive visualizations, downloadable HTML slide decks, labs, and case studies.
        </p>
      </header>
      <CatalogueClient courses={catalog.courses} />
    </main>
  );
}
