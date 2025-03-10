import { createSlice, SerializedError } from "@reduxjs/toolkit";
import friends from "../../thunks/friendsThunks";
import friend from "../../typeCheck/friends";

const initialState = {
    friends: [] as friend[],
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
            const updateFriends = action.payload as friend
            state.friends = state.friends.filter(friend => friend._id !== updateFriends._id)
            state.friends.unshift(updateFriends)
        },
        updateFriendActiveStatus: (state, action) => {
            const updateFriend = action.payload as friend
            const index = state.friends.findIndex(friend => friend._id === updateFriend._id)

            if(index > -1){
                state.friends[index] = updateFriend
            }
        },
        updateTheme: (state, action) => {
            const {theme, themeUpdateBy, _id, themeType} = action.payload as friend
            const friend = state.friends.find(friend => friend._id === _id)
            if(friend){
                friend.theme = theme
                friend.themeUpdateBy = themeUpdateBy
                friend.themeType = themeType
            }
        },
        deleteFriend: (state, action) => {
            const _id = action.payload as string
            state.friends = state.friends.filter(friend => friend._id !== _id)
        },
        updateFriend: (state, action) => {
            const {_id, isEncrypted, publicKey} = action.payload as friend
            const friend = state.friends.find(friend => friend._id === _id)
            console.log("friend id",friend, _id)
            if(friend){
                friend.isEncrypted = isEncrypted
                friend.publicKey = publicKey
                
            }
        },
        updateFriendListSeen: (state, action) => {
            const chatId = action.payload as string
            const friend = state.friends.find(friend => friend._id === chatId)
            if(friend){
                friend.lastMessageSeen = true
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
            const newFriends = action.payload as friend[]
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

export const { incrementPage, replaceFriends, updateFriendActiveStatus, updateTheme, deleteFriend, updateFriend, updateFriendListSeen} = friendsSlice.actions;

export default friendsSlice.reducer;