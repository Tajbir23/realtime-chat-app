import { useSelector } from "react-redux"
import Aside from "../component/Chat/Aside"
import ChatLayout from "../component/Chat/Chat"
import ToggleStateCheck from "../redux/typeCheck/toggle"


const Chat = () => {
  const toggleValue: boolean = useSelector((state: ToggleStateCheck) => state.toggle.isOpen)
  return (
    <div className="flex gap-5">
        {toggleValue && <Aside />}

        <div className="w-full sm:ml-[35%] ml-0 md:ml-14 mr-5">
            <ChatLayout />
        </div>
    </div>
  )
}

export default Chat