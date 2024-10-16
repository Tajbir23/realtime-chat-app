import userTypeCheck from "./user";

interface friends {
    createdAt: string;
  lastMessage: string;
  lastMessageAt: number;
  receiverId: userTypeCheck;
  senderId: userTypeCheck;
  updatedAt: string;
  _id: string;
  isBlock: boolean;
  blockSender: string;
  theme: string;
  themeUpdateBy: string;
  themeType: string;
}

export default friends;