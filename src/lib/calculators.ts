// Central registry for the /calculators hub. Add an entry here and the
// card shows up on the hub automatically — the hub page and sitemap both
// read from this list rather than hardcoding it a second time.
export interface CalculatorMeta {
  slug: string;
  icon: string;
  // Optional custom icon artwork (square image URL) — when set, this
  // replaces the emoji `icon` on cards. Left blank until real artwork is
  // supplied; fill in per-calculator as images become available.
  image?: string;
  title: string;
  cardTitle: string;
  description: string;
}

export const CALCULATORS: CalculatorMeta[] = [
  {
    slug: "tender-bid-no-bid",
    icon: "📋",
    title: "Tender Bid/No-Bid Calculator",
    cardTitle: "Tender Bid/No-Bid Calculator",
    description: "Score a South African tender before you commit resources, test profitability and cash exposure, and create a shareable decision record."
  },
  {
    slug: "funding-readiness-assessment",
    icon: "💼",
    title: "South African Business Funding Readiness Calculator",
    cardTitle: "Funding Readiness Calculator",
    description: "Check how prepared your business is to approach a funder, identify the biggest gaps, and get a practical action plan before you apply."
  },
  {
    slug: "import-landed-cost-profit",
    icon: "🚢",
    title: "South Africa Import Cost & Profit Calculator",
    cardTitle: "Import Cost & Profit Calculator",
    description: "Buying from China or overseas? Calculate MOQ, shipping, customs, import VAT, landed cost per unit and profit before you place the order."
  },
  {
    slug: "vat-calculator",
    icon: "🧮",
    title: "South African VAT Calculator",
    cardTitle: "VAT Calculator",
    description: "Add or remove South African VAT from an amount, see the VAT portion and keep a clear calculation record."
  },
  {
    slug: "retention-calculator",
    icon: "🏗️",
    title: "Retention & Progress Payment Calculator",
    cardTitle: "Retention & Progress Payment Calculator",
    description: "Model retention withheld, net progress payments, VAT, payment exposure and expected retention releases using your contract terms."
  }
];