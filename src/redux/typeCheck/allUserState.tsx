import userTypeCheck from "./user";

interface allUsersState {
    users: userTypeCheck[];
    isLoading: boolean;
    error: Error | null;
    page: number;
    hasMore: boolean;
    totalUsers: number;
}

export default allUsersState;