"use client";

import Link from "next/link";
import gearData from "../../seed/gear-data.json";

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const stats = [
  { label: "Shells", count: gearData.shells.length, href: "/gear?category=shells" },
  { label: "Weapons", count: gearData.weapons.length, href: "/gear?category=weapons" },
  { label: "Weapon Mods", count: gearData.weaponMods.length, href: "/gear?category=mods" },
  { label: "Cores", count: gearData.cores.length, href: "/gear?category=cores" },
  { label: "Implants", count: gearData.implants.length, href: "/gear?category=implants" },
];

const quickLinks = [
  {
    href: "/gear",
    title: "Gear Database",
    description: "Browse all weapons, mods, shells, cores, and implants with advanced filtering.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  {
    href: "/builds",
    title: "Build Planner",
    description: "Craft optimized loadouts with real-time stat calculations and save your builds.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.42 15.17l-5.65-5.65a8 8 0 1111.4-1.06l-.01.01a8 8 0 01-4.68 7.76l-.06.03v0a3 3 0 01-1 .06z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 10h.01M15 10h.01M12 14h.01" />
      </svg>
    ),
  },
  {
    href: "/builds/compare",
    title: "Compare",
    description: "Side-by-side gear and build comparisons with stat deltas.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
];

export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative py-16 sm:py-24 text-center">
        {/* Background glow effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-marathon-orange/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight">
            <span className="text-marathon-text">MARATHON</span>
            <br />
            <span className="text-marathon-orange">COMPANION</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-marathon-text-dim max-w-2xl mx-auto leading-relaxed">
            Your tactical edge in the extraction zone. Browse gear, plan builds,
            and optimize your Runner loadout for every mission.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/gear"
              className="btn-primary px-8 py-3 text-lg font-semibold rounded-lg"
            >
              Browse Gear Database
            </Link>
            <Link
              href="/builds"
              className="btn-secondary px-8 py-3 text-lg font-semibold rounded-lg"
            >
              Plan a Build
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Counters */}
      <section>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {stats.map((stat) => (
            <Link key={stat.label} href={stat.href}>
              <div className="card text-center hover:border-marathon-orange/30 transition-colors cursor-pointer">
                <p className="text-3xl sm:text-4xl font-black text-marathon-orange">
                  {stat.count}
                </p>
                <p className="mt-1 text-sm text-marathon-text-dim font-medium uppercase tracking-wide">
                  {stat.label}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Quick Links */}
      <section>
        <h2 className="text-2xl font-bold text-marathon-text mb-6">
          Get Started
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {quickLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <div className="card h-full hover:border-marathon-orange/30 transition-colors cursor-pointer group">
                <div className="text-marathon-orange mb-4 group-hover:scale-110 transition-transform">
                  {link.icon}
                </div>
                <h3 className="text-lg font-bold text-marathon-text mb-2">
                  {link.title}
                </h3>
                <p className="text-sm text-marathon-text-dim leading-relaxed">
                  {link.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Shells Preview */}
      <section>
        <h2 className="text-2xl font-bold text-marathon-text mb-6">
          Runner Shells
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {gearData.shells.map((shell) => {
            const id = slugify(shell.name);
            const roleColors: Record<string, string> = {
              ASSAULT: "#e63946",
              STEALTH: "#6b21a8",
              INTEL: "#3b82f6",
              MOBILITY: "#e87d0d",
              SUPPORT: "#2ecc71",
              LOOT: "#eab308",
              SCAVENGER: "#78716c",
            };
            const roleColor = roleColors[shell.role] || "#9ca3af";

            return (
              <Link key={id} href={`/gear/${id}`}>
                <div className="card h-full hover:border-marathon-orange/30 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-marathon-text">{shell.name}</h3>
                    <span
                      className="inline-block text-xs font-semibold rounded-full px-2 py-0.5 flex-shrink-0"
                      style={{ color: roleColor, backgroundColor: `${roleColor}20` }}
                    >
                      {shell.role}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-marathon-text-dim mt-3">
                    <span>HP <span className="text-marathon-text font-medium">{shell.baseStats.health}</span></span>
                    <span>SHD <span className="text-marathon-text font-medium">{shell.baseStats.shield}</span></span>
                    <span>SPD <span className="text-marathon-text font-medium">{shell.baseStats.speed}</span></span>
                    <span>RES <span className="text-marathon-text font-medium">{shell.baseStats.resilience}</span></span>
                    <span>REC <span className="text-marathon-text font-medium">{shell.baseStats.recovery}</span></span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
