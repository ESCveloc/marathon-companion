import { getBungieSession } from '@/lib/bungie/session';

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const session = await getBungieSession();

  return (
    <div className="flex flex-col gap-10">
      {error && <OAuthError code={error} />}

      <section className="text-center py-12">
        <h1 className="text-4xl font-bold text-white mb-4">Marathon Companion</h1>
        <p className="text-lg text-gray-400 max-w-xl mx-auto">
          Gear database, build optimizer, and player tools for Bungie&apos;s Marathon.
        </p>
        {!session && (
          <a
            href="/api/auth/bungie"
            className="inline-block mt-6 rounded bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 transition-colors"
          >
            Link Your Bungie Account
          </a>
        )}
        {session && (
          <a
            href="/profile"
            className="inline-block mt-6 rounded border border-orange-500/50 px-5 py-2.5 text-sm font-semibold text-orange-400 hover:bg-orange-500/10 transition-colors"
          >
            View Your Profile →
          </a>
        )}
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FeatureCard
          href="/gear"
          title="Gear Database"
          description="Browse and search all weapons, mods, cores, and implants."
        />
        <FeatureCard
          href="/builds"
          title="Build Planner"
          description="Slot your gear, see real-time stat totals, and save loadouts."
        />
        <FeatureCard
          href="/builds/compare"
          title="Compare"
          description="Side-by-side item and build comparison with stat deltas."
        />
      </section>

      <BungieApiStatus isLinked={!!session} />
    </div>
  );
}

function OAuthError({ code }: { code: string }) {
  const messages: Record<string, string> = {
    oauth_state_mismatch: 'OAuth state mismatch — possible CSRF attempt. Please try again.',
    oauth_no_code: 'Bungie did not return an authorization code. Please try again.',
    oauth_token_exchange_failed: 'Could not exchange the authorization code for tokens. Please try again.',
  };
  return (
    <div className="rounded-lg border border-red-500/30 bg-red-950/30 p-4 text-sm text-red-400">
      {messages[code] ?? `Authentication error: ${code}`}
    </div>
  );
}

function FeatureCard({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <a
      href={href}
      className="block rounded-lg border border-[#1e2535] bg-[#161b27] p-6 hover:border-orange-500/50 hover:bg-[#1e2a3b] transition-all"
    >
      <h2 className="text-lg font-semibold text-white mb-2">{title}</h2>
      <p className="text-sm text-gray-400">{description}</p>
    </a>
  );
}

function BungieApiStatus({ isLinked }: { isLinked: boolean }) {
  return (
    <section className="rounded-lg border border-[#1e2535] bg-[#161b27] p-6">
      <h2 className="text-base font-semibold text-white mb-3">Bungie API Status</h2>
      <div className="space-y-2 text-sm">
        <StatusRow label="User &amp; auth endpoints" status="available" />
        <StatusRow label="Clans (GroupV2) &amp; friends (Social)" status="available" />
        <StatusRow label="Account linked" status={isLinked ? 'available' : 'unlinked'} />
        <StatusRow label="Marathon profile / inventory" status="pending" />
        <StatusRow label="Marathon post-game report" status="pending" />
        <StatusRow label="Marathon manifest" status="pending" />
      </div>
      <p className="mt-4 text-xs text-gray-500">
        Marathon-specific endpoints have not been released yet.{' '}
        {isLinked
          ? 'Your account is linked — inventory access will activate automatically once Bungie ships the API.'
          : 'Link your Bungie account now — inventory access will activate automatically once Bungie ships the API.'}
      </p>
    </section>
  );
}

function StatusRow({ label, status }: { label: string; status: 'available' | 'pending' | 'unlinked' }) {
  const dot =
    status === 'available' ? 'bg-green-500' :
    status === 'unlinked' ? 'bg-gray-600' :
    'bg-yellow-500';
  const text =
    status === 'available' ? 'text-green-400' :
    status === 'unlinked' ? 'text-gray-500' :
    'text-yellow-400';
  const label2 =
    status === 'available' ? 'Available' :
    status === 'unlinked' ? 'Not linked' :
    'Pending Bungie release';

  return (
    <div className="flex items-center gap-3">
      <span className={`inline-block h-2 w-2 rounded-full flex-shrink-0 ${dot}`} />
      <span className="text-gray-300">{label}</span>
      <span className={`ml-auto text-xs font-medium ${text}`}>{label2}</span>
    </div>
  );
}
