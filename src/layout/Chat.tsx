import { useSelector } from "react-redux"
import Aside from "../component/Chat/Aside"

import ToggleStateCheck from "../redux/typeCheck/toggle"
import { Outlet } from "react-router-dom"


const Chat = () => {
  const toggleValue: boolean = useSelector((state: ToggleStateCheck) => state.toggle.isOpen)
  return (
    <div className="flex gap-5">
        <Aside />
        <Outlet />
    </div>
  )
}

export default Chat