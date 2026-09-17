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
}

export type Comment = {
  id: string
  userId: string
  content: string
  createdAt: string
}

export type Post = {
  id: string
  userId: string
  communityId: string
  title: string
  content: string
  comments: Comment[]
  likes: number
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