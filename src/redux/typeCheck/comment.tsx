import userTypeCheck from "./user";

interface commentInterface {
    comment: string;
    createdAt: Date;
    _id: string;
    myDayId: string;
    posterId: string;
    senderId: userTypeCheck
}

export default commentInterface;