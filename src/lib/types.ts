export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ComparisonRow {
  label: string;
  columnA: string;
  columnB: string;
}

export interface ComparisonTable {
  title?: string;
  columnAHeader: string;
  columnBHeader: string;
  rows: ComparisonRow[];
}

export interface HowToStep {
  name: string;
  text: string;
}

export interface PostFrontmatter {
  title: string;
  description: string;
  category: string;        // primary category (legacy + default display)
  categories?: string[];   // optional multi-category array
  tags: string[];
  author: string;
  authorSlug?: string;
  image: string;
  publishedDate: string;
  modifiedDate: string;
  seoTitle?: string;
  seoDescription?: string;
  keywords: string[];
  featured?: boolean;
  editorsPick?: boolean;
  trending?: boolean;
  draft?: boolean;

  /** AI Search Optimization fields (all optional, backward compatible) */
  aiSummary?: string;
  keyTakeaways?: string[];
  faq?: FaqItem[];
  definitions?: FaqItem[];
  expertInsight?: string;
  comparisonTable?: ComparisonTable;
  pros?: string[];
  cons?: string[];
  relatedTopics?: string[];
  suggestedQuestions?: string[];
  semanticKeywords?: string[];
  howToSteps?: HowToStep[];
}

export interface Post extends PostFrontmatter {
  slug: string;
  content: string;
  readingTime: string;
}

export interface Author {
  slug: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  expertise: string[];
  social: {
    website?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  email?: string;
}
