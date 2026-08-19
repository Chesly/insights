export type PostStatus = 'draft' | 'scheduled' | 'published' | 'archived'

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function estimateReadTime(html: string): number {
  const words = html.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

/** Converts a stored UTC timestamp into the "YYYY-MM-DDTHH:mm" shape a
    `<input type="datetime-local">` needs, in the browser's own timezone —
    without this, editing an already-scheduled item shows a blank/invalid
    date field since the raw ISO string (with its trailing offset) doesn't
    match what the input expects. */
export function toDatetimeLocalInput(iso?: string | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

/** Converts a `<input type="datetime-local">` value (interpreted by the
    browser as local wall-clock time) into a proper UTC ISO string for
    storage — sending the raw local-looking string straight to a
    `timestamptz` column would have Postgres read it as UTC, skewing every
    scheduled time by the admin's timezone offset. */
export function fromDatetimeLocalInput(value: string): string | null {
  if (!value) return null
  const d = new Date(value)
  return isNaN(d.getTime()) ? null : d.toISOString()
}

export function formatDate(date: string | Date, format: 'short'|'medium'|'time' = 'medium'): string {
  const d = new Date(date)
  if (format === 'short') return d.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })
  if (format === 'time') return d.toLocaleString('en-ZA', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
  return d.toLocaleDateString('en-ZA', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024, sizes = ['B','KB','MB','GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

export function truncate(str: string, n: number): string {
  return str.length > n ? str.slice(0, n - 1) + '…' : str
}

export const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-600',
  scheduled: 'bg-blue-100 text-blue-700',
  published: 'bg-green-100 text-green-700',
  archived: 'bg-orange-100 text-orange-700',
}

export const STATUS_LABELS: Record<string, string> = {
  draft: 'Draft',
  scheduled: 'Scheduled',
  published: 'Published',
  archived: 'Archived',
}
