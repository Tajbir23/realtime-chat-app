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
      <div className="bg-white rounded-xl shadow-2xl p-6 w-80 mx-auto">
        {/* Profile Header */}
        <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-gray-200">
          <img src={myInfo?.photoUrl} alt="Profile" className="w-16 h-16 rounded-full" />
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{myInfo?.name}</h3>
            <p className="text-sm text-gray-500">{myInfo?.email}</p>
          </div>
        </div>

        {/* Menu Options */}
        <nav className="space-y-2">
          <Link
            to="/create_day"
            onClick={() => dispatch(toggle())}
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-purple-50 transition-colors group"
          >
            <span className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center group-hover:bg-purple-200">
              ✨
            </span>
            <span className="text-gray-700 group-hover:text-purple-600">Create Day</span>
          </Link>

          <Link
            to="/my_day"
            onClick={() => dispatch(toggle())}
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50 transition-colors group"
          >
            <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center group-hover:bg-blue-200">
              📅
            </span>
            <span className="text-gray-700 group-hover:text-blue-600">My Day</span>
          </Link>

          <button
            onClick={() => handleSignOut()}
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-red-50 transition-colors group w-full"
          >
            <span className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center group-hover:bg-red-200">
              🚪
            </span>
            <span className="text-gray-700 group-hover:text-red-600">Sign out</span>
          </button>
        </nav>
      </div>
    </div>

  );
};

export default ProfileOptions;
