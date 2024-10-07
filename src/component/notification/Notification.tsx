import { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import notificationThunk from "../../redux/thunks/notificationsThunk";
import { AppDispatch } from "../../redux/app/store";
import unreadNotifications from "../../redux/thunks/unreadNotifiactionCountThunk";
import notificationState from "../../redux/typeCheck/notificationState";
import { BiHeart } from "react-icons/bi";
import { FiMessageCircle } from "react-icons/fi";
import { Link } from "react-router-dom";
import { BsArrowLeft } from "react-icons/bs";

const Notification = () => {
  const notifications = useSelector((state: { notification: notificationState }) => state.notification);
  const dispatch = useDispatch<AppDispatch>();
  const [isFetching, setIsFetching] = useState(false); // To manage fetch state
  const notificationListRef = useRef<HTMLDivElement>(null); // Ref for the notification list container

  useEffect(() => {
    dispatch(notificationThunk({ page: 0, limit: 10 }));
    dispatch(unreadNotifications());
  }, [dispatch]);

  const isNewNotification = (createdAt: number) => {
    const createdAtDate = new Date(createdAt);
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    return createdAtDate > twentyFourHoursAgo;
  };

  const notificationAt = (time: number): string => {
    const now = Date.now();
    const timeDifference = now - time;
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

    if (seconds < 60) return rtf.format(-seconds, "second");
    if (minutes < 60) return rtf.format(-minutes, "minute");
    if (hours < 24) return rtf.format(-hours, "hour");
    return new Date(time).toLocaleDateString();
  };

  // Infinite Scroll Handler using useRef
  const handleScroll = useCallback(() => {
    if (notificationListRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = notificationListRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 10 && notifications.hasMore && !isFetching) {
        setIsFetching(true);
      }
    }
  }, [notifications.hasMore, isFetching]);

  useEffect(() => {
    if (isFetching) {
      dispatch(notificationThunk({ page: notifications.page, limit: 10 })).finally(() => {
        setIsFetching(false);
      });
    }
  }, [isFetching, dispatch, notifications.page]);

  useEffect(() => {
    const refCurrent = notificationListRef.current;
    if (refCurrent) {
      refCurrent.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (refCurrent) {
        refCurrent.removeEventListener("scroll", handleScroll);
      }
    };
  }, [handleScroll]);

  return (
    <div className="bg-gray-100 md:ml-80 w-full">
      <header className="bg-white shadow w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="mr-2">
              <BsArrowLeft className="h-6 w-6 text-gray-600" />
            </Link>
            <h1 className="text-xl font-semibold text-gray-900">Notifications</h1>
          </div>
        </div>
      </header>

      <main
        ref={notificationListRef} // Attach ref to the scrollable container
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-60px)] overflow-y-auto"
      >
        <ul className="bg-white shadow sm:rounded-md">
          {notifications.notifications.map((notification) => {
            const isNew = isNewNotification(notification.time);
            const time = notificationAt(notification.time);

            return (
              <li
                key={notification._id}
                className={`px-4 py-4 sm:px-6 ${!notification.isRead ? "bg-blue-50" : ""}`}
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {notification.type === "like" ? (
                      <BiHeart className="h-6 w-6 text-red-500" />
                    ) : (
                      <FiMessageCircle className="h-6 w-6 text-blue-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {notification.senderId.name} {notification.type === "like" ? "liked" : "commented"} on your post
                    </p>
                    <p className="text-sm text-gray-500">{time}</p>
                  </div>
                  {isNew && (
                    <div className="flex-shrink-0">
                      <span className="">new</span>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
        {isFetching && <p className="text-center">Loading more notifications...</p>}
      </main>
    </div>
  );
};

export default Notification;
