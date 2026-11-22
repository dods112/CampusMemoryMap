export type View = 'landing' | 'auth' | 'map' | 'profile' | 'admin'
export type Visibility = 'Private' | 'Friends' | 'Public'

export type User = {
  id: string
  name: string
  email: string
  initials: string
  isAdmin: boolean
}

export type Comment = {
  id: string
  authorId: string
  author: string
  initials: string
  text: string
  createdAt: string
}

export type Pin = {
  id: string
  title: string
  place: string
  authorId: string
  author: string
  initials: string
  date: string
  year: number
  theme: string
  visibility: Visibility
  text: string
  lat: number
  lng: number
  color: string
  photo?: string
  audio?: boolean
  reactions: Record<string, number>
  comments: Comment[]
}

export type Report = {
  id: string
  pinId: string
  pinTitle: string
  pinAuthor: string
  reason: string
  reporterId: string
  reporterName: string
  createdAt: string
  status: 'Pending' | 'Approved' | 'Removed'
}
