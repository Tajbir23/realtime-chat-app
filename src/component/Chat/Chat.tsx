import { FaToggleOn } from "react-icons/fa"
import { useDispatch, useSelector } from "react-redux"
import { toggle } from "../../redux/features/toggle/toggleSlice";
import ToggleStateCheck from "../../redux/typeCheck/toggle";


const ChatLayout = () => {
  const dispatch = useDispatch();
  const toggleValue: boolean = useSelector((state: ToggleStateCheck) => state.toggle.isOpen)

  return (
    <div className="w-full flex flex-col">
      <div className="flex gap-5 items-center p-5 border-b border-black fixed w-full">
        {!toggleValue && <FaToggleOn onClick={() => dispatch(toggle())} className="text-4xl cursor-pointer" />}
        <h1 className="text-xl font-bold">Chat with <span className="text-green-800">Omuk</span></h1>
      </div>

      <div className="mt-20">
        {/* opponent message start */}
        <div className="flex gap-5">
          <img className="h-8 w-8 rounded-full" src="https://i.ibb.co/6XLHVGH/12555.jpg" alt="image not found" />
          <div>
            <h1 className="font-semibold mb-3">Tajbir islam</h1>
            <h1 className="max-w-md bg-gray-500 p-5 rounded-xl break-words">Hello worldaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa </h1>
          </div>
        </div>
        {/* opponent message end */}

        {/* my message start */}
        <div className="flex gap-5 float-right">
          <div>
            <h1 className="max-w-md bg-green-500 p-5 rounded-xl break-words">Hello worldaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa </h1>
          </div>
        </div>
        {/* my message end */}
      </div>

      <form className="w-full p-5 border-t border-black fixed bottom-0 mr-5 flex items-center gap-5 mt-auto">
        <input type="text" placeholder="Enter your text..." className=" py-2 px-3 border border-black outline-none rounded-md" />
        <input type="file" />
        <button type="submit" className="bg-green-500 text-white py-2 px-3 rounded-md">Send</button>
      </form>
    </div>
  )
}

export default ChatLayout