import { AnalyticsEvent } from "@/lib/types";

/**
 * Lightweight analytics event tracker for Phase 1.
 * Logs events to console in development. Replace with a real
 * analytics service (e.g., PostHog, Plausible) in production.
 */
export function trackEvent(event: AnalyticsEvent): void {
  if (process.env.NODE_ENV === "development") {
    console.log("[analytics]", event.type, event);
  }

  // Phase 2+: send to analytics backend
  // fetch("/api/analytics", { method: "POST", body: JSON.stringify(event) });
}
