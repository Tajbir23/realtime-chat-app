import { useDispatch, useSelector } from "react-redux";
import { toggle } from "../../redux/features/toggle/toggleSlice";
import userTypeCheck from "../../redux/typeCheck/user";
import ToggleStateCheck from "../../redux/typeCheck/toggle";
import { Link, NavLink } from "react-router-dom";
import { socket } from "../../hooks/useSocket";
import { incrementPage, replaceUser } from "../../redux/features/user/allUsersSlice";
import allUsersState from "../../redux/typeCheck/allUserState";
import { useCallback, useEffect, useRef, useState } from "react";
import allUsers from "../../redux/thunks/allUserThunks";
import { AppDispatch } from "../../redux/app/store";
import Friends from "./friends/Friends";
import unreadNotifications from "../../redux/thunks/unreadNotifiactionCountThunk";
import notificationState from "../../redux/typeCheck/notificationState";
import { CiBellOn } from "react-icons/ci";
import ProfileOptions from "./profile/ProfileOptions";
import Users from "./users/Users";


// const socket = io(`${import.meta.env.VITE_API}`);

const Aside = () => {
  const user = useSelector(
    (state: { user: { user: userTypeCheck } }) => state.user.user
  );

  const unreadNotificationCount = useSelector((state : {notification: notificationState}) => state.notification)
  const isOpen = useSelector((state: ToggleStateCheck) => state.toggle.isOpen);
  const dispatch = useDispatch<AppDispatch>();

  const [search, setSearch] = useState("");
  const [searchUsers, setSearchUsers] = useState<userTypeCheck[]>([]);
  const searchResultRef = useRef<HTMLUListElement>(null);
  const [searchResultVisible, setSearchResultVisible] = useState(false)
  const [visibleMyDayButton, setVisibleMyDayButton] = useState(false)
  const myDayButtonRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState("friends")


  useEffect(() => {
    dispatch(allUsers(1))
    dispatch(unreadNotifications())
  }, [dispatch]);


  useEffect(() => {
    socket.on("users", (user: userTypeCheck) => {
      dispatch(replaceUser(user))
    });

    return () => {
      socket.off("users");
    }
  }, [dispatch]);

  useEffect(() => {
    socket.emit('connected', user)
  },[user])
  


  useEffect(() => {
    fetch(`${import.meta.env.VITE_API}/api/search/${search}?email=${user?.email}`,{
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      }
    }).then((res) => res.json())
    .then((data) => setSearchUsers(data))
    .catch((err) => console.log(err))
  },[search])

useEffect(() => {
  const handleClickOutside = (event: MouseEvent | TouchEvent) => {
    if(searchResultRef.current && !searchResultRef.current.contains(event.target as Node)){
      setSearchResultVisible(false)
    }
  }

  document.addEventListener('mousedown', handleClickOutside)
  document.addEventListener('touchstart', handleClickOutside)

  return () => {
    document.removeEventListener('mousedown', handleClickOutside)
    document.removeEventListener('touchstart', handleClickOutside)
  }
},[searchResultRef])


  useEffect(() => {
    if(search && searchUsers.length > 0){
      setSearchResultVisible(true)
    }else{
      setSearchResultVisible(false)
    }
  },[search, searchUsers])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent | KeyboardEvent) => {
      if(myDayButtonRef.current &&!myDayButtonRef.current.contains(event.target as Node)){
        setVisibleMyDayButton(false)
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
  },[myDayButtonRef])

  return (
    <div>
      <button
        onClick={() => dispatch(toggle())}
        data-drawer-target="default-sidebar"
        data-drawer-toggle="default-sidebar"
        aria-controls="default-sidebar"
        type="button"
        className="inline-flex fixed z-10 right-0 items-center p-2 mt-3 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
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
        className={`fixed top-0 left-0 z-10 w-full h-screen overflow-hidden transition-transform sm:w-80 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full flex flex-col px-3 bg-gray-50">
          <div className="flex justify-between items-center p-2 fixed overflow-hidden w-full">
            <div className="flex items-center justify-between mt-4 gap-4 w-[95%]">
              <div className="flex items-center gap-4">
                <img
                  onClick={() => setVisibleMyDayButton(!visibleMyDayButton)}
                  className="h-8 w-8 rounded-full border-blue-900 border-[4px] cursor-pointer"
                  src={user?.photoUrl}
                  alt="image not found"
                />
                <div>
                  <h1 className="text-lg font-bold">{user?.name}</h1>
                </div>
              </div>
              <div>
                <NavLink to="/notification" onClick={() => dispatch(toggle())}><CiBellOn className="text-2xl cursor-pointer" /></NavLink>
                {unreadNotificationCount.totalNotifications > 0 && <span className=" absolute bottom-3 size-2 bg-red-800 rounded-full"></span>}
              </div>
              
            </div>
            <div
              className="cursor-pointer inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
              onClick={() => dispatch(toggle())}
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
            </div>
          </div>
          <div className="mt-20">
            <input onChange={(e) => setSearch(e.target.value)} className="border w-full" type="search" placeholder="Search here" />
          </div>

          {/* here search result */}
          {searchResultVisible && <ul ref={searchResultRef} className="absolute top-32 z-10 bg-white shadow-2xl p-5">
            {searchUsers?.map(user => (
              <li key={user._id}>
                <NavLink to={`/chat/${user._id}`} onClick={() => dispatch(toggle())} className="cursor-pointer flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 group" >
                <img
                  src={user.photoUrl}
                  className="h-8 w-8 rounded-full"
                  alt="image not found"
                />
                <span className="ms-3">{user.name}</span>
              </NavLink>
              </li>
            ))}
          </ul>}
          {visibleMyDayButton && <div ref={myDayButtonRef} className="absolute left-5 top-14 z-30">
            <ProfileOptions myInfo={user} />
          </div>}

            {/* start friends and users */}
            <div>
              <div className="flex justify-between gap-4 px-3 py-2 border-b">
                <button 
                  onClick={() => setActiveTab("friends")}
                  className={`px-4 w-full py-2 text-sm font-medium rounded-lg transition-all duration-300 ease-in-out transform ${
                    activeTab === "friends" 
                      ? "bg-blue-600 text-white scale-105" 
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  Friends
                </button>
                <button 
                  onClick={() => setActiveTab("users")}
                  className={`px-4 w-full py-2 text-sm font-medium rounded-lg transition-all duration-300 ease-in-out transform ${
                    activeTab === "users"
                      ? "bg-blue-600 text-white scale-105"
                      : "text-gray-500 hover:bg-gray-100" 
                  }`}
                >
                  Users
                </button>
              </div>
              <div className="relative">
                <div className={`transition-opacity duration-300 absolute w-full ${
                  activeTab === "friends" ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}>
                  <Friends />
                </div>
                <div className={`transition-opacity duration-300 absolute w-full ${
                  activeTab === "users" ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}>
                  <Users user={user} />
                </div>
              </div>
            </div>
            {/* end friends and users */}

        </div>
      </aside>
    </div>
  );
};

export default Aside;
