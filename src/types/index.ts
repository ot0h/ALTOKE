export type UserProfile = {
  id: string
  name: string
  email: string
  avatar?: string
}

export type Community = {
  id: string
  ownerId: string
  name: string
  description: string
  address: string
  image: string
  rules: string
  code: string
  createdAt: string
}

export type Role = 'admin' | 'user'

export type MemberShip = {
  userId: string
  role: Role
  communityId: string
}

export type ReportStatus = 'revision' | 'pendiente' | 'proceso' | 'resuelto'

export type ReportNote = {
  id: string
  reportId: string
  userId: string
  author?: string
  authorAvatar?: string
  content: string
  createdAt: string
}

export type Report = {
  id: string
  title: string
  description: string
  category: string
  location: string
  status: ReportStatus
  userId: string
  communityId: string
  createdAt: string
  fotos?: string[]
  notes?: ReportNote[]
}

export type Comment = {
  id: string
  userId: string
  author?: string
  authorAvatar?: string
  content: string
  createdAt: string
}

export type Post = {
  id: string
  userId: string
  communityId: string
  title: string
  content: string
  author?: string
  authorAvatar?: string
  comments: Comment[]
  commentsCount: number
  likes: number
  iLike: boolean
  image?: string
  category?: 'avisos' | 'eventos' | 'mantenimiento'
  createdAt?: string
}

export type CategoryType = 'report' | 'news'

export type Category = {
  id: string
  communityId: string
  name: string
  type: CategoryType
}