interface message {
    _id: string;
    chatId: string;
    senderName: string;
    senderUsername: string;
    senderPhotoUrl: string;
    receiverName: string;
    receiverUsername: string;
    receiverEmail: string;
    receiverPhotoUrl: string;
    message: string;
}

export default message;