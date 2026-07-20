export type UserRole = 'super_admin' | 'admin' | 'editor' | 'viewer'
export type PostStatus = 'draft' | 'scheduled' | 'published' | 'archived'

export interface Profile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  role: UserRole
  bio?: string
  website?: string
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  color: string
  icon: string
  parent_id?: string
  post_count: number
  created_at: string
}

export interface Tag {
  id: string
  name: string
  slug: string
  post_count: number
}

export interface MediaItem {
  id: string
  file_name: string
  original_name: string
  url: string
  thumbnail_url?: string
  mime_type: string
  file_size?: number
  width?: number
  height?: number
  alt_text?: string
  caption?: string
  folder: string
  imagekit_id?: string
  uploaded_by?: string
  created_at: string
}

export interface Post {
  id: string
  title: string
  slug: string
  excerpt?: string
  body?: string
  body_json?: Record<string, unknown>
  featured_image?: string
  image_caption?: string
  author_id?: string
  author?: Profile
  category_id?: string
  category?: Category
  categories?: Category[]
  tags?: Tag[]
  status: PostStatus
  section?: 'insights' | 'coffee'
  featured: boolean
  trending: boolean
  popular: boolean
  seo_title?: string
  meta_description?: string
  og_image?: string
  canonical_url?: string
  published_at?: string
  scheduled_at?: string
  read_time: number
  view_count: number
  created_at: string
  updated_at: string
}

export interface Download {
  id: string
  name: string
  subtitle?: string
  description?: string
  thumbnail_url?: string
  file_url: string
  file_type: 'pdf' | 'zip' | 'doc' | 'other'
  category_id?: string
  category?: Category
  tier: 'free' | 'premium' | 'paid'
  is_published: boolean
  download_count: number
  target_audience?: string[]
  solves?: string[]
  seo_title?: string
  meta_description?: string
  created_at: string
  updated_at: string
}

export interface NewsletterSubscriber {
  id: string
  email: string
  full_name?: string
  status: 'active' | 'unsubscribed' | 'bounced'
  segment: string
  source: string
  subscribed_at: string
}

export interface DashboardStats {
  total_posts: number
  published_posts: number
  draft_posts: number
  scheduled_posts: number
  total_categories: number
  total_tags: number
  total_media: number
  total_subscribers: number
  total_downloads: number
}

export interface PaginationMeta {
  page: number
  per_page: number
  total: number
  total_pages: number
}
