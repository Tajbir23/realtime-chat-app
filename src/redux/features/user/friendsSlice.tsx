import { createSlice, SerializedError } from "@reduxjs/toolkit";
import userTypeCheck from "../../typeCheck/user";
import friends from "../../thunks/friendsThunks";

const initialState = {
    friends: [] as userTypeCheck[],
    isLoading: false,
    error: '' as string | SerializedError,
    page: 1,
    hasMore: true,
    totalFriends: 0,
}

const friendsSlice = createSlice({
    name: 'friends',
    initialState,
    reducers: {
        incrementPage: (state) => {
            state.page += 1
        },
        replaceFriends: (state, action) => {
            const updateFriends = action.payload as userTypeCheck[]
            console.log(updateFriends[0])
            const index = state.friends.findIndex(friend => friend._id === updateFriends[0]._id)

            if(index > -1){
                // state.friends[index] = updateFriends
                state.friends.splice(index, 1)
                state.friends.unshift(updateFriends[0])
            }
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(friends.pending, (state) => {
            state.isLoading = true
        })
        .addCase(friends.fulfilled, (state, action) => {
            state.isLoading = false
            state.error = ''
            const newFriends = action.payload as userTypeCheck[]
            const existingFriend = new Set(state.friends.map(friend => friend._id))
            const uniqueNewFriends = newFriends.filter(friend =>!existingFriend.has(friend._id))
            state.friends = [...state.friends,...uniqueNewFriends]
        })
        .addCase(friends.rejected, (state, action) => {
            state.isLoading = false
            state.error = action.error instanceof Error? action.error : new Error(action.error?.message || 'Unknown error');
        })
    }
})

export const { incrementPage, replaceFriends } = friendsSlice.actions;

export default friendsSlice.reducer;