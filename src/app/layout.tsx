import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Marathon Companion',
  description: 'Gear optimization and build planning for Bungie\'s Marathon',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0f1117] text-gray-200">
        <header className="border-b border-[#1e2535] bg-[#161b27]">
          <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
            <a href="/" className="text-xl font-bold tracking-tight text-orange-500">
              Marathon Companion
            </a>
            <nav className="flex items-center gap-6 text-sm text-gray-400">
              <a href="/gear" className="hover:text-gray-100 transition-colors">Gear</a>
              <a href="/builds" className="hover:text-gray-100 transition-colors">Builds</a>
              <a href="/builds/compare" className="hover:text-gray-100 transition-colors">Compare</a>
              <a
                href="/api/auth/bungie"
                className="rounded bg-orange-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-orange-600 transition-colors"
              >
                Link Bungie Account
              </a>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
