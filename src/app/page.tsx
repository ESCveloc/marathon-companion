"use client";

import Link from "next/link";
import { ROLE_COLORS, WEAPON_TYPE_LABELS } from "@/lib/constants";
import gearData from "../../seed/gear-data.json";

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

// Role descriptions for shell cards
const ROLE_DESCRIPTIONS: Record<string, string> = {
  ASSAULT: "Frontline Tank",
  STEALTH: "Stealth Flanker",
  INTEL: "Intel Specialist",
  MOBILITY: "Mobile Disruptor",
  SUPPORT: "Squad Medic",
  LOOT: "Loot Specialist",
  SCAVENGER: "Zero-Risk Solo",
};

// Derive "popular" weapons — highest firepower per category
const weaponsByType = gearData.weapons.reduce<Record<string, typeof gearData.weapons>>((acc, w) => {
  if (!acc[w.type]) acc[w.type] = [];
  acc[w.type].push(w);
  return acc;
}, {});

const popularWeapons = Object.entries(weaponsByType)
  .map(([type, weapons]) => {
    const sorted = [...weapons].sort((a, b) => b.firepower - a.firepower);
    return sorted[0];
  })
  .filter(Boolean)
  .sort((a, b) => b.firepower - a.firepower)
  .slice(0, 8);

