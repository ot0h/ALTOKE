import {configureStore} from "@reduxjs/toolkit"
import userProfileReducers from "./slices/userProfileSlice"
import communityReducers from "./slices/communitySlice"
import memberShipReducers from "./slices/memberShipSlice"
import reportReducers from "./slices/reportSlice"
import postReducers from "./slices/postSlice"
import categoryReducers from "./slices/categorySlice"

export const store =  configureStore ({
    reducer: {
        userProfile : userProfileReducers,
        community: communityReducers,
        memberShip: memberShipReducers,
        report: reportReducers,
        post: postReducers,
        category: categoryReducers
        },

});


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;