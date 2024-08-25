
import { FaToggleOff } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toggle } from "../../redux/features/toggle/toggleSlice";
import { io } from "socket.io-client";
import { useState } from "react";
import userTypeCheck from "../../redux/typeCheck/user";



const socket = io(`${import.meta.env.VITE_API}`)

const Aside = () => {
const [users, setUsers] = useState<userTypeCheck[]>([])
    const user = useSelector((state: {user: {user: userTypeCheck}}) => state.user.user)
    const dispatch = useDispatch()

    socket.on('users', (users: userTypeCheck[]) => {
        setUsers(users)
    })

    console.log(users)

    
  return (
    <div className="w-full h-full sm:w-[35%] md:w-1/3 lg:w-80">
        <aside className="w-full h-full sm:w-[35%] md:w-1/3 lg:w-80 fixed overflow-auto">
            <div>
                <div className="flex items-center gap-5 border-b border-black p-5 bg-gray-500 fixed w-full sm:w-[35%] md:w-1/3 lg:w-80">
                    <img className="h-14 w-14 rounded-full border-blue-900 border-[4px]" src={user?.photoUrl} alt="image not found" />
                    <div>
                        <h1 className="text-lg font-bold">{user?.name}</h1>
                        <p>{user?.isActive ? 'Active' : 'Offline'}</p>
                    </div>
                    <FaToggleOff onClick={() => dispatch(toggle())} className="ml-auto text-4xl cursor-pointer" />
                </div>

                <div className="pt-28 px-5 flex flex-col gap-5">
                    {users?.map((item: userTypeCheck) => {
                        return <div className="flex items-center gap-5 cursor-pointer hover:bg-gray-500 p-2">
                        <img className="h-14 w-14 rounded-full border-blue-900 border-[4px]" src={item.photoUrl} alt="image not found" />
                        <div>
                            <h1 className="text-lg font-bold">{item.name}</h1>
                            <p>{item.isActive ? 'Active' : 'Offline'}</p>
                        </div>
                        </div>
                    })}
                </div>
            </div>

            
        </aside>
    </div>
  )
}

export default Aside