export type User = { username: string; _id: string }
export type Exercise = { username: string; description: string; duration: number; date: string; _id: string }
export type LogItem = { description: string; duration: number; date: string }
export type Log = { username: string; count: number; _id: string; log: LogItem[] }
