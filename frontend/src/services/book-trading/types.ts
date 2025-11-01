export type User = { id: string; username: string; fullName: string; city: string; state: string } | null
export type Book = { id: string; title: string; author: string; ownerId: string; ownerName: string }
export type Trade = { id: string; bookId: string; fromUserId: string; toUserId: string; status: string; bookTitle?: string; fromUsername?: string; toUsername?: string }