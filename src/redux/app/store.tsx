
import { configureStore } from "@reduxjs/toolkit";
import toggleReducer from "../features/toggle/toggleSlice";
import userReducer from '../features/user/userSlice';
import messageReducer from '../features/message/messageSlice';

const store = configureStore({
  reducer: {
    toggle: toggleReducer,
    user: userReducer,
    message: messageReducer
  },
});

export type AppDispatch = typeof store.dispatch;

// export type RootState = ReturnType<typeof store.getState>;

export default store;
