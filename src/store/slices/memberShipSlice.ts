import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { MemberShip, Role } from '../../types'

export type { Role }

const initialMemberShip: MemberShip = {
  userId: '',
  role: 'user',
  communityId: '',
}

const memberShipSlices = createSlice({
  name: 'memberShip',
  initialState: initialMemberShip,
  reducers: {
    updateMemberShip: (state, action: PayloadAction<MemberShip>) => {
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
