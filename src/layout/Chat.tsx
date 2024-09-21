
import Aside from "../component/Chat/Aside"

import { Outlet } from "react-router-dom"
import Aos from "aos";
import 'aos/dist/aos.css';
import { useEffect } from "react";
import { socket } from "../hooks/useSocket";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/app/store";
import { addMyDayUpdateInFriend } from "../redux/features/user/friendsSlice";
import { addMyDayUpdateInUsers } from "../redux/features/user/allUsersSlice";

const Chat = () => {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    Aos.init({
      duration: 1000,
      once: true,
    })
  },[])

  useEffect(() => {
    socket.on("myDay", (day) => {
        console.log(day)
        dispatch(addMyDayUpdateInFriend(day))
        dispatch(addMyDayUpdateInUsers(day))
    });

    return () => {
        socket.off("myDay");
    };
}, [dispatch]);


  return (
    <div className="flex gap-1">
        <Aside />
        <Outlet />
    </div>
  )
}

export default Chat