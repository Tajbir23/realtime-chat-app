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

  console.log(friends, myInfo)

  return (
    <>
      {friends.friends.map((friend) => {
        if(friend.receiverId?._id === id || friend.senderId?._id === id) {
          return <div className="px-5 py-2 bg-red-600 font-semibold text-white rounded-md hover:bg-white hover:text-black border border-black cursor-pointer">Block</div>
        }
      })}
    </>
  )
}

export default BlockButton