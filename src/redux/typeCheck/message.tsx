interface message {
    _id: string;
    chatId: string;
    senderId: string;
    senderName: string;
    senderUsername: string;
    senderPhotoUrl: string;
    receiverId: string;
    receiverName: string;
    receiverUsername: string;
    receiverEmail: string;
    receiverPhotoUrl: string;
    message: string;
}

export default message;