import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // যেকোনো নেটওয়ার্ক থেকে অ্যাক্সেসের জন্য
    port: 5173, // পোর্ট ঠিক করে দেওয়া
  }
})
