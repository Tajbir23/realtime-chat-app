import { createSlice } from "@reduxjs/toolkit";
import notificationState from "../../typeCheck/notificationState";
import notificationThunk from "../../thunks/notificationsThunk";
import notificationType from "../../typeCheck/notificationType";
import unreadNotifications from "../../thunks/unreadNotifiactionCountThunk";

const initialState: notificationState = {
    isLoading: false,
    notifications: [],
    error: null,
    page: 0,
    hasMore: true,
    totalNotifications: 0,
}

const notificationSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        incrementNotificationCount: (state) => {
            state.totalNotifications += 1
        },
        addNewNotification: (state, action) => {
            state.notifications.unshift(action.payload)
        }
    },
    extraReducers(builder) {
        builder
        .addCase(notificationThunk.pending, (state) => {
            state.isLoading = true
            state.error = null
        })
        .addCase(notificationThunk.fulfilled, (state, action) => {
            state.isLoading = false
            state.error = null
            const newNotifications = action.payload as notificationType[]
            

            if(newNotifications.length > 0){
                
            console.log('newNotifications', newNotifications)

            const existingNotifications = new Set(state.notifications.map(notification => notification._id));
            const uniqueNewNotifications = newNotifications.filter(notification =>!existingNotifications.has(notification._id));

            console.log('uniqueNewNotifications', uniqueNewNotifications)

            state.notifications = [...state.notifications,...uniqueNewNotifications]
            state.page += 1
            }
            else{
                state.hasMore = false
            }
        })
        .addCase(notificationThunk.rejected, (state, action) => {
            state.isLoading = false
            state.error = action.error instanceof Error? action.error : new Error(action.error?.message || 'Unknown error');
        })
        .addCase(unreadNotifications.fulfilled, (state, action) => {
            state.totalNotifications = action.payload
        })
    },
})

export const { incrementNotificationCount, addNewNotification } = notificationSlice.actions;

export default notificationSlice.reducer;