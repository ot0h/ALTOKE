import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type NewsCategory =
    | 'avisos'
    | 'eventos'
    | 'mantenimiento'

export type News = {
    id: string
    userId: string
    communityId: string
    title: string
    content: string
    category: NewsCategory
    createdAt: string
    image?: string
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
            state.news = state.news.filter(
                (news) => news.id !== action.payload
            )
        },

        updateNews: (state, action: PayloadAction<News>) => {
            const index = state.news.findIndex(
                (news) => news.id === action.payload.id
            )

            if (index !== -1) {
                state.news[index] = action.payload
            }
        },
    },
})

export const {
    setNews,
    addNews,
    removeNews,
    updateNews,
} = newsSlice.actions

export default newsSlice.reducer