import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type community = {
    id: string
    name: string
    description: string
    image: string
}

const initialCommunity: community = {
    id: "",
    name: "",
    description: "",
    image: ""
}

const communitySlice = createSlice ({
    name: "community",
    initialState: initialCommunity,
    reducers:{
        updateCommunity: (state, action: PayloadAction<community>) => {
            state.id = action.payload.id
            state.name = action.payload.name
            state.description = action.payload.description
            state.image = action.payload.image
        },
        updateId: (state, action: PayloadAction<string>)=>{
            state.id = action.payload
        },
        updateName: (state, action: PayloadAction<string>)=>{
            state.name = action.payload
        },
        updateDescription: (state, action: PayloadAction<string>)=>{
            state.description = action.payload
        },
        updateImage:(state, action: PayloadAction<string>)=> {
            state.image = action.payload
        }
    }
});

export const {
    updateCommunity,
    updateId,
    updateName,
    updateDescription,
    updateImage,
} = communitySlice.actions

export default communitySlice.reducer