export interface User {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string;
    email?: string;
}

export interface Pin {
    id: string;
    imageUrl: string;
    description: string;
    userId: string;
    username: string;
    avatarUrl: string;
    createdAt: string;
}

export interface SearchImage {
    url: string;
    thumbnail: string | null;
    title: string;
}
