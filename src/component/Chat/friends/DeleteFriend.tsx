import { useDispatch } from "react-redux"
import { deleteFriend } from "../../../redux/features/user/friendsSlice"


const DeleteFriend = ({isDeleteOpen}: {isDeleteOpen: {open: boolean, id: string}}) => {
    const dispatch = useDispatch()

    const handleDeleteChat = async(e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        try {
            const res = await fetch(`${import.meta.env.VITE_API}/api/chat/deleteChat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    chatId: isDeleteOpen.id
                })
            })
            const data = await res.json()
            console.log(data)
            if(res.ok){
                dispatch(deleteFriend(isDeleteOpen.id))
                isDeleteOpen.open = false
                isDeleteOpen.id = ''
            }
        } catch (error) {
            console.log(error)
        }
    }
  return (
    <div className="absolute z-50 right-0">
        <button onClick={handleDeleteChat} className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-400 w-full">
          Delete
        </button>
      
    </div>
  )
}

export default DeleteFriend