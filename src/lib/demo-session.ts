const DEMO_SESSION_KEY = 'fbla:demo-session'

/** One chapter state per browser tab — judges don't overwrite each other's demo data. */
export function getDemoSessionId(): string {
  let id = sessionStorage.getItem(DEMO_SESSION_KEY)
  if (!id) {
    id = crypto.randomUUID()
    sessionStorage.setItem(DEMO_SESSION_KEY, id)
  }
  return id
}

export function chapterStorageKey(): string {
  return `fbla:chapter:${getDemoSessionId()}`
}

export function clearDemoSession(): void {
  sessionStorage.removeItem(DEMO_SESSION_KEY)
}
