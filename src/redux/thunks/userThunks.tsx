import { createAsyncThunk } from "@reduxjs/toolkit"
import { socket } from "../../hooks/useSocket"


const user = createAsyncThunk('user/userValidation', async() => {
    const token = localStorage.getItem('token')
    const response = await fetch(`${import.meta.env.VITE_API}/api/user_validation`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    const data = await response.json()
    if(response.status === 404 || response.status === 401 || response.status === 403){
        localStorage.removeItem('token')
        socket.emit('logout')
        throw new Error('Unauthorized')
    }
    console.log('redux thunk',data)
    return data
})

export default user