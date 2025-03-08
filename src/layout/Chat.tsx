import Aside from "../component/Chat/Aside"
import { Outlet, useNavigate } from "react-router-dom"
import Aos from "aos";
import 'aos/dist/aos.css';
import { useEffect } from "react";
import { socket } from "../hooks/useSocket";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { addNewNotification, incrementNotificationCount } from "../redux/features/notification/notificationSlice";
import { deleteEncryptedMessage, updateMessage } from "../redux/features/message/messageSlice";
import { updateFriend, updateTheme } from "../redux/features/user/friendsSlice";
import { Helmet } from 'react-helmet-async';
// import Video from "../component/Chat/call/Video";


const Chat = () => {
  console.log(`
    ████████╗ █████╗      ██╗██████╗ ██╗██████╗ 
    ╚══██╔══╝██╔══██╗     ██║██╔══██╗██║██╔══██╗
       ██║   ███████║     ██║██████╔╝██║██████╔╝
       ██║   ██╔══██║██   ██║██╔══██╗██║██╔══██╗
       ██║   ██║  ██║╚█████╔╝██████╔╝██║██║  ██║
       ╚═╝   ╚═╝  ╚═╝ ╚════╝ ╚═════╝ ╚═╝╚═╝  ╚═╝
  `);
 
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const userData = useSelector((state: { user: { isLoading: boolean; user: { error: string; email: string }, error: string; } }) => state.user)

  useEffect(() => {
    socket.emit('connected', userData.user)
    return () => {
      socket.off('connected')
    }
  },[userData.user])

  useEffect(() => {
    Aos.init({
      duration: 1000,
      once: true,
    })
  },[])

  useEffect(() => {
    // Check if the browser supports notifications
    if (!("Notification" in window)) {
      console.log("This browser does not support desktop notifications");
      return;
    }

    // Request permission only if not already granted
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    socket.on('likeAndCommentNotification', (data) => {
     
      dispatch(incrementNotificationCount());
      dispatch(addNewNotification(data?.newNotification));
      toast.success('You have a new notification');

      // Only create notification if permission is granted
      if (Notification.permission === 'granted') {
        console.log("notification test", true)
        const notification = new Notification(data?.title || 'New Notification', {
          body: data?.message,
          requireInteraction: true,
          icon: '/favicon.ico',
        });
        
        console.log(notification)
        notification.onclick = () => {
          window.focus();
          navigate(`/my_day`);
        };
      }
    });
    return () => {
      socket.off('likeAndCommentNotification');
    };
  }, [dispatch, navigate]);

  useEffect(() => {
    socket.on('updateMessage', (message) => {
      dispatch(updateMessage(message))
    })
    return () => {
      socket.off('updateMessage')
    }
  },[dispatch])
  
  useEffect(() => {
    socket.on('themeUpdate', (data) => {
      dispatch(updateTheme(data))
    })
    return () => {
      socket.off('themeUpdate')
    }
  },[dispatch])

  useEffect(() => {
    socket.on('privateKey', (data) => {
      const privateKey = data.privateKey
      const chatId = data._id
      console.log(privateKey)
      if(data.isEncrypted){
        sessionStorage.setItem(chatId, privateKey)
      }else{
        sessionStorage.removeItem(chatId)
        dispatch(deleteEncryptedMessage(chatId))
      }
      dispatch(updateFriend(data))
    })
    return () => {
      socket.off('privateKey')
    }
  },[dispatch])
  
  return (
    <>
      <Helmet>
        <title>Messages | Tajbir</title>
        <meta name="description" content="Chat with your friends and connections on Tajbir. Send messages, share updates, and stay connected." />
        <meta name="keywords" content="messages, chat, instant messaging, Tajbir chat, social messaging, real time chat, chat app, chat application" />
        <meta property="og:title" content="Messages | Tajbir" />
        <meta property="og:description" content="Chat with your friends and connections on Tajbir. Send messages, share updates, and stay connected." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="/messages" />
        <meta name="author" content="Tajbir" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#000000" />
        <meta name="msapplication-navbutton-color" content="#000000" />
        <meta name="apple-mobile-web-app-status-bar-style" content="#000000" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@Tajbir" />
        <meta name="twitter:creator" content="@Tajbir" />
        <meta name="twitter:title" content="Messages | Tajbir" />
        <meta name="twitter:description" content="Chat with your friends and connections on Tajbir. Send messages, share updates, and stay connected." />
        <meta name="twitter:image" content="/favicon.ico" />
        <meta name="twitter:url" content="https://realtime-chat-app-tajbir.web.app" />
        <meta name="twitter:label1" content="Written by" />
        <meta name="twitter:data1" content="Tajbir" />
        <meta name="twitter:label2" content="Filed under" />
        <meta name="twitter:data2" content="Tajbir" />
        <meta name="twitter:label3" content="Fetched for" />
        <meta name="twitter:data3" content="Tajbir" />
        <meta name="twitter:label4" content="Category" />
        <meta name="twitter:data4" content="Tajbir" />
        <meta name="twitter:label5" content="Tags" />
        <meta name="twitter:data5" content="Tajbir" />
        <meta name="twitter:label6" content="Fetched for" />
        <meta name="twitter:data6" content="Tajbir" />
        <meta name="twitter:label7" content="Fetched for" />
        <meta name="twitter:data7" content="Tajbir" />
        <meta name="twitter:label8" content="Fetched for" />
        <meta name="twitter:data8" content="Tajbir" />
        <meta name="twitter:label9" content="Fetched for" />
        <meta name="twitter:data9" content="Tajbir" />
        <meta name="twitter:label10" content="Fetched for" />
        <meta name="twitter:data10" content="Tajbir" />
        <meta name="twitter:label11" content="Fetched for" />
        <meta name="twitter:data11" content="Tajbir" />
        <meta name="twitter:label12" content="Fetched for" />
        <meta name="twitter:data12" content="Tajbir" />
      </Helmet>
      
      <div className="flex gap-1">
        <Aside />
        <Outlet />
        {/* <Video /> */}
      </div>
    </>
  )
}

export default Chat