import { useDispatch, useSelector } from "react-redux";
import user from "../redux/thunks/userThunks";
import { useEffect } from "react";
import { AppDispatch } from "../redux/app/store";
import { Navigate } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io(`${import.meta.env.VITE_API}`)

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const dispatch = useDispatch<AppDispatch>()
    const userData = useSelector((state: { user: { isLoading: boolean; user: { error: string; email: string }, error: string; } }) => state.user)
    
    useEffect(() => {
        dispatch(user())
    },[dispatch])

    socket.emit('connected', userData.user?.email)
    if(userData?.isLoading){
      return <div className="h-screen flex items-center justify-center">
        <h1 className="text-5xl font-bold">Loading...</h1>
      </div>
    }

    if(userData?.user?.error){
      return <Navigate to="/login" />
    }

  return children;
};

export default ProtectedRoute
