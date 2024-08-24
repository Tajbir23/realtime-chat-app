import { createSlice, } from "@reduxjs/toolkit";
import userTypeCheck from '../../typeCheck/user';
import user from '../../thunks/userThunks'


interface userState{
    isLoading: boolean;
    user: userTypeCheck | null;
    error: string | null;
}

const initialState: userState = {
    isLoading: false,
    user: null,
    error: null,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        
    },
    extraReducers: (builder) => {
        builder
        .addCase(user.pending, (state) => {
            state.isLoading = true
        })
        .addCase(user.fulfilled, (state, action) => {
            state.isLoading = false
            state.user = action.payload
        })
        .addCase(user.rejected, (state, action) => {
            state.isLoading = false
            state.error = action.error?.message || null
        })
    }
})

export default userSlice.reducer