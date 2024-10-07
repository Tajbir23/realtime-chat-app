import { createAsyncThunk } from "@reduxjs/toolkit";

const notificationThunk = createAsyncThunk('notifications/notificationThunk', async ({page, limit}: {page: number, limit: number}) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API}/api/notifications?page=${page}&limit=${limit}`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('token')}`,
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
})

export default notificationThunk;