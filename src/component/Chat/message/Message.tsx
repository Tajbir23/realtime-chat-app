
import message from "../../../redux/typeCheck/message"
import userTypeCheck from "../../../redux/typeCheck/user"
import Emoji from "../emoji/Emoji"
import MessageOptions from "./MessageOptions"


const Message = ({reverseMessage, user, myInfo}: {reverseMessage: message[], user: userTypeCheck, myInfo: userTypeCheck}) => {
  return (
    <>
        {reverseMessage.map((msg, index) => (
              <>
              <div
                key={index}
                className={`mb-4 flex group ${
                  msg.receiverUsername === user?.username ||
                  msg.senderUsername === user?.username
                    ? "block"
                    : "hidden"
                } ${
                  msg.senderUsername === myInfo.username
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                {msg.senderUsername === myInfo.username && <MessageOptions msg={msg} user={user} myInfo={myInfo} />}
                <div className="relative">
                    <div
                    className={`p-3 rounded-lg max-w-xs ${
                        msg.senderUsername === myInfo.username
                        ? "bg-blue-500 text-white"
                        : "bg-gray-300 text-gray-900"
                    }`}
                    >
                    {msg.message}
                    </div>
                    <div className={`${msg.senderUsername === myInfo.username ? 'absolute right-0 -bottom-2 z-30' : 'absolute left-0 -bottom-2 z-30'}`}>{msg.emoji ? msg.emoji : ''}</div>
                </div>
                    {msg.receiverUsername === user?.username || msg.senderUsername === user?.username && <Emoji messageId={msg._id} receiverId={msg.receiverId === user._id ? msg.receiverId : msg.senderId} />}
                    {msg.senderUsername !== myInfo.username && <MessageOptions msg={msg} user={user} myInfo={myInfo} />}
              </div>
              </>
            ))}
    </>
  )
}

export default Message