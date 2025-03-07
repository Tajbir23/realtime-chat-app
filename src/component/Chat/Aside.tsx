import { useDispatch, useSelector } from "react-redux";
import { toggle } from "../../redux/features/toggle/toggleSlice";
import userTypeCheck from "../../redux/typeCheck/user";
import ToggleStateCheck from "../../redux/typeCheck/toggle";
import { NavLink } from "react-router-dom";
import { socket } from "../../hooks/useSocket";
import { replaceUser } from "../../redux/features/user/allUsersSlice";
import { useEffect, useRef, useState } from "react";
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
        className="inline-flex fixed z-10 right-4 top-4 items-center p-2 text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
      >
        <span className="sr-only">Toggle sidebar</span>
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
        className={`fixed top-0 left-0 z-40 w-full h-screen transition-transform duration-300 ease-in-out sm:w-80 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full flex flex-col bg-gray-50">
          {/* Header */}
          <div className="px-4 py-3 bg-white border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    onClick={() => setVisibleMyDayButton(!visibleMyDayButton)}
                    className="h-10 w-10 rounded-full object-cover cursor-pointer ring-2 ring-blue-500"
                    src={user?.photoUrl}
                    alt={user?.name}
                  />
                  {visibleMyDayButton && (
                    <div ref={myDayButtonRef} className="absolute left-0 top-12 z-50">
                      <ProfileOptions myInfo={user} />
                    </div>
                  )}
                </div>
                <h1 className="font-semibold text-gray-900">{user?.name}</h1>
              </div>
              
              <div className="flex items-center gap-2">
                <NavLink 
                  to="/notification" 
                  onClick={() => dispatch(toggle())}
                  className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <CiBellOn className="text-2xl text-gray-600" />
                  {unreadNotificationCount.totalNotifications > 0 && (
                    <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                  )}
                </NavLink>
                
                <button
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors sm:hidden"
                  onClick={() => dispatch(toggle())}
                  aria-label="Close sidebar"
                >
                  <svg
                    className="w-6 h-6 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="mt-4">
              <div className="relative">
                <input 
                  onChange={(e) => setSearch(e.target.value)} 
                  className="w-full px-4 py-2 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                  type="search" 
                  placeholder="Search people..."
                />
                {searchResultVisible && (
                  <ul ref={searchResultRef} className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg py-2 z-50">
                    {searchUsers?.map(user => (
                      <li key={user._id}>
                        <NavLink 
                          to={`/chat/${user._id}`} 
                          onClick={() => dispatch(toggle())}
                          className="flex items-center px-4 py-2 hover:bg-gray-50 transition-colors"
                        >
                          <img
                            src={user.photoUrl}
                            className="h-8 w-8 rounded-full object-cover"
                            alt={user.name}
                          />
                          <span className="ml-3 text-gray-900">{user.name}</span>
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="px-4 py-3">
            <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
              <button 
                onClick={() => setActiveTab("friends")}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  activeTab === "friends" 
                    ? "bg-white text-blue-600 shadow-sm" 
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Friends
              </button>
              <button 
                onClick={() => setActiveTab("users")}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  activeTab === "users"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Users
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 relative overflow-hidden">
            <div className={`absolute inset-0 transition-opacity duration-300 ${
              activeTab === "friends" ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}>
              <Friends />
            </div>
            <div className={`absolute inset-0 transition-opacity duration-300 ${
              activeTab === "users" ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}>
              <Users user={user} />
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Aside;
