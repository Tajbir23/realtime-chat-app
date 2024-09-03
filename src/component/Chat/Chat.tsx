import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import userTypeCheck from "../../redux/typeCheck/user";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../redux/app/store";
import MessageState from "../../redux/typeCheck/messageState";
import { adMessage, incrementPage } from "../../redux/features/message/messageSlice";
import messageThunk from "../../redux/thunks/messageThunks";
import { socket } from "../../hooks/useSocket";

const ChatLayout: React.FC = () => {
  const { id } = useParams();
  const [user, setUser] = useState<userTypeCheck>();
  const dispatch = useDispatch<AppDispatch>();
  const { messages, page, hasMore, isLoading } = useSelector(
    (state: { message: MessageState }) => state.message
  );
  const reverseMessage = [...messages].reverse()
  const myInfo = useSelector((state: { user: { user: userTypeCheck } }) => state.user.user);
  const navigate = useNavigate();
  
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevScrollHeightRef = useRef<number>(0);

  const loadMoreMessages = useCallback(() => {
    if (hasMore && !isLoading) {
      prevScrollHeightRef.current = chatBoxRef.current?.scrollHeight || 0;
      dispatch(incrementPage());
    }
  }, [dispatch, hasMore, isLoading]);

  useEffect(() => {
    const handleScroll = () => {
      if (chatBoxRef.current && chatBoxRef.current.scrollTop === 0) {
        loadMoreMessages();
      }
    };

    if (chatBoxRef.current) {
      chatBoxRef.current.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (chatBoxRef.current) {
        chatBoxRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, [loadMoreMessages]);

  useEffect(() => {
    const handleIncomingMessage = (message: { receiverUsername: string; senderUsername: string; }) => {
      
      // Only dispatch the message if it's intended for the current user
      if (message?.receiverUsername === myInfo?.username || message?.senderUsername === myInfo?.username) {
        dispatch(adMessage(message));
      }
    };

    socket.on("message", handleIncomingMessage);

    
  }, [dispatch, myInfo?.username]);

  useEffect(() => {
    if (page === 1 && chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    } else if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop =
        chatBoxRef.current.scrollHeight - prevScrollHeightRef.current;
    }
  }, [messages, page]);

  useEffect(() => {
    const data: { currentPage: number; id: string } = {
      currentPage: page,
      id: id || "",
    };
    dispatch(messageThunk(data));
  }, [dispatch, id, page]);

  useEffect(() => {
    const user = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`${import.meta.env.VITE_API}/api/user/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        setUser(data);

        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("token");
          return navigate("/login");
        }
      } catch (error) {
        console.log(error);
        localStorage.getItem("token");
        return navigate("/login");
      }
    };

    user();
  }, [id, navigate]);

  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const message = (e.target as HTMLFormElement).message.value;
    try {
      const response = await fetch(`${import.meta.env.VITE_API}/api/message`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user,
          message,
        }),
      });

      const result = await response.json();
      console.log(result)
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("token");
        return navigate("/login");
      }
      (e.target as HTMLFormElement).message.value = "";
      prevScrollHeightRef.current = 0
      
      if (scrollRef.current) {
        scrollRef.current.scrollIntoView({ behavior: "smooth" });
      }
      
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="sm:ml-80 w-full">
      <div className="h-screen flex w-full">
        {/* Main Chat Area */}
        <div className="flex-grow flex flex-col bg-gray-100 w-full">
          {/* Chat Header */}
          <div className="p-4 bg-white shadow-md flex gap-5 items-center">
            <h2 className="text-lg font-bold">Chat with {user?.name}</h2>
          </div>

          {/* Chat Messages */}
          <div ref={chatBoxRef} className="flex-grow p-4 overflow-y-auto w-full">
            {reverseMessage.map((msg, index) => (
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
            <div ref={scrollRef} />
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
  );
};

export default ChatLayout;
