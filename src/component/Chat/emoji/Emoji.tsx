import { useState, useRef, useEffect } from "react"
import { MdOutlineEmojiEmotions } from "react-icons/md"
import { useDispatch } from "react-redux"
import { updateEmoji } from "../../../redux/features/message/messageSlice"

const emojis = ["😀", "😂", "😍", "🤔", "😎", "👍", "🎉", "🚀", "💡", "🌈"]

export default function Emoji({ messageId, receiverId }: { messageId: string, receiverId: string }) {
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const dispatch = useDispatch()

  const handleEmojiSelect = async(emoji: string) => {
    setSelectedEmoji(emoji)
    setIsOpen(false)

    try {
        const res = await fetch(`${import.meta.env.VITE_API}/api/emoji`,{
            method: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                messageId,
                emoji,
                receiverId
            }),
        })
        if (!res.ok) {
            throw new Error("Failed to send emoji")
        }
        const data = await res.json()

        dispatch(updateEmoji(data))
        setSelectedEmoji(null)
    } catch (error) {
        console.error(error)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="relative my-auto ml-2" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
        aria-label="Select emoji"
      >
        {selectedEmoji ? (
          <span className="text-lg">{selectedEmoji}</span>
        ) : (
        <MdOutlineEmojiEmotions className="h-5 w-5 text-gray-500" />
        )}
      </button>
      {isOpen && (
        <div className="absolute mt-2 w-48 bg-white rounded-md shadow-lg z-10">
          <div className="grid grid-cols-5 gap-2 p-2">
            {emojis.map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleEmojiSelect(emoji)}
                className="text-lg hover:bg-gray-100 rounded p-1 focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}