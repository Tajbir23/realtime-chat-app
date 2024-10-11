import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { AppDispatch } from "../../../redux/app/store";
import { toggle } from "../../../redux/features/toggle/toggleSlice";
import userTypeCheck from "../../../redux/typeCheck/user";
import { socket } from "../../../hooks/useSocket";

const ProfileOptions = ({myInfo}: {myInfo: userTypeCheck}) => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  
  const handleSignOut = () => {
    localStorage.removeItem('token')
    socket.emit('logout')
    navigate('/login')
  }
  return (
    <div className="relative">
  <div className="z-50 my-4 text-base list-none bg-white divide-y divide-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:divide-gray-600" id="user-dropdown">
    {/* User Info */}
    <div className="px-6 py-4">
      <span className="block text-sm font-medium text-gray-900 dark:text-white">{myInfo?.name}</span>
      <span className="block text-sm text-gray-500 truncate dark:text-gray-400">{myInfo?.email}</span>
    </div>

    {/* Dropdown Links */}
    <ul className="py-2" aria-labelledby="user-menu-button">
      <li>
        <Link
          to="/create_day"
          onClick={() => dispatch(toggle())}
          className="block px-6 py-3 text-sm text-gray-700 hover:bg-gray-100 transition dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
        >
          Create Day
        </Link>
      </li>
      <li>
        <Link
          to="/my_day"
          onClick={() => dispatch(toggle())}
          className="block px-6 py-3 text-sm text-gray-700 hover:bg-gray-100 transition dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
        >
          My Day
        </Link>
      </li>
      <li>
        <button
          onClick={() => handleSignOut()}
          className="block w-full px-6 py-3 text-sm text-gray-700 hover:bg-gray-100 transition dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
        >
          Sign out
        </button>
      </li>
    </ul>
  </div>
</div>

  );
};

export default ProfileOptions;
