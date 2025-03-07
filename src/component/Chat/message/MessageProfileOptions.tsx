import { useEffect, useRef, useState } from "react";
import userTypeCheck from "../../../redux/typeCheck/user";
import BlockButton from "../BlockButton";
import { Link } from "react-router-dom";
import ThemeSelector from "./Theme/ThemeSelector";
// import useGenerateSecretKey from "../../../hooks/encryption/useGenerateSecretKey";
import { updateFriend } from "../../../redux/features/user/friendsSlice";
import { useDispatch } from "react-redux";
import GenerateSecretKey from "../../../hooks/encryption/GenerateSecretKey";
import { deleteEncryptedMessage } from "../../../redux/features/message/messageSlice";
import toast from "react-hot-toast";

const MessageProfileOptions = ({
  chatId,
  myInfo,
  user,
  id,
  isEncrypted,
}: {
  chatId: string;
  myInfo: userTypeCheck;
  user: userTypeCheck;
  id: string;
  isEncrypted: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();

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

  const handleEncryption = async () => {
    const { publicKeyPem, encryptPrivateKey } = GenerateSecretKey();

    // console.log(encryptPrivateKey)
    try {
      const res = await fetch(`${import.meta.env.VITE_API}/api/encryption`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          isEncrypted: !isEncrypted,
          chatId,
          receiver: id,
          publicKey: publicKeyPem,
          encryptPrivateKey,
        }),
      });

      const { data, warning } = await res.json();

      if (warning) {
        return toast.error(warning);
      }

      if (!data.isEncrypted) {
        sessionStorage.removeItem(chatId);
        dispatch(deleteEncryptedMessage(chatId));
      }
      if (res.ok) {
        sessionStorage.setItem(`${chatId}`, encryptPrivateKey);
        dispatch(updateFriend(data));
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div
        
        className="relative bg-white shadow-lg rounded-lg p-4"
      >
        {/* Header with user info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img
                src={user.photoUrl}
                onClick={() => setIsOpen(!isOpen)}
                alt={user.name}
                className={`w-10 h-10 rounded-full object-cover cursor-pointer transition duration-200 hover:opacity-90 ${
                  user.isActiveMyDay && user.myDayEndAt > Number(Date.now())
                    ? "ring-2 ring-blue-500"
                    : "border border-gray-200"
                }`}
              />
              {user.isActive && (
                <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></span>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{user.name}</h3>
              <p className="text-sm text-gray-500">{user.isActive ? 'Active now' : 'Offline'}</p>
            </div>
          </div>

          <BlockButton id={id} myInfo={myInfo} />
        </div>

        {/* Dropdown menu */}
        {isOpen && (
          <div
            ref={modalRef}
            className="absolute left-0 top-16 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-30"
          >
            <button
              onClick={() => setIsThemeOpen(!isThemeOpen)}
              className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center justify-between"
            >
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                Theme
              </span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {isThemeOpen && (
              <div className="absolute left-full ml-2 top-0">
                <ThemeSelector setIsThemeOpen={setIsThemeOpen} chatId={chatId} />
              </div>
            )}

            {user.isActiveMyDay && (
              <Link
                to={`/day/${user?._id}`}
                className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center"
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                See Day
              </Link>
            )}

            <div className="px-4 py-2 flex items-center justify-between">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-gray-700">Encryption</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isEncrypted}
                  onChange={() => handleEncryption()}
                  className="sr-only peer"
                  aria-label="Toggle encryption"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MessageProfileOptions;
