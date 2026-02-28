/**
 * Format an ISO 8601 date string as a human-readable relative time.
 * Examples: "just now", "3 minutes ago", "2 hours ago", "5 days ago"
 */
export function formatRelativeTime(isoString: string): string {
  const date = new Date(isoString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSeconds = Math.floor(diffMs / 1000)

  if (diffSeconds < 60) return 'just now'
  if (diffSeconds < 3600) {
    const mins = Math.floor(diffSeconds / 60)
    return `${mins} minute${mins === 1 ? '' : 's'} ago`
  }
  if (diffSeconds < 86400) {
    const hours = Math.floor(diffSeconds / 3600)
    return `${hours} hour${hours === 1 ? '' : 's'} ago`
  }
  if (diffSeconds < 2592000) {
    const days = Math.floor(diffSeconds / 86400)
    return `${days} day${days === 1 ? '' : 's'} ago`
  }
  return date.toLocaleDateString()
}
