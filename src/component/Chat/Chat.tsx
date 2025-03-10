import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import userTypeCheck from "../../redux/typeCheck/user";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../redux/app/store";
import MessageState from "../../redux/typeCheck/messageState";
import {
  adMessage,
  incrementPage,
  updateEmoji,
  updateSeenMessage,
} from "../../redux/features/message/messageSlice";
import messageThunk from "../../redux/thunks/messageThunks";
import { socket } from "../../hooks/useSocket";
import upcomingMessageType from "../../redux/typeCheck/upcomingMessageType";
import friends from "../../redux/typeCheck/friends";
import SubmitMessage from "./SubmitMessage";
import message from "../../redux/typeCheck/message";
import Message from "./message/Message";
import MessageProfileOptions from "./message/MessageProfileOptions";
import encryptMessage from "../../hooks/encryption/message/encryptMessage";
import { updateFriendListSeen } from "../../redux/features/user/friendsSlice";

const ChatLayout: React.FC = () => {
  const { id } = useParams();
  const [user, setUser] = useState<userTypeCheck | undefined>();
  const [lastMessageId, setLastMessageId] = useState<string | undefined>();

  const dispatch = useDispatch<AppDispatch>();
  const { messages, page, hasMore, isLoading } = useSelector(
    (state: { message: MessageState }) => state.message
  );

  const friends = useSelector(
    (state: {
      friends: {
        friends: friends[];
        hasMore: boolean;
        isLoading: boolean;
        page: number;
      };
    }) => state.friends
  );


  const reverseMessage = [...messages].reverse();
  const myInfo = useSelector(
    (state: { user: { user: userTypeCheck } }) => state.user.user
  );
  const navigate = useNavigate();

  const chatBoxRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevScrollHeightRef = useRef<number>(0);
  const trackKeyRef = useRef<HTMLInputElement>(null);
  const [upcomingMessage, setUpcomingMessage] = useState<upcomingMessageType>();
  const [countDown, setCountDown] = useState(4);

  const friend = friends.friends.find((f) => f.senderId?._id === id || f.receiverId?._id === id)

  const loadMoreMessages = useCallback(() => {
    if (hasMore && !isLoading && id) {
      prevScrollHeightRef.current = chatBoxRef.current?.scrollHeight || 0;
      dispatch(incrementPage({ id }));
    }
  }, [dispatch, hasMore, isLoading, id]);

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
    const handleNotification = (username: string, message: string ,chatId: string, icon: string) => {
      if(Notification.permission === 'granted'){
        const notification = new Notification(username, {
          body: message || 'You have new messages',
          icon: icon || '/favicon.ico',
        });
        notification.onclick = () => {
          window.focus()
          navigate(`/chat/${chatId}`);
        };
      }
    }
    

    const handleIncomingMessage = (message: message) => {
      setCountDown(0);
      // Only dispatch the message if it's intended for the current user
      if (
        message?.receiverId === id ||
        message?.senderId === id
      ) {
        dispatch(adMessage(message));

        if(message?.senderId === id){
          dispatch(updateSeenMessage(message?._id))
          setLastMessageId(message?._id);

          handleNotification(message.receiverName, message.message, message.receiverId, message.receiverPhotoUrl)
        }else if(message?.receiverId === id){
          handleNotification(message.senderName, message.message, message.senderId, message.senderPhotoUrl)
        }
      }
    };

    socket.on("message", handleIncomingMessage);

    return () => {
      socket.off("message", handleIncomingMessage);
    };
  }, [dispatch, myInfo?.username, id, navigate]);


