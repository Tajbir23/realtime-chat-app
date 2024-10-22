import { useDispatch, useSelector } from "react-redux";
import user from "../redux/thunks/userThunks";
import { useEffect } from "react";
import { AppDispatch } from "../redux/app/store";
import { Navigate } from "react-router-dom";
import { socket } from "../hooks/useSocket";


// const socket = io(`${import.meta.env.VITE_API}`)

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    
    const dispatch = useDispatch<AppDispatch>()
    const userData = useSelector((state: { user: { isLoading: boolean; user: { error: string; email: string, _id: string }, error: string; } }) => state.user)
    
    const token = localStorage.getItem('token')
    const uid = localStorage.getItem('uid')

    useEffect(() => {
        dispatch(user())
    },[dispatch])

    
    if(userData?.isLoading && !userData.user){
      return <div className="h-screen flex items-center justify-center">
        <h1 className="text-5xl font-bold">Loading...</h1>
      </div>
    }

    
    if(userData?.user?.error === "read ECONNRESET" || !token || !uid){
      localStorage.removeItem('token')
      localStorage.removeItem('uid')
      socket.emit('logout')
      return <Navigate to="/login" />
    }

    console.log("userData",userData)

    const userInfo = {
      _id: userData.user?._id,
      uid
    }
    socket.emit('connected', userInfo)
    


  return children;
};

export default ProtectedRoute
