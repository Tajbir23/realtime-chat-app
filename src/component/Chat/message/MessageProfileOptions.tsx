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
            <button
              onClick={() => setIsThemeOpen(true)}
              className="relative w-full p-2 hover:bg-white rounded-lg"
            >
              <span>Theme</span>
              {isThemeOpen && (
                <div className="absolute -right-32 rounded-lg z-50">
                  <ThemeSelector
                    setIsThemeOpen={setIsThemeOpen}
                    chatId={chatId}
                  />
                </div>
              )}
            </button>
            {user.isActiveMyDay && (
              <Link
                to={`/day/${user?._id}`}
                className="w-full p-2 hover:bg-white rounded-lg text-center"
              >
                See Day
              </Link>
            )}
            <div className="flex gap-5 items-center">
              <p>Encryption</p>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  value=""
                  checked={isEncrypted}
                  onChange={() => handleEncryption()}
                  className="sr-only peer"
                  aria-label="Toggle encryption"
                />
                <div className="w-9 h-5 bg-gray-200 hover:bg-gray-300 peer-focus:outline-0 peer-focus:ring-transparent rounded-full peer transition-all ease-in-out duration-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600 hover:peer-checked:bg-indigo-700"></div>
              </label>
            </div>
          </div>
        )}

        <BlockButton id={id} myInfo={myInfo} />
      </div>
    </>
  );
};

export default MessageProfileOptions;
