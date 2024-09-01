
import Aside from "../component/Chat/Aside"

import { Outlet } from "react-router-dom"


const Chat = () => {
  
  return (
    <div className="flex gap-5">
        <Aside />
        <Outlet />
    </div>
  )
}

export default Chat