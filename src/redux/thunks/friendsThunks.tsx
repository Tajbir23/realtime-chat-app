import { createAsyncThunk } from "@reduxjs/toolkit";

const friends = createAsyncThunk('friends/friends', async(currentPage?: number) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API}/api/friends?currentPage=${currentPage}`,{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`,
            },
        })
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching friends', error);
        throw error;
    }
});

export default friends;