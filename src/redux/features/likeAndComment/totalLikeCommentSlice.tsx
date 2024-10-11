import { createSlice } from '@reduxjs/toolkit';
import totalLikeCommentType from '../../typeCheck/totalLikeCommentType';
import totalLikeCommentThunk from '../../thunks/totalLikeCommentThunks';
const initialState = {
    totalLikeComment: {
        totalLike: 0,
        totalComment: 0,
        totalShare: 0,
        like: false,
    } as totalLikeCommentType,
    isLoading: false,
    error: "",
}

const totalLikeCommentSlice = createSlice({
    name: 'totalLikeComment',
    initialState,
    reducers: {
        incrementLike : (state) => {
            state.totalLikeComment.totalLike += 1
        },
        myLike: (state, action) => {
            state.totalLikeComment.like = action.payload
        },
        addTotalLike: (state, action) => {
            state.totalLikeComment.totalLike = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(totalLikeCommentThunk.pending, (state) => {
            state.error = ""
            state.isLoading = true
        })
        .addCase(totalLikeCommentThunk.fulfilled, (state, action) => {
            state.isLoading = false
            state.error = ""
            state.totalLikeComment.totalLike = action.payload.totalLike
            state.totalLikeComment.totalComment = action.payload.totalComment
            state.totalLikeComment.like = action.payload.myLike
            state.totalLikeComment.totalShare = action.payload.totalShare ? action.payload.totalShare : 0
        })
        .addCase(totalLikeCommentThunk.rejected, (state) => {
            state.isLoading = false
            state.error = "Something went wrong"
        })
    },
})

export const { incrementLike, myLike, addTotalLike } = totalLikeCommentSlice.actions;

export default totalLikeCommentSlice.reducer;