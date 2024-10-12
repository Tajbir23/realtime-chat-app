import { useEffect, useRef, useState } from "react";
import userTypeCheck from "../../../redux/typeCheck/user";
import BlockButton from "../BlockButton";
import { Link } from "react-router-dom";
import ThemeSelector from "./Theme/ThemeSelector";

const MessageProfileOptions = ({
  chatId,
  myInfo,
  user,
  id
}: {
  chatId: string;
  myInfo: userTypeCheck;
  user: userTypeCheck;
  id: string
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [modalRef]);
  return (
    <>
      <div
        data-aos="fade-down"
        className="relative p-4 bg-white shadow-md flex gap-5 items-center justify-between"
      >
        <div className="flex items-center relative">
          <img
            src={user.photoUrl}
            onClick={() => setIsOpen(!isOpen)}
            alt={user.name}
            className={`w-8 h-8 rounded-full border border-gray-300 cursor-pointer ${
              user.isActiveMyDay && user.myDayEndAt > Number(Date.now())
                ? "ring-4 ring-blue-500"
                : ""
            }`}
          />
          {user.isActive && (
            <span className="h-2 w-2 bg-blue-700 rounded-full absolute top-0 left-10"></span>
          )}
          <p className="ml-4 text-lg font-bold">{user.name}</p>
        </div>
        {isOpen && (
          <div
            ref={modalRef}
            className="absolute left-10 top-14 z-30 max-w-44  w-full shadow-2xl p-5 rounded-lg backdrop-blur-md flex flex-col gap 5"
          >
            <button onClick={() => setIsThemeOpen(true)} className="relative w-full p-2 hover:bg-white rounded-lg">
              <span>Theme</span>
              {isThemeOpen && <div className="absolute -right-32 rounded-lg z-50">
                <ThemeSelector setIsThemeOpen={setIsThemeOpen} chatId={chatId} />
               </div>}
            </button>
            <Link
              to={`/day/${user?._id}`}
              className="w-full p-2 hover:bg-white rounded-lg text-center"
            >
              See Day
            </Link>
          </div>
        )}
      
        <BlockButton id={id} myInfo={myInfo} />
      </div>
    </>
  );
};

export default MessageProfileOptions;
