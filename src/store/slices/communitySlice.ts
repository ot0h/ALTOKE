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

        },
        updateId: (state, action: PayloadAction<string>)=>{

        },
        updateDescription: (state, action: PayloadAction<string>)=>{

        },
        updateImage:(state, action: PayloadAction<string>)=> {

        }
    }
});

export const {
    updateCommunity,
    updateId,
    updateDescription,
    updateImage,
} = communitySlice.actions

export default communitySlice.reducer