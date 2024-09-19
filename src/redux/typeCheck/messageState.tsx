
import message from "./message";


interface MessageState {
    messages: message[];
    isLoading: boolean;
    error: Error | null;
    page: number;
    hasMore: boolean;
}
export default MessageState
