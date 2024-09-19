
import Aside from "../component/Chat/Aside"

import { Outlet } from "react-router-dom"
import Aos from "aos";
import 'aos/dist/aos.css';
import { useEffect } from "react";

const Chat = () => {
  useEffect(() => {
    Aos.init({
      duration: 1000,
      once: true,
    })
  },[])
  return (
    <div className="flex gap-5">
        <Aside />
        <Outlet />
    </div>
  )
}

export default Chat