import { SlOptionsVertical } from "react-icons/sl";
import message from "../../../redux/typeCheck/message";
import userTypeCheck from "../../../redux/typeCheck/user";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { deleteMessage, updateMessage } from "../../../redux/features/message/messageSlice";

const MessageOptions = ({ msg, user, myInfo }: { msg: message, user: userTypeCheck, myInfo: userTypeCheck }) => {
    const [isOpen, setIsOpen] = useState(false)
    const optionRef = useRef(null)
    const dispatch = useDispatch()

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent | TouchEvent | KeyboardEvent) => {
          if (optionRef.current && !(optionRef.current as Node).contains(event.target as Node)) {
              setIsOpen(false)
          }
      }
          document.addEventListener('mousedown', handleClickOutside)
          document.addEventListener('touchstart', handleClickOutside)
          document.addEventListener('keydown', handleClickOutside)
          return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            document.removeEventListener('touchstart', handleClickOutside)
            document.removeEventListener('keydown', handleClickOutside)
          }
    },[optionRef])

    const handleDelete = async(type: string) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API}/api/message/delete/${msg._id}`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    type,
                    messageId: msg._id,
                    opponentId: myInfo._id !== user._id ? user._id : ''
                })
            })
            const data = await res.json()
            console.log(data)
            if(res.ok && data){
                if(type === "deleteForMe"){
                    dispatch(deleteMessage(msg._id))
                }
                if(type === "unsent"){
                    dispatch(updateMessage(data))
                }
            }
        } catch (error) {
            console.log(error)
        }

    }
  return (
    <div className="relative">
      {/* Vertical Dots Icon */}
      <div className="h-full items-center hidden group-hover:flex cursor-pointer">
        <SlOptionsVertical onClick={() => setIsOpen(!isOpen)} className="text-center text-gray-500 hover:text-gray-700 transition-all duration-150" />
      </div>

      {/* Options Menu */}
      {isOpen && <div
        ref={optionRef}
        className={`flex flex-col absolute ${
          msg.senderId === myInfo._id ? 'right-0' : 'left-0'
        } top-8 bg-white shadow-md rounded-md p-2 w-40 z-10 transition-all duration-200`}
      >
        <button onClick={() => handleDelete('deleteForMe')} className="py-2 px-4 hover:bg-gray-100 rounded-md text-sm text-gray-800">
          Delete for me
        </button>
        {(msg.senderId === myInfo._id) && (
          <>
            <button onClick={() => handleDelete('unsent')} className="py-2 px-4 hover:bg-gray-100 rounded-md text-sm text-gray-800">
              Unsent
            </button>
            <button className="py-2 px-4 hover:bg-gray-100 rounded-md text-sm text-gray-800">
              Edit
            </button>
          </>
        )}
      </div>}
    </div>
  );
};

export default MessageOptions;
