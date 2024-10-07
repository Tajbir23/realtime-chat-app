import { createAsyncThunk } from "@reduxjs/toolkit";

const unreadNotifications = createAsyncThunk('notifications/unreadNotifications', async() => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${import.meta.env.VITE_API}/api/notifications/unread`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    const data = await response.json();
    console.log(data.notificationCount);
    return data.notificationCount
})

export default unreadNotifications;