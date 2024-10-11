
import Aside from "../component/Chat/Aside"

import { Outlet, useNavigate } from "react-router-dom"
import Aos from "aos";
import 'aos/dist/aos.css';
import { useEffect } from "react";
import { socket } from "../hooks/useSocket";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { addNewNotification, incrementNotificationCount } from "../redux/features/notification/notificationSlice";
import { updateMessage } from "../redux/features/message/messageSlice";
// import Video from "../component/Chat/call/Video";


const Chat = () => {
  const dispatch = useDispatch()
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

      dispatch(incrementNotificationCount())
      dispatch(addNewNotification(data?.newNotification))
      toast.success('You have a new notification')
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
  },[dispatch, navigate])

  useEffect(() => {
    socket.on('updateMessage', (message) => {
      dispatch(updateMessage(message))
    })
    return () => {
      socket.off('updateMessage')
    }
  },[dispatch])

  
  return (
    <div className="flex gap-1">
        <Aside />
        <Outlet />
        {/* <Video /> */}
    </div>
  )
}

export default Chat