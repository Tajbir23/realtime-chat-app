import { createSlice, SerializedError } from "@reduxjs/toolkit"
import messageThunk from "../../thunks/messageThunks"
import message from "../../typeCheck/message"


const initialState = {
    messages: [] as message[],
    isLoading: false,
    error: '' as string | SerializedError,
    page: 1,
    hasMore: true
}

const messageSlice = createSlice({
    name: 'message',
    initialState,
    reducers: {
        incrementPage : (state) => {
            state.page += 1
        },
        adMessage: (state, action) => {
            const newMessage = action.payload as message

            const existingMessage = state.messages.find(msg => msg._id === newMessage._id)

            console.log("existing message: ", existingMessage?._id)
            if(!existingMessage){
                state.messages.unshift(newMessage)
            }

        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(messageThunk.pending, (state) => {
                state.isLoading = true
            })
            .addCase(messageThunk.fulfilled, (state, action) => {
                state.isLoading = false
                state.error = ''
                const newMessage = action.payload as message[]

                console.log("new message", action.payload)
                const existingMessage = new Set(state.messages.map(msg => msg._id))
                
                const uniqueNewMessage = newMessage.filter(msg => !existingMessage.has(msg._id))
                

                state.messages = [...state.messages, ...uniqueNewMessage]
            })
            .addCase(messageThunk.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.error
                
            })
    }
})

export const { incrementPage, adMessage } = messageSlice.actions

export default messageSlice.reducer