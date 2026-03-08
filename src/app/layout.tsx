import type { Metadata } from 'next';
import './globals.css';
import { getBungieSession } from '@/lib/bungie/session';
import { getBungieNetUserById } from '@/lib/bungie/user';

export const metadata: Metadata = {
  title: 'Marathon Companion',
  description: 'Gear optimization and build planning for Bungie\'s Marathon',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getBungieSession();

  let displayName: string | null = null;
  let avatarPath: string | null = null;

  if (session) {
    try {
      const user = await getBungieNetUserById(session.membershipId);
      displayName = user.displayName ?? user.uniqueName ?? null;
      avatarPath = user.profilePicturePath ?? null;
    } catch {
      // Session cookie exists but API call failed (e.g. expired token).
      // Header falls back to showing the login button.
    }
  }

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

              {displayName ? (
                <div className="flex items-center gap-3">
                  <a
                    href="/profile"
                    className="flex items-center gap-2 hover:text-gray-100 transition-colors"
                  >
                    {avatarPath && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={`https://www.bungie.net${avatarPath}`}
                        alt=""
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                    )}
                    <span className="text-gray-200">{displayName}</span>
                  </a>
                  <form action="/api/auth/bungie/logout" method="POST">
                    <button
                      type="submit"
                      className="rounded border border-[#1e2535] px-3 py-1.5 text-xs text-gray-400 hover:text-gray-100 hover:border-gray-500 transition-colors"
                    >
                      Logout
                    </button>
                  </form>
                </div>
              ) : (
                <a
                  href="/api/auth/bungie"
                  className="rounded bg-orange-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-orange-600 transition-colors"
                >
                  Link Bungie Account
                </a>
              )}
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
