import { createAsyncThunk } from "@reduxjs/toolkit"

const user = createAsyncThunk('user/userValidation', async() => {
    const token = localStorage.getItem('token')
    const response = await fetch(`${import.meta.env.VITE_API}/api/user_validation`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    const data = response.json()
    return data
})

export default user