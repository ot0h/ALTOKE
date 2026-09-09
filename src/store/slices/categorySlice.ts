import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type CategoryType = 'report' | 'news'

export type Category = {
  id: string
  communityId: string
  name: string
  type: CategoryType
}

type CategoryState = {
  categories: Category[]
  loading: boolean
}

const initialState: CategoryState = {
  categories: [],
  loading: false,
}

const categorySlice = createSlice({
  name: 'category',
  initialState,

  reducers: {
    setCategories: (
      state,
      action: PayloadAction<Category[]>
    ) => {
      state.categories = action.payload
    },

    addCategory: (
      state,
      action: PayloadAction<Category>
    ) => {
      state.categories.push(action.payload)
    },

    updateCategory: (
      state,
      action: PayloadAction<Category>
    ) => {
      const index = state.categories.findIndex(
        category => category.id === action.payload.id
      )

      if (index !== -1) {
        state.categories[index] = action.payload
      }
    },

    removeCategory: (
      state,
      action: PayloadAction<string>
    ) => {
      state.categories = state.categories.filter(
        category => category.id !== action.payload
      )
    },

    setLoading: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.loading = action.payload
    },
  },
})

export const {
  setCategories,
  addCategory,
  updateCategory,
  removeCategory,
  setLoading,
} = categorySlice.actions

export default categorySlice.reducer