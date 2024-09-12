import { useDispatch, useSelector } from "react-redux";
import { toggle } from "../../redux/features/toggle/toggleSlice";
import userTypeCheck from "../../redux/typeCheck/user";
import ToggleStateCheck from "../../redux/typeCheck/toggle";
import { NavLink } from "react-router-dom";
import { socket } from "../../hooks/useSocket";
import { replaceUser } from "../../redux/features/user/allUsersSlice";
import allUsersState from "../../redux/typeCheck/allUserState";
import { useEffect } from "react";
import allUsers from "../../redux/thunks/allUserThunks";
import { AppDispatch } from "../../redux/app/store";
import Friends from "./friends/Friends";
import { replaceFriends } from "../../redux/features/user/friendsSlice";

// const socket = io(`${import.meta.env.VITE_API}`);

const Aside = () => {
  const user = useSelector(
    (state: { user: { user: userTypeCheck } }) => state.user.user
  );
  const users = useSelector((state: {allUsers: allUsersState}) => state.allUsers.users)
  const isOpen = useSelector((state: ToggleStateCheck) => state.toggle.isOpen);
  const friends = useSelector((state: {friends: {friends: userTypeCheck[],hasMore: boolean, isLoading:boolean, page: number}}) => state.friends)
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(allUsers())
  },[dispatch])

  socket.on("users", (user: userTypeCheck[]) => {
    dispatch(replaceUser(user))
    dispatch(replaceFriends(user))
    // console.log("friends", friends)
    // for(const friend of friends.friends){
    //   console.log("friend",user[0]._id)
    //   if(friend._id === user[0]._id){
    //     dispatch(replaceFriends(user))
    //   }
    // }
  });

  



  return (
    <>
      <button
        onClick={() => dispatch(toggle())}
        data-drawer-target="default-sidebar"
        data-drawer-toggle="default-sidebar"
        aria-controls="default-sidebar"
        type="button"
        className="inline-flex fixed right-0 items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>

      <aside
        id="default-sidebar"
        className={`fixed top-0 left-0 z-40 w-full h-screen overflow-hidden transition-transform sm:w-80 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 bg-gray-50">
          <div className="flex justify-between items-center p-2 fixed overflow-hidden bg-white z-50 w-full">
            <div className="flex items-center gap-4">
              <img
                className="h-8 w-8 rounded-full border-blue-900 border-[4px]"
                src={user?.photoUrl}
                alt="image not found"
              />
              <div>
                <h1 className="text-lg font-bold">{user?.name}</h1>
                <p>Active</p>
              </div>
            </div>
            <div className="cursor-pointer inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 " onClick={() => dispatch(toggle())}>
              <span className="sr-only">Open sidebar</span>
              <svg
                className="w-6 h-6"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clipRule="evenodd"
                  fillRule="evenodd"
                  d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                ></path>
              </svg>
            </div>
          </div>
          <div className="pt-14"></div>
          <ul className="space-y-2 font-medium my-5 pb-5 border-b-2 min-h-10 max-h-72 overflow-x-auto px-3">
            <li className="text-xl font-bold bg-gray-50 fixed w-full">Friends</li>
            <li className="pt-5"></li>
            <Friends />
          </ul>
          <ul className="space-y-2 font-medium mt-5 overflow-x-auto h-full px-3">
            <li className="text-xl font-bold fixed z-50 w-full bg-gray-50">Users</li>
            <li className="pt-5"></li>
            {users?.map(chatUser => {
                return <li className={`${chatUser.email === user.email ? "hidden" : "block"}`}>
                <NavLink
                  onClick={() => dispatch(toggle())}
                  to={`/chat/${chatUser._id}`}
                  className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <img
                    src={chatUser.photoUrl}
                    className="h-8 w-8 rounded-full"
                    alt="image not found"
                  />
                  <span className="ms-3">{chatUser.name}</span>
                  <p className="ms-4 text-sm">{chatUser.isActive ? <div className="h-2 w-2 rounded-full bg-blue-700"></div> : <div className="h-2 w-2 rounded-full bg-red-700"></div>}</p>
                </NavLink>
              </li>
            })}
          </ul>
        </div>
      </aside>

    </>
  );
};

export default Aside;
