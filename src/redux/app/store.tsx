
import { configureStore } from "@reduxjs/toolkit";
import toggleReducer from "../features/toggle/toggleSlice";
import userReducer from '../features/user/userSlice';
import messageReducer from '../features/message/messageSlice';
import allUsersReducer from '../features/user/allUsersSlice';
import friendsReducer from '../features/user/friendsSlice';
import totalLikeCommentReducer from '../features/likeAndComment/totalLikeCommentSlice';
import notificationReducer from '../features/notification/notificationSlice';


const store = configureStore({
  reducer: {
    toggle: toggleReducer,
    user: userReducer,
    message: messageReducer,
    allUsers: allUsersReducer,
    friends: friendsReducer,
    totalLikeComment: totalLikeCommentReducer,
    notification: notificationReducer
  },
});

export type AppDispatch = typeof store.dispatch;

// export type RootState = ReturnType<typeof store.getState>;

export default store;
