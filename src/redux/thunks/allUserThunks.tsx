import { createAsyncThunk } from "@reduxjs/toolkit";

const allUsers = createAsyncThunk('allUsers/getAllUsers', async() => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API}/api/users`,{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`,
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.log("error", error)
    }
});

export default allUsers;