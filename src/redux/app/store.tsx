
import { configureStore } from "@reduxjs/toolkit";
import toggleReducer from "../features/toggle/toggleSlice";
import userReducer from '../features/user/userSlice';

const store = configureStore({
  reducer: {
    toggle: toggleReducer,
    user: userReducer
  },
});

export default store;
