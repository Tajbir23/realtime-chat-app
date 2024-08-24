import { createBrowserRouter } from "react-router-dom";
import Chat from "../layout/Chat";
import Signup from "../pages/Authentication/Signup";
import Login from "../pages/Authentication/Login";
import ProtectedRoute from "./protectedRoute";

const router = createBrowserRouter([
    {
        path: "/",
        element: <ProtectedRoute><Chat /></ProtectedRoute>
    },
    {
        path: "/signup",
        element: <Signup />
    },
    {
        path: "/login",
        element: <Login />
    }
])

export default router;