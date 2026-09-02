// Central registry for the /calculators hub. Add an entry here and the
// card shows up on the hub automatically — the hub page and sitemap both
// read from this list rather than hardcoding it a second time.
export interface CalculatorMeta {
  slug: string;
  icon: string;
  title: string;
  cardTitle: string;
  description: string;
}

export const CALCULATORS: CalculatorMeta[] = [
  {
    slug: "tender-bid-no-bid",
    icon: "📋",
    title: "Bid/No-Bid Tender Calculator",
    cardTitle: "Bid or No-Bid?",
    description:
      "Score any South African tender out of 100 before you commit two weeks to it, with a full profitability model in rand and a printable decision record."
  },
  {
    slug: "vat-calculator",
    icon: "🧮",
    title: "South African VAT Calculator",
    cardTitle: "VAT Calculator",
    description:
      "Add or remove 15% VAT from any amount in seconds — inclusive or exclusive, with the working shown so you can check it."
  },
  {
    slug: "retention-calculator",
    icon: "🏗️",
    title: "Retention & Progress Payment Calculator",
    cardTitle: "Retention Calculator",
    description:
      "Work out retention withheld, net payment due and VAT on any progress claim, and track when the retained amount gets released."
  }
];
