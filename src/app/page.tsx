export default function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  return (
    <div className="flex flex-col gap-10">
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold text-white mb-4">Marathon Companion</h1>
        <p className="text-lg text-gray-400 max-w-xl mx-auto">
          Gear database, build optimizer, and player tools for Bungie&apos;s Marathon.
        </p>
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

      <BungieApiStatus />
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

function BungieApiStatus() {
  return (
    <section className="rounded-lg border border-[#1e2535] bg-[#161b27] p-6">
      <h2 className="text-base font-semibold text-white mb-3">Bungie API Status</h2>
      <div className="space-y-2 text-sm">
        <StatusRow label="User &amp; auth endpoints" status="available" />
        <StatusRow label="Clans (GroupV2) &amp; friends (Social)" status="available" />
        <StatusRow label="Marathon profile / inventory" status="pending" />
        <StatusRow label="Marathon post-game report" status="pending" />
        <StatusRow label="Marathon manifest" status="pending" />
      </div>
      <p className="mt-4 text-xs text-gray-500">
        Marathon-specific endpoints have not been released yet. Link your Bungie account now
        — inventory access will activate automatically once Bungie ships the API.
      </p>
    </section>
  );
}

function StatusRow({ label, status }: { label: string; status: 'available' | 'pending' }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={`inline-block h-2 w-2 rounded-full flex-shrink-0 ${
          status === 'available' ? 'bg-green-500' : 'bg-yellow-500'
        }`}
      />
      <span className="text-gray-300">{label}</span>
      <span
        className={`ml-auto text-xs font-medium ${
          status === 'available' ? 'text-green-400' : 'text-yellow-400'
        }`}
      >
        {status === 'available' ? 'Available' : 'Pending Bungie release'}
      </span>
    </div>
  );
}
