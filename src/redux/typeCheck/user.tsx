
interface userTypeCheck{
    _id: string;
    name: string;
    username: string;
    email: string;
    photoUrl: string;
    isActive: boolean;
    lastActive: number;
    myDay: string;
    myDayEndAt: number;
    isActiveMyDay: boolean;
}

export default userTypeCheck