import { createBrowserRouter } from "react-router-dom";
import Chat from "../layout/Chat";
import Signup from "../pages/Authentication/Signup";
import Login from "../pages/Authentication/Login";
import ProtectedRoute from "./protectedRoute";
import ChatLayout from "../component/Chat/Chat";

const router = createBrowserRouter([
    {
        path: "/",
        element: <ProtectedRoute><Chat /></ProtectedRoute>,
        children: [
            {
                path: "chat/:id",
                element: <ChatLayout />
            }
        ]
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