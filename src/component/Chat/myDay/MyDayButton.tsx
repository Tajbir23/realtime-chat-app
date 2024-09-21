import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { AppDispatch } from "../../../redux/app/store";
import { toggle } from "../../../redux/features/toggle/toggleSlice";

const MyDayButton = () => {
  const dispatch = useDispatch<AppDispatch>()
  return (
    <div className="p-4 bg-gray-100 rounded-md flex gap-4 justify-center">
      <Link
        onClick={() => dispatch(toggle())}
        to="/create_day"
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        Create Day
      </Link>
      <Link
        onClick={() => dispatch(toggle())}
        to="/my_day"
        className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
      >
        My Day
      </Link>
    </div>
  );
};

export default MyDayButton;
