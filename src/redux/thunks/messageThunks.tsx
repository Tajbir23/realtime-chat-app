import { createAsyncThunk } from "@reduxjs/toolkit";
import { socket } from "../../hooks/useSocket";

const messageThunk = createAsyncThunk('message/message', async(data: {id: string; currentPage: number}, thunkAPI) => {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${import.meta.env.VITE_API}/api/message/${data.id}?currentPage=${data.currentPage}`,{
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
        const messages = await response.json();
        return messages;
    } catch (error) {
        socket.emit('logout')
        return thunkAPI.rejectWithValue(error);
    }
})

export default messageThunk;