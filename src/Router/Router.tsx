import { createBrowserRouter } from "react-router-dom";
import Chat from "../layout/Chat";
import Signup from "../pages/Authentication/Signup";
import Login from "../pages/Authentication/Login";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Chat />
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