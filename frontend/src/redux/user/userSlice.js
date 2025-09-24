import { createSlice } from "@reduxjs/toolkit";

const initialState =  {
    currUser : null,
    loading : false
}

const userSlice = createSlice({
    name : 'user',
    initialState,
    reducers : {
        signInStart : (state)=>{
            state.loading = true
        },
        signInSuccess : (state,action)=>{
              state.currUser =  action.payload,
              state.loading = false
        },
        signInFailure : (state)=>{
           state.loading = false;
        },
        signOutSuccess: (state)=>{
            state.currUser = null;
        }

    }
})

export const {signInStart, signInSuccess, signInFailure, signOutSuccess} = userSlice.actions;
export default userSlice.reducer 