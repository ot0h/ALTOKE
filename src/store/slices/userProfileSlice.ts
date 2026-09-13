import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type UserProfile = {
  id: string
  name: string
  email: string
  avatar?: string
}

const initialUserProfile: UserProfile = {
  id: '',
  name: '',
  email: '',
  avatar: '',
}

const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState: initialUserProfile,
  reducers: {
    updateProfile: (state, action: PayloadAction<UserProfile>) => {
      state.id = action.payload.id
      state.name = action.payload.name
      state.email = action.payload.email
      state.avatar = action.payload.avatar
    },
    updateName: (state, action: PayloadAction<string>) => {
      state.name = action.payload
    },
    updateEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload
    },
    updateAvatar: (state, action: PayloadAction<string>) => {
      state.avatar = action.payload
    },
    updateId: (state, action: PayloadAction<string>) => {
      state.id = action.payload
    },
  },
})

export const {
  updateAvatar,
  updateEmail,
  updateId,
  updateProfile,
  updateName,
} = userProfileSlice.actions

export default userProfileSlice.reducer
