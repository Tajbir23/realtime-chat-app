import myDayType from "./myDayType";
import userTypeCheck from "./user";

interface notificationType {
    _id: string;
    senderId: userTypeCheck;
    receiverId: userTypeCheck;
    type: string;
    isRead: boolean;
    postId: myDayType;
    createdAt: Date;
    time: number
}

export default notificationType;