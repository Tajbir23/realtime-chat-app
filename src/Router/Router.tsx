import { createBrowserRouter } from "react-router-dom";
import Chat from "../layout/Chat";
import Signup from "../pages/Authentication/Signup";
import Login from "../pages/Authentication/Login";
import ProtectedRoute from "./protectedRoute";
import ChatLayout from "../component/Chat/Chat";
import CreateMyDay from "../pages/MyDay/CreateMyDay";
import Day from "../pages/MyDay/Day";
import MyDay from "../pages/MyDay/MyDay";
import SharedMyDay from "../component/Chat/myDay/SharedMyDay";

const router = createBrowserRouter([
    {
        path: "/",
        element: <ProtectedRoute><Chat /></ProtectedRoute>,
        children: [
            {
                path: "chat/:id",
                element: <ChatLayout />
            },
            {
                path: "create_day",
                element: <CreateMyDay />
            },
            {
                path: "day/:id",
                element: <Day />
            },
            {
                path: "my_day",
                element: <MyDay />
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
    },
    {
        path: "/share/:id",
        element: <SharedMyDay />
    }
])

export default router;