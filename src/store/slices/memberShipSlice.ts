import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type Role = 'admin' | 'user'

type memberShip = {
  userId: string
  role: Role
  communityId: string
}

const initialMemberShip: memberShip = {
  userId: '',
  role: 'user',
  communityId: '',
}

const memberShipSlices = createSlice({
  name: 'memberShip',
  initialState: initialMemberShip,
  reducers: {
    updateMemberShip: (state, action: PayloadAction<memberShip>) => {
      state.userId = action.payload.userId
      state.role = action.payload.role
      state.communityId = action.payload.communityId
    },

    updateUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload
    },
    updateRole: (state, action: PayloadAction<Role>) => {
      state.role = action.payload
    },
    updateCommunityId: (state, action: PayloadAction<string>) => {
      state.communityId = action.payload
    },
  },
})

export const { updateMemberShip, updateCommunityId, updateRole, updateUserId } =
  memberShipSlices.actions

export default memberShipSlices.reducer
