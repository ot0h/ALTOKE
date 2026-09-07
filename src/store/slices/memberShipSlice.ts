import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type memberShip = {
    userId: string,
    role: "admin" | "user"
    communityId: string
}

const initialMemberShip : memberShip ={
    userId: "",
    role: "user",
    communityId: ""
}

const memberShipSlices = createSlice({
    name: "memberShip",
    initialState: initialMemberShip,
    reducers:{

        updateMemberShip: (state, action: PayloadAction) => {

        },

        updateUserId:(state, action: PayloadAction<string>)=>{

        },
        updateRole:(state, action:PayloadAction<string>)=>{

        },
        updateCommunityId:(state, action: PayloadAction<string>)=>{

        },

        
    }

});

export const{
    updateMemberShip,
    updateCommunityId,
    updateRole,
    updateUserId,

}= memberShipSlices.actions

export default memberShipSlices.reducer;