// update emoji in message
  socket.on('emojiUpdate', (message) => {
    dispatch(updateEmoji(message))
  })


  useEffect(() => {
    if (page === 1 && chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    } else if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop =
        chatBoxRef.current.scrollHeight - prevScrollHeightRef.current;
    }
  }, [messages, page]);



  useEffect(() => {
    if (id) {
      const data: { currentPage: number; id: string } = {
        currentPage: typeof page === 'object' && id in page ? page[id as keyof typeof page] : 1,
        id: id || "",
      };
      dispatch(messageThunk(data));
    }
  }, [dispatch, id, page]);

  useEffect(() => {
    const user = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API}/api/user/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

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

  

  useEffect(() => {
    const element = trackKeyRef.current;
    if (element) {
      const handleKeyDown = (e: KeyboardEvent) => {
        const inputElement = e.target as HTMLInputElement;

        socket.emit("sendUpcomingMessage", {
          message: inputElement.value,
          receiverId: id,
          senderEmail: myInfo.email,
          senderId: myInfo._id,
          upcoming: true,
        });
      };

      const handleKeyUp = (event: KeyboardEvent) => {
        const inputElement = event.target as HTMLInputElement;
        socket.emit("sendUpcomingMessage", {
          message: inputElement.value,
          receiverId: id,
          senderEmail: myInfo.email,
          senderId: myInfo._id,
          upcoming: false,
        });
      };

      element.addEventListener("keydown", handleKeyDown);
      element.addEventListener("keyup", handleKeyUp);
      return () => {
        element.removeEventListener("keydown", handleKeyDown);
        element.removeEventListener("keyup", handleKeyUp);
      };
    }
  }, [id]);

  socket.on("upcomingMessage", (message) => {
    if (message?.receiverId) {
      setUpcomingMessage(message);
    }
  });

  useEffect(() => {
    if (upcomingMessage && !upcomingMessage.upcoming) {
      setCountDown(4);
      const interval = setInterval(() => {
        setCountDown((prevCount) => {
          if (prevCount <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prevCount - 1;
        });
      }, 1000);
    }
  }, [upcomingMessage]);


  useEffect(() => {
    dispatch(updateFriendListSeen(friend?._id))
    const receiverId = id
    fetch(`${import.meta.env.VITE_API}/api/seen_message`,{
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        receiverId: receiverId,
        lastMessageId,
        chatId: friend?._id
      }),
    })
  },[id, dispatch, friend, lastMessageId])

  useEffect(() => {
    socket.on("seenMessage", (messageId) => {
      dispatch(updateSeenMessage(messageId))
    })
    return () => {
      socket.off("seenMessage")
    }
  },[dispatch])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const message = (e.target as HTMLFormElement).message.value;

    let encryptedMessage = ''

    if(friend?.isEncrypted){
      encryptedMessage = await encryptMessage(message, friend.publicKey);
    }
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API}/api/message`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user,
          message : friend?.isEncrypted ? encryptedMessage : message,
          isEncrypted: friend?.isEncrypted || false
        }),
      });

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("token");
        return navigate("/login");
      }
      const data = await response.json();
      dispatch(adMessage(data));
      
      (e.target as HTMLFormElement).message.value = "";
      prevScrollHeightRef.current = 0;

      if (scrollRef.current) {
        scrollRef.current.scrollIntoView({ behavior: "smooth" });
      }
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <div className="sm:ml-80 w-full">
      <div className="h-[calc(100vh-60px)] sm:h-screen flex w-full">
        {/* Main Chat Area */}
        <div className={`flex-grow flex flex-col ${friend?.theme ? friend.theme : 'bg-gray-100'} w-full`}>
          {/* Chat Header */}
          {user && <MessageProfileOptions chatId={friend?._id || ""} user={user} myInfo={myInfo} id={id || ""} isEncrypted={friend?.isEncrypted || false} />}

          {isLoading && (
            <h1 className="text-4xl font-bold text-center">Loading</h1>
          )}

          {/* Chat Messages */}
          <div
            ref={chatBoxRef}
            className="flex-grow p-4 overflow-y-auto w-full"
          >
            {user && !isLoading &&  <Message reverseMessage={reverseMessage} user={user} myInfo={myInfo} chatId={friend?._id || ''} isEncrypted={friend?.isEncrypted || false} />}

            <div ref={scrollRef} />
          </div>
          {upcomingMessage && countDown !== 0 && upcomingMessage.senderId === id && !friend?.isEncrypted && (
            <div className="justify-start mt-auto m-5 block bg-white p-5">
              <div className=" rounded-lg w-full  text-gray-900">
                upcoming: {upcomingMessage?.message}
              </div>
            </div>
          )}
          {/* Input Area */}

          {
            friend ? friend.isBlock && friend.blockSender === myInfo?._id ? <h1 className="text-center p-5">For send message, you need to unblock</h1> :  friend.isBlock && friend?.blockSender === id ? <h1 className="text-center p-5">{user?.name} has blocked you</h1> : !friend.isBlock && <SubmitMessage handleSubmit={handleSubmit} trackKeyRef={trackKeyRef} /> : <SubmitMessage handleSubmit={handleSubmit} trackKeyRef={trackKeyRef} />
          }
        </div>
      </div>
    </div>
  );
};

export default ChatLayout;
