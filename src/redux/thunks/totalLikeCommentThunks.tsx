import { createAsyncThunk } from "@reduxjs/toolkit";

const totalLikeCommentThunk = createAsyncThunk(
    'totalLikeComment/totalLikeComment',
    async ({ userId, myDayId }: { userId?: string; myDayId?: string }) => {
        try {
            const data = await fetch(`${import.meta.env.VITE_API}/api/total_like_and_comments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ userId, myDayId }),
            })
            return await data.json()
        } catch (error) {
            return error
        }
    }
)

export default totalLikeCommentThunk;