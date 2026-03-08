// ---------------------------------------------------------------------------
// /profile — Linked Bungie account overview
// Server component: reads session cookie → calls Bungie User API → renders.
// Redirects to home if not authenticated.
// ---------------------------------------------------------------------------

import { redirect } from 'next/navigation';
import { getBungieSession } from '@/lib/bungie/session';
import { getMembershipsForCurrentUser } from '@/lib/bungie/user';
import { MembershipType } from '@/lib/bungie/types';

const PLATFORM_LABELS: Record<number, string> = {
  [MembershipType.TigerXbox]: 'Xbox',
  [MembershipType.TigerPsn]: 'PlayStation',
  [MembershipType.TigerSteam]: 'Steam',
  [MembershipType.TigerEgs]: 'Epic Games',
  [MembershipType.BungieNext]: 'Bungie.net',
};

export default async function ProfilePage() {
  const session = await getBungieSession();
  if (!session) redirect('/');

  let membershipData: Awaited<ReturnType<typeof getMembershipsForCurrentUser>> | null = null;
  let fetchError: string | null = null;

  try {
    membershipData = await getMembershipsForCurrentUser(session.accessToken);
  } catch (err) {
    fetchError = err instanceof Error ? err.message : 'Unknown error';
  }

  const bungieUser = membershipData?.bungieNetUser;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white">Linked Bungie Account</h1>

      {fetchError && (
        <div className="rounded-lg border border-red-500/30 bg-red-950/30 p-4 text-sm text-red-400">
          Could not load profile: {fetchError}
        </div>
      )}

      {bungieUser && (
        <section className="rounded-lg border border-[#1e2535] bg-[#161b27] p-6 space-y-4">
          {/* Avatar + name */}
          <div className="flex items-center gap-4">
            {bungieUser.profilePicturePath && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`https://www.bungie.net${bungieUser.profilePicturePath}`}
                alt="Bungie avatar"
                width={64}
                height={64}
                className="rounded-full border border-[#1e2535]"
              />
            )}
            <div>
              <p className="text-lg font-semibold text-white">{bungieUser.displayName}</p>
              <p className="text-sm text-gray-400">Membership ID: {bungieUser.membershipId}</p>
              {bungieUser.statusText && (
                <p className="text-sm text-gray-400 mt-1">{bungieUser.statusText}</p>
              )}
            </div>
          </div>

          {/* Platform usernames */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            {bungieUser.psnDisplayName && <PlatformRow platform="PlayStation" name={bungieUser.psnDisplayName} />}
            {bungieUser.xboxDisplayName && <PlatformRow platform="Xbox" name={bungieUser.xboxDisplayName} />}
            {bungieUser.steamDisplayName && <PlatformRow platform="Steam" name={bungieUser.steamDisplayName} />}
            {bungieUser.egsDisplayName && <PlatformRow platform="Epic Games" name={bungieUser.egsDisplayName} />}
            {bungieUser.twitchDisplayName && <PlatformRow platform="Twitch" name={bungieUser.twitchDisplayName} />}
          </div>
        </section>
      )}

      {/* Platform memberships */}
      {membershipData?.destinyMemberships && membershipData.destinyMemberships.length > 0 && (
        <section className="rounded-lg border border-[#1e2535] bg-[#161b27] p-6 space-y-3">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Platform Memberships</h2>
          {membershipData.destinyMemberships.map((m) => (
            <div key={m.membershipId} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-3">
                {m.iconPath && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={`https://www.bungie.net${m.iconPath}`}
                    alt=""
                    width={20}
                    height={20}
                    className="rounded"
                  />
                )}
                <span className="text-gray-300">{m.bungieGlobalDisplayName}#{String(m.bungieGlobalDisplayNameCode).padStart(4, '0')}</span>
              </div>
              <span className="text-gray-500">{PLATFORM_LABELS[m.membershipType] ?? `Type ${m.membershipType}`}</span>
            </div>
          ))}
        </section>
      )}

      {/* Marathon API status */}
      <section className="rounded-lg border border-[#1e2535] bg-[#161b27] p-6 space-y-3">
        <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Marathon Data Access</h2>
        <div className="space-y-2 text-sm">
          <StatusRow label="Account linked" available />
          <StatusRow label="User profile" available />
          <StatusRow label="Marathon inventory / stats" available={false} />
          <StatusRow label="Post-game reports" available={false} />
        </div>
        <p className="text-xs text-gray-500 pt-1">
          Your account is linked. Marathon-specific endpoints (inventory, stats, PGCR) will activate
          automatically once Bungie releases them.{' '}
          <a
            href="https://github.com/Bungie-net/api"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-400 hover:underline"
          >
            Watch for updates →
          </a>
        </p>
      </section>
    </div>
  );
}

function PlatformRow({ platform, name }: { platform: string; name: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-gray-500">{platform}:</span>
      <span className="text-gray-300">{name}</span>
    </div>
  );
}

function StatusRow({ label, available }: { label: string; available: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span className={`inline-block h-2 w-2 rounded-full flex-shrink-0 ${available ? 'bg-green-500' : 'bg-yellow-500'}`} />
      <span className="text-gray-300">{label}</span>
      <span className={`ml-auto text-xs font-medium ${available ? 'text-green-400' : 'text-yellow-400'}`}>
        {available ? 'Active' : 'Pending Bungie release'}
      </span>
    </div>
  );
}
