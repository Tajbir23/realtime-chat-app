import { useEffect, useRef } from "react";
import message from "../../../redux/typeCheck/message";
import { useDispatch } from "react-redux";
import { updateMessage } from "../../../redux/features/message/messageSlice";

const MessageEditModal = ({ msg, setIsEdit,}: { msg: message; setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;}) => {
    const modalRef = useRef(null);
    const dispatch = useDispatch()

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | TouchEvent | KeyboardEvent) => {
            if (modalRef.current && !(modalRef.current as Node).contains(event.target as Node)) {
                setIsEdit(false)
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
      },[modalRef])

      const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const message = (e.target as HTMLFormElement).editMessage.value;
        console.log(message)
        try {
            const res = await fetch(`${import.meta.env.VITE_API}/api/message/edit/${msg._id}`,{
                method: "PUT",
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  message,
                }),
  
            })

            const data = await res.json()
            console.log(data)
            if (res.ok) {
                
                dispatch(updateMessage(data))
                setIsEdit(false)
            } else {
                throw new Error("Failed to edit message")
            }
        } catch (error) {
            console.log(error)
        }
      }
  return (
    <div  className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div ref={modalRef} className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-gray-700">Edit Your Message</h2>
          <p className="text-sm text-gray-500">Original message: {msg.message}</p>
          
          <label htmlFor="editMessage" className="text-sm text-gray-600">To</label>
          <input
            id="editMessage"
            name="editMessage"
            type="text"
            placeholder="Edit your message"
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <div className="flex justify-end gap-4 mt-4">
            <button
              type="button"
              onClick={() => setIsEdit(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MessageEditModal;
