import { createServiceClient } from "@/lib/supabase/service";
import Topbar from "@/components/layout/Topbar";

// Protected by src/proxy.ts the same way as every other /admin/* route —
// no separate auth check needed here (see AGENTS.md: this fork of Next.js
// renamed middleware.ts to proxy.ts, exporting `proxy()` instead of
// `middleware()`; it redirects any unauthenticated request under /admin
// to /ct-login before this ever renders).
export const dynamic = "force-dynamic";

type Scorecard = {
  campaign: string;
  spend_zar: number | null;
  pageviews: number;
  leads: number;
  purchases: number;
  revenue_zar: number;
  cost_per_lead: number | null;
  lead_to_sale_pct: number | null;
  roas: number | null;
};

type Funnel = {
  campaign: string;
  creative: string;
  pageviews: number;
  calc_views: number;
  calc_completed: number;
  leads: number;
  toolkit_clicks: number;
  checkouts: number;
  purchases: number;
};

const rand = (n: number | null | undefined) =>
  n == null ? "—" : `R ${Number(n).toLocaleString("en-ZA", { minimumFractionDigits: 2 })}`;

export default async function AdsDashboard() {
  const supabase = createServiceClient();

  const [{ data: scorecard }, { data: funnel }] = await Promise.all([
    supabase.from("ad_scorecard").select("*").order("revenue_zar", { ascending: false }),
    supabase.from("ad_funnel").select("*").order("pageviews", { ascending: false }).limit(50),
  ]);

  const cards = (scorecard ?? []) as Scorecard[];
  const rows = (funnel ?? []) as Funnel[];

  return (
    <>
      <Topbar title="Ad Performance" />
      <div style={{ padding: 24, maxWidth: 1100 }}>
        <p style={{ color: "#64748b", fontSize: 13, marginBottom: 20 }}>
          Spend is entered manually in the <code>ad_spend</code> table. Everything else is
          measured server-side and is not subject to Meta&apos;s attribution window.
        </p>

        <div className="cms-card" style={{ marginBottom: 24 }}>
          <div style={{ padding: "16px 16px 0" }}>
            <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>Scorecard</h2>
          </div>
          <table className="cms-table">
            <thead>
              <tr>
                <th>Campaign</th>
                <th>Spend</th>
                <th>Visits</th>
                <th>Leads</th>
                <th>Cost/lead</th>
                <th>Sales</th>
                <th>Lead→sale</th>
                <th>Revenue</th>
                <th>ROAS</th>
              </tr>
            </thead>
            <tbody>
              {cards.length === 0 && (
                <tr>
                  <td colSpan={9} style={{ textAlign: "center", padding: "3rem", color: "#94a3b8" }}>
                    No data yet.
                  </td>
                </tr>
              )}
              {cards.map((c) => (
                <tr key={c.campaign}>
                  <td style={{ fontWeight: 600 }}>{c.campaign}</td>
                  <td>{rand(c.spend_zar)}</td>
                  <td>{c.pageviews}</td>
                  <td>{c.leads}</td>
                  <td>{rand(c.cost_per_lead)}</td>
                  <td>{c.purchases}</td>
                  <td>{c.lead_to_sale_pct == null ? "—" : `${c.lead_to_sale_pct}%`}</td>
                  <td>{rand(c.revenue_zar)}</td>
                  <td>{c.roas == null ? "—" : `${c.roas}x`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="cms-card">
          <div style={{ padding: "16px 16px 0" }}>
            <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>Funnel by creative</h2>
            <p style={{ margin: "4px 0 0", fontSize: 12.5, color: "#94a3b8" }}>
              The step with the biggest drop is the one to fix. Not the ad.
            </p>
          </div>
          <table className="cms-table">
            <thead>
              <tr>
                <th>Creative</th>
                <th>Visits</th>
                <th>Calc opened</th>
                <th>Scored</th>
                <th>Leads</th>
                <th>Toolkit CTA</th>
                <th>Checkout</th>
                <th>Sales</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center", padding: "3rem", color: "#94a3b8" }}>
                    No data yet.
                  </td>
                </tr>
              )}
              {rows.map((r, i) => (
                <tr key={`${r.campaign}-${r.creative}-${i}`}>
                  <td>{r.creative}</td>
                  <td>{r.pageviews}</td>
                  <td>{r.calc_views}</td>
                  <td>{r.calc_completed}</td>
                  <td>{r.leads}</td>
                  <td>{r.toolkit_clicks}</td>
                  <td>{r.checkouts}</td>
                  <td>{r.purchases}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
