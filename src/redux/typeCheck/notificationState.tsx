import notificationType from "./notificationType";

interface notificationState{
    isLoading: boolean;
    notifications: notificationType[];
    totalNotifications: number;
    error: Error | null;
    page: number;
    hasMore: boolean;
}

export default notificationState;