import { createSlice } from '@reduxjs/toolkit';
import totalLikeCommentType from '../../typeCheck/totalLikeCommentType';
import totalLikeCommentThunk from '../../thunks/totalLikeCommentThunks';
const initialState = {
    totalLikeComment: {} as totalLikeCommentType,
    isLoading: false,
    error: Error,
}

const totalLikeCommentSlice = createSlice({
    name: 'totalLikeComment',
    initialState,
    reducers: {
        incrementLike : (state) => {
            state.totalLikeComment.totalLike += 1
        },
        myLike: (state) => {
            state.totalLikeComment.like = !state.totalLikeComment.like
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(totalLikeCommentThunk.pending, (state) => {
            state.error = null as unknown as ErrorConstructor
            state.isLoading = true
        })
        .addCase(totalLikeCommentThunk.fulfilled, (state, action) => {
            state.isLoading = false
            state.error = null as unknown as ErrorConstructor
            state.totalLikeComment.totalLike = action.payload.totalLike
            state.totalLikeComment.totalComment = action.payload.totalComment
        })
        .addCase(totalLikeCommentThunk.rejected, (state, action) => {
            state.isLoading = false
            state.error = action.error as ErrorConstructor
        })
    },
})

export const { incrementLike, myLike } = totalLikeCommentSlice.actions;

export default totalLikeCommentSlice.reducer;