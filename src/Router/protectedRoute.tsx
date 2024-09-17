import { useDispatch, useSelector } from "react-redux";
import user from "../redux/thunks/userThunks";
import { useEffect } from "react";
import { AppDispatch } from "../redux/app/store";
import { Navigate } from "react-router-dom";
import { socket } from "../hooks/useSocket";

// const socket = io(`${import.meta.env.VITE_API}`)

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    
    const dispatch = useDispatch<AppDispatch>()
    const userData = useSelector((state: { user: { isLoading: boolean; user: { error: string; email: string }, error: string; } }) => state.user)
    console.log(userData)
    const token = localStorage.getItem('token')
    
    useEffect(() => {
        dispatch(user())
    },[dispatch])

    
    if(userData?.isLoading){
      return <div className="h-screen flex items-center justify-center">
        <h1 className="text-5xl font-bold">Loading...</h1>
      </div>
    }

    socket.emit('connected', userData.user)
    
    if(userData?.user?.error === "read ECONNRESET" || !token){
      localStorage.removeItem('token')
      socket.emit('logout')
      return <Navigate to="/login" />
    }

  return children;
};

export default ProtectedRoute
