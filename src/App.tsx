// import { useEffect } from "react";
import Chat from "./layout/Chat"
// import { socket } from "./hooks/useSocket";
// import { useDispatch } from "react-redux";
// import { AppDispatch } from "./redux/app/store";
// import { incrementNotificationCount } from "./redux/features/notification/notificationSlice";
// import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";

function App() {
  // const dispatch = useDispatch<AppDispatch>()
  // const navigate = useNavigate()
  // useEffect(() => {
  //   Notification.requestPermission();
  //   if(Notification.permission === 'default'){
  //     Notification.requestPermission();
  //   }
  // },[])

  // useEffect(() => {
  //   socket.on('likeAndCommentNotification', (data) => {
  //     console.log(data)
  //     dispatch(incrementNotificationCount())
  //     toast.success('You have a new notification')
  //     const notification = new Notification('like', {
  //       body: data?.message,
  //       icon: '/favicon.ico',
  //     });
  //     notification.onclick = () => {
  //       window.focus()
  //       navigate(`/my_day`)
  //     };
  //   })
  //   return () => {
  //     socket.off('likeAndCommentNotification')
  //   }
  // },[dispatch, navigate])
  

  return (
    <>
      <Chat />
    </>
  )
}

export default App