export default function HomePage() {
  return (
    <div className="space-y-12">
      {/* Hero — compact, tool-focused */}
      <section className="relative py-10 sm:py-16">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-marathon-orange/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10">
          {/* Left — branding + CTAs */}
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight">
              <span className="text-marathon-text">MARATHON</span>{" "}
              <span className="text-marathon-orange">COMPANION</span>
            </h1>
            <p className="mt-4 text-lg text-marathon-text-dim max-w-xl leading-relaxed">
              Gear database, loadout planner, and build optimizer for Bungie&apos;s Marathon.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center lg:items-start gap-3">
              <Link
                href="/builds"
                className="btn-primary px-6 py-3 text-base font-semibold rounded-lg"
              >
                Create a Loadout
              </Link>
              <Link
                href="/gear?category=weapons"
                className="btn-secondary px-6 py-3 text-base font-semibold rounded-lg"
              >
                Browse Weapons
              </Link>
            </div>
          </div>

          {/* Right — tool quick-access cards */}
          <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
            <Link href="/gear?category=weapons">
              <div className="card text-center py-5 hover:border-marathon-orange/40 transition-colors cursor-pointer group">
                <svg className="w-6 h-6 mx-auto text-marathon-orange mb-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <p className="text-sm font-bold text-marathon-text">Weapons</p>
                <p className="text-xs text-marathon-muted mt-0.5">{gearData.weapons.length} items</p>
              </div>
            </Link>
            <Link href="/gear?category=shells">
              <div className="card text-center py-5 hover:border-marathon-orange/40 transition-colors cursor-pointer group">
                <svg className="w-6 h-6 mx-auto text-marathon-orange mb-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <p className="text-sm font-bold text-marathon-text">Shells</p>
                <p className="text-xs text-marathon-muted mt-0.5">{gearData.shells.length} runners</p>
              </div>
            </Link>
            <Link href="/builds">
              <div className="card text-center py-5 hover:border-marathon-orange/40 transition-colors cursor-pointer group">
                <svg className="w-6 h-6 mx-auto text-marathon-orange mb-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.42 15.17l-5.65-5.65a8 8 0 1111.4-1.06l-.01.01a8 8 0 01-4.68 7.76l-.06.03v0a3 3 0 01-1 .06z" />
                </svg>
                <p className="text-sm font-bold text-marathon-text">Build Planner</p>
                <p className="text-xs text-marathon-muted mt-0.5">Craft loadouts</p>
              </div>
            </Link>
            <Link href="/builds/compare">
              <div className="card text-center py-5 hover:border-marathon-orange/40 transition-colors cursor-pointer group">
                <svg className="w-6 h-6 mx-auto text-marathon-orange mb-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className="text-sm font-bold text-marathon-text">Compare</p>
                <p className="text-xs text-marathon-muted mt-0.5">Side by side</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Runner Shell Guides — primary content like Mobalytics/Clutchbase */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-marathon-text">Runner Shells</h2>
          <Link href="/gear?category=shells" className="text-sm text-marathon-orange hover:text-marathon-amber transition-colors font-medium">
            View All &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {gearData.shells.map((shell) => {
            const id = slugify(shell.name);
            const roleColor = ROLE_COLORS[shell.role] || "#9ca3af";
            const coreCount = gearData.cores.filter(
              (c) => c.shellId === shell.name
            ).length;

            return (
              <Link key={id} href={`/gear/${id}`}>
                <div className="card h-full hover:border-marathon-orange/30 transition-all cursor-pointer group">
                  {/* Role color accent bar */}
                  <div
                    className="h-1 rounded-full mb-4 transition-all group-hover:h-1.5"
                    style={{ backgroundColor: roleColor }}
                  />

                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-marathon-text group-hover:text-marathon-orange transition-colors">
                        {shell.name}
                      </h3>
                      <p className="text-xs text-marathon-muted">
                        {ROLE_DESCRIPTIONS[shell.role] || shell.role}
                      </p>
                    </div>
                    <span
                      className="inline-block text-xs font-semibold rounded-full px-2 py-0.5 flex-shrink-0"
                      style={{ color: roleColor, backgroundColor: `${roleColor}20` }}
                    >
                      {shell.role}
                    </span>
                  </div>

                  {/* Abilities preview */}
                  <div className="space-y-1.5 mb-3">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-marathon-orange flex-shrink-0" />
                      <span className="text-marathon-text-dim truncate">{shell.primeAbilityName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-marathon-cyan flex-shrink-0" />
                      <span className="text-marathon-text-dim truncate">{shell.tactAbilityName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-marathon-green flex-shrink-0" />
                      <span className="text-marathon-text-dim truncate">{shell.trait1Name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-marathon-green flex-shrink-0" />
                      <span className="text-marathon-text-dim truncate">{shell.trait2Name}</span>
                    </div>
                  </div>

                  {/* Stats bar */}
                  <div className="flex gap-3 text-xs text-marathon-text-dim border-t border-marathon-slate pt-3">
                    <span>HP <span className="text-marathon-text font-medium">{shell.baseStats.health}</span></span>
                    <span>SHD <span className="text-marathon-text font-medium">{shell.baseStats.shield}</span></span>
                    <span>SPD <span className="text-marathon-text font-medium">{shell.baseStats.speed}</span></span>
                  </div>

                  {/* Core count */}
                  <p className="text-xs text-marathon-muted mt-2">
                    {coreCount} core{coreCount !== 1 ? "s" : ""} available
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Popular Weapons — like Light.gg's trending weapons */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-marathon-text">Top Weapons by Category</h2>
            <p className="text-sm text-marathon-text-dim mt-1">Highest firepower in each weapon class</p>
          </div>
          <Link href="/gear?category=weapons" className="text-sm text-marathon-orange hover:text-marathon-amber transition-colors font-medium">
            All Weapons &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {popularWeapons.map((weapon) => {
            const id = slugify(weapon.name);
            return (
              <Link key={id} href={`/gear/${id}`}>
                <div className="card h-full hover:border-marathon-orange/30 transition-all cursor-pointer group">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="min-w-0">
                      <h3 className="font-bold text-marathon-text truncate group-hover:text-marathon-orange transition-colors">
                        {weapon.name}
                      </h3>
                      <p className="text-xs text-marathon-muted">
                        {WEAPON_TYPE_LABELS[weapon.type] || weapon.type}
                      </p>
                    </div>
                    <span className="text-xs font-medium text-marathon-text-dim bg-marathon-slate px-2 py-0.5 rounded flex-shrink-0">
                      {weapon.rarity}
                    </span>
                  </div>

                  {/* Key stats */}
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    <div className="text-center">
                      <p className="text-lg font-black text-marathon-orange">{weapon.firepower}</p>
                      <p className="text-xs text-marathon-muted">DMG</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-black text-marathon-text">{weapon.rateOfFire}</p>
                      <p className="text-xs text-marathon-muted">RPM</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-black text-marathon-text">{weapon.range}</p>
                      <p className="text-xs text-marathon-muted">RNG</p>
                    </div>
                  </div>

                  {/* Fire mode + ammo */}
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-marathon-slate text-xs text-marathon-text-dim">
                    <span>{weapon.fireMode}</span>
                    <span className="text-marathon-slate">|</span>
                    <span>{weapon.ammoType}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Database Quick Browse — like Clutchbase's database grid */}
      <section>
        <h2 className="text-2xl font-bold text-marathon-text mb-6">Database</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { href: "/gear?category=weapons", label: "Weapons", count: gearData.weapons.length, desc: "All weapon stats & types" },
            { href: "/gear?category=shells", label: "Shells", count: gearData.shells.length, desc: "Runner abilities & stats" },
            { href: "/gear?category=mods", label: "Mods", count: gearData.weaponMods.length, desc: "Weapon modifications" },
            { href: "/gear?category=cores", label: "Cores", count: gearData.cores.length, desc: "Ability augments" },
            { href: "/gear?category=implants", label: "Implants", count: gearData.implants.length, desc: "Stat & perk upgrades" },
          ].map((item) => (
            <Link key={item.label} href={item.href}>
              <div className="card text-center hover:border-marathon-orange/30 transition-colors cursor-pointer group py-6">
                <p className="text-2xl font-black text-marathon-orange group-hover:scale-110 transition-transform">
                  {item.count}
                </p>
                <p className="text-sm font-bold text-marathon-text mt-1">{item.label}</p>
                <p className="text-xs text-marathon-muted mt-0.5">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
