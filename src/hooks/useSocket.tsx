import { io } from "socket.io-client"

export  const socket = io(`${import.meta.env.VITE_API}`)
// export  const socket = io('https://realtime-chat-app-server-th76.onrender.com')
