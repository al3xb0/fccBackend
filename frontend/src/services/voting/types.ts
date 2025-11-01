export type Option = { id: string; text: string; votes: number }
export type Poll = { id: string; title: string; ownerId: string; createdAt: string; options: Option[] }
export type User = { id: string; name: string } | null
