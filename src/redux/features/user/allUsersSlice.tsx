import { createSlice } from '@reduxjs/toolkit';
import allUsersState from '../../typeCheck/allUserState';
import userTypeCheck from '../../typeCheck/user';
import allUsers from '../../thunks/allUserThunks';
const initialState : allUsersState = {
    users: [] as userTypeCheck[],
    isLoading: false,
    error: null,
    page: 1,
    hasMore: true,
    totalUsers: 0 
};

const allUsersSlice = createSlice({
    name: 'allUsers',
    initialState,
    reducers: {
        incrementPage : (state) => {
            state.page += 1
        },
        replaceUser: (state, action) => {
            const updateUser = action.payload as userTypeCheck[]
            const index = state.users.findIndex(user => user._id === updateUser[0]._id)
            if(index > -1){
                state.users[index] = updateUser[0]
                // delete state.users(index)
            }
            // state.users.filter(user => user._id !== updateUser._id)
            // state.users.unshift(updateUser)
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(allUsers.pending, (state) => {
            state.isLoading = true
        })
        .addCase(allUsers.fulfilled, (state, action) => {
            state.isLoading = false
            state.error = null

            const newUser = action.payload as userTypeCheck[]
            const existingUser = new Set(state.users.map(user => user._id))
            const uniqueNewUser = newUser.filter(user =>!existingUser.has(user._id))
            state.users = [...state.users,...uniqueNewUser]
            // state.page = action.payload.page
            // state.hasMore = action.payload.hasMore
            // state.totalUsers = action.payload.totalUsers
        })
        .addCase(allUsers.rejected, (state, action) => {
            state.isLoading = false
            state.error = action.error instanceof Error ? action.error : new Error(action.error?.message || 'Unknown error');
        })
    }
})

export const { replaceUser } = allUsersSlice.actions;

export default allUsersSlice.reducer;