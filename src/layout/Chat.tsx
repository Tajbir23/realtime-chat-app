
import Aside from "../component/Chat/Aside"

import { Outlet, useNavigate } from "react-router-dom"
import Aos from "aos";
import 'aos/dist/aos.css';
import { useEffect } from "react";
import { socket } from "../hooks/useSocket";
// import Video from "../component/Chat/call/Video";


const Chat = () => {
  const navigate = useNavigate()
  useEffect(() => {
    Aos.init({
      duration: 1000,
      once: true,
    })
  },[])

  useEffect(() => {
    Notification.requestPermission();
    if(Notification.permission === 'default'){
      Notification.requestPermission();
    }
  },[])

  useEffect(() => {
    socket.on('likeAndCommentNotification', (data) => {
      const notification = new Notification('like', {
        body: data?.message,
        icon: '/favicon.ico',
      });
      notification.onclick = () => {
        window.focus()
        navigate(`/my_day`)
      };
    })
    return () => {
      socket.off('likeAndCommentNotification')
    }
  },[])

  return (
    <div className="flex gap-1">
        <Aside />
        <Outlet />
        {/* <Video /> */}
    </div>
  )
}

export default Chat