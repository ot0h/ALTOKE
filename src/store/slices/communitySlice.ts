import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Community } from '../../types'

//AHORA UN USUARIO PUEDE PERTENECER A VARIAS COMUNIDADES 
type CommunityState = {
  communities: Community[]
}

const initialState: CommunityState = {
  communities: [],
}


//NO CAMBIO LA ARQUITECTURA, SOLO SE CAMBIO COMO FUNCIONA ESTA PARTE
const communitySlice = createSlice({
  name: 'community',
  initialState: initialState,
  reducers: {
    setCommunities: (
      state,
      action: PayloadAction<Community[]>
    ) => {
      state.communities = action.payload
    },
    addCommunity: (
      state,
      action: PayloadAction<Community>
    ) => {
      state.communities.push(action.payload)
    },

    removeCommunity: (
      state,
      action: PayloadAction<string>
    ) => {
      state.communities = state.communities.filter(
        (community) => community.id !== action.payload
      )
    },

    updateCommunity: (
      state,
      action: PayloadAction<Community>
    ) => {
      const index = state.communities.findIndex(
        (community) => community.id === action.payload.id
      )

      if (index !== -1) {
        state.communities[index] = action.payload
      }
    },
  },
})

export const {
  setCommunities,
  addCommunity,
  removeCommunity,
  updateCommunity,
} = communitySlice.actions

export default communitySlice.reducer