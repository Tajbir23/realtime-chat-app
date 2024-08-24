import userTypeCheck from "./user";

interface userState{
    isLoading: boolean;
    user: userTypeCheck | null;
    error: string | null;
}

export default userState