import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UserProfile = {
    id: string
    name: string
    email: string
    avatar?: string
}

const initialUserProfile: UserProfile = {
    id: "",
    name: "",
    email: "",
    avatar: "",

}

const userProfileSlice = createSlice({
    name: "userProfile",
    initialState: initialUserProfile,
    reducers: {
        updateProfile: (state, action: PayloadAction<UserProfile>)=>{

        },
        updateName: (state, action: PayloadAction<string>) =>{

        },
        updateEmail: (state, action: PayloadAction<string> )=>{

        },
        updateAvatar:(state, action: PayloadAction<string>)=>{

        },
        updateId:(state, action: PayloadAction<string>)=>{

        },  

    }
});

export const {
    updateAvatar,
    updateEmail,
    updateId,
    updateProfile,
    updateName
} = userProfileSlice.actions;

export default userProfileSlice.reducer;