import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type NewsCategory = 'avisos' | 'eventos' | 'mantenimiento'

export type NewsStatus = 'publicada' | 'borrador'

export type News = {
  id: string
  userId: string
  communityId: string
  title: string
  content: string
  category: NewsCategory
  createdAt: string
  author?: string
  authorAvatar?: string
  image?: string
  status: NewsStatus
}

type NewsState = {
  news: News[]
}

const initialState: NewsState = {
  news: [],
}

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    setNews: (state, action: PayloadAction<News[]>) => {
      state.news = action.payload
    },

    addNews: (state, action: PayloadAction<News>) => {
      state.news.push(action.payload)
    },

    removeNews: (state, action: PayloadAction<string>) => {
      state.news = state.news.filter((news) => news.id !== action.payload)
    },

    updateNews: (state, action: PayloadAction<News>) => {
      const index = state.news.findIndex(
        (news) => news.id === action.payload.id,
      )

      if (index !== -1) {
        state.news[index] = action.payload
      }
    },
    updateNewsStatus: (
      state,
      action: PayloadAction<{
        id: string
        status: NewsStatus
      }>,
    ) => {
      const news = state.news.find((item) => item.id === action.payload.id)

      if (news) {
        news.status = action.payload.status
      }
    },
  },
})

export const { setNews, addNews, removeNews, updateNews, updateNewsStatus } =
  newsSlice.actions

export default newsSlice.reducer
