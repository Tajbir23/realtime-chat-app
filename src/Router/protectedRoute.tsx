import { useDispatch, useSelector } from "react-redux";
import user from "../redux/thunks/userThunks";
import { useEffect } from "react";
import { AppDispatch } from "../redux/app/store";
import { Navigate } from "react-router-dom";


const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const dispatch = useDispatch<AppDispatch>()
    const userData = useSelector((state: { user: { isLoading: boolean; user: { error: string }, error: string; } }) => state.user)
    
    console.log(userData)
    useEffect(() => {
        dispatch(user())
    },[dispatch])

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
