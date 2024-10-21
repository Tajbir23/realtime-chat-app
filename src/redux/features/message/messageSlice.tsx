import { createSlice, SerializedError } from "@reduxjs/toolkit"
import messageThunk from "../../thunks/messageThunks"
import message from "../../typeCheck/message"


const initialState = {
    messages: [] as message[],
    isLoading: false,
    error: '' as string | SerializedError,
    page: {} as {[key: string] : number},
    hasMore: true
}

const messageSlice = createSlice({
    name: 'message',
    initialState,
    reducers: {
        incrementPage : (state, action: {payload: {id: string}}) => {
            const {id} = action.payload
            if(state.page[id]){
                state.page[id] += 1
            }else {
                state.page[id] = 2
            }
        },
        adMessage: (state, action) => {
            const newMessage = action.payload as message

            const existingMessage = state.messages.find(msg => msg._id === newMessage._id)

            if(!existingMessage){
                state.messages.unshift(newMessage)
            }

        },
        updateEmoji: (state, action) => {
            const {_id, emoji, receiverId} = action.payload
            const message = state.messages.find(msg => msg._id === _id)
            if(message){
                message.emoji = emoji
                message.receiverId = receiverId
            }
        },
        deleteMessage: (state, action) => {
            const _id = action.payload
            state.messages = state.messages.filter(msg => msg._id !== _id)
        },
        deleteEncryptedMessage: (state, action) => {
            const chatId = action.payload
            state.messages = state.messages.filter(msg => !(msg.chatId === chatId && msg.isEncrypted === true))
        },
        updateMessage: (state, action) => {
            const {_id, message, unsent, edited} = action.payload
            const messageToUpdate = state.messages.find(msg => msg._id === _id)
            if(messageToUpdate){
                messageToUpdate.message = message
                messageToUpdate.unsent = unsent
                messageToUpdate.edited = edited
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

export const { incrementPage, adMessage, updateEmoji, deleteMessage, updateMessage, deleteEncryptedMessage } = messageSlice.actions

export default messageSlice.reducer