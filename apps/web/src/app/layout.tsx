import type { Metadata } from 'next';
import './globals.css';
import { TopNav } from '@/components/TopNav';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'StackShade Courses — Visual, First-Principles Engineering Education',
  description:
    'Open course materials, structured lessons, Mermaid diagrams, interactive simulations, downloadable animated HTML slides, and YouTube lectures for StackShade.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--ink)]">
        <TopNav />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
