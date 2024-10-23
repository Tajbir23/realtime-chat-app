import userTypeCheck from "./user";

interface friends {
    createdAt: string;
  lastMessage: string;
  lastMessageAt: number;
  lastMessageSeen: boolean;
  lastMessageSeenUserId: userTypeCheck;
  lastMessageSender: string;
  receiverId: userTypeCheck;
  senderId: userTypeCheck;
  updatedAt: string;
  _id: string;
  isBlock: boolean;
  blockSender: string;
  theme: string;
  themeUpdateBy: string;
  themeType: string;
  publicKey: string;
  isEncrypted: boolean;
}

export default friends;