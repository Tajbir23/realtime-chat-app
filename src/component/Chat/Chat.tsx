import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import userTypeCheck from "../../redux/typeCheck/user"
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import messageThunk from "../../redux/thunks/messageThunks";
import { AppDispatch } from "../../redux/app/store";
import MessageState from "../../redux/typeCheck/messageState";
import { adMessage } from "../../redux/features/message/messageSlice";
import { socket } from "../../hooks/useSocket";


// const socket = io(`${import.meta.env.VITE_API}`);

const ChatLayout: React.FC = () => {
  const {id} = useParams()
  const [user, setUser] = useState<userTypeCheck>()
  const [currentPage, setCurrentPage] = useState(1)
  const dispatch = useDispatch<AppDispatch>()
  const {messages, isLoading, error, page, hasMore} = useSelector((state: {message: MessageState}) => state.message)
  const myInfo = useSelector((state: {user: {user: userTypeCheck}}) => state.user.user)
  const navigate = useNavigate()
  console.log(error)

  socket.on("message", (message) => {
    console.log('this is realtime message',message)
    dispatch(adMessage(message))
  })

  useEffect(() => {
    const data: {currentPage: number; id: string} = {
      currentPage,
      id: id || ""
    }
    dispatch(messageThunk(data))
  },[dispatch, id, currentPage])

useEffect(() => {
  const user = async () => {
    const token = localStorage.getItem('token')
    try {
      const response = await fetch(`${import.meta.env.VITE_API}/api/user/${id}`,{
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      
      const data = await response.json()
      setUser(data)

      if(response.status === 401 || response.status === 403){
        localStorage.removeItem('token')
        return navigate('/login')
      }
    } catch (error) {
      console.log(error)
      localStorage.getItem('token')
      return navigate('/login')
    }
  }

  user()
}, [id, navigate]);



const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const message = (e.target as HTMLFormElement).message.value;
  try {
    const response = await fetch(`${import.meta.env.VITE_API}/api/message`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user,
        message,
      }),
    })

    const result = await response.json();
    console.log('chat result',result)
  } catch (error) {
    console.log(error)
  }
};

  return (
    <div className="sm:ml-80 w-full">
  <div className="h-screen flex w-full">
    {/* Main Chat Area */}
    <div className="flex-grow flex flex-col bg-gray-100 w-full">
      {/* Chat Header */}
      <div className="p-4 bg-white shadow-md">
        <h2 className="text-lg font-bold">Chat with {user?.username}</h2>
      </div>

      {/* Chat Messages */}
      <div className="flex-grow p-4 overflow-y-auto w-full">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-4 flex ${msg.receiverUsername === user?.username || msg.senderUsername === user?.username ? 'block' : 'hidden'} ${msg.senderUsername === myInfo.username ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`p-3 rounded-lg max-w-xs ${msg.senderUsername === myInfo.username ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-900'}`}
            >
              {msg.message}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4 bg-white flex w-full">
        <input
          type="text"
          className="flex-grow p-2 border rounded-md mr-2"
          placeholder="Type a message"
          id="message"
          name="message"
          required
        />
        <button
          className="bg-blue-500 text-white p-2 rounded-md"
          type="submit"
        >
          Send
        </button>
      </form>
    </div>
  </div>
</div>


  )
}

export default ChatLayout