import { useSelector } from "react-redux";
import userTypeCheck from "../../redux/typeCheck/user";
import friends from "../../redux/typeCheck/friends";

interface BlockButtonProps {
  id: string;
  myInfo: userTypeCheck
}
const BlockButton: React.FC<BlockButtonProps> = ({id, myInfo}) => {
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

  const handleBlock = async(chatId: string, isBlock: boolean) => {
    const blockUserId = id
    await fetch(`${import.meta.env.VITE_API}/api/friend/block/${chatId}`,{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        blockUserId,
        isBlock,
      }),
    })
  }

  return (
    <>
      {friends.friends.map((friend) => {
        const chatId = friend._id
        // console.log('friend', id)
        if(friend.receiverId?._id === id || friend.senderId?._id === id) {
          return <>
            {friend.isBlock && friend.blockSender === myInfo._id ? <button onClick={() => handleBlock(chatId, false)} className="mr-10 md:mr-0 px-5 py-2 bg-green-600 font-semibold text-white rounded-md hover:bg-white hover:text-black border border-black cursor-pointer">Unblock</button> : !friend.isBlock && <div onClick={() => handleBlock(chatId, true)} className="mr-10 md:mr-0 px-5 py-2 bg-red-600 font-semibold text-white rounded-md hover:bg-white hover:text-black border border-black cursor-pointer">Block</div>}
          </>
        }
      })}
    </>
  )
}

export default BlockButton