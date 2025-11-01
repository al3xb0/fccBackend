export type ImageResult = {
    url: string
    snippet: string
    thumbnail?: string | null
    context?: string | null
}

export type RecentEntry = { term: string; when: string }
