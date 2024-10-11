

const NotificationLoading = () => {
  return (
    <li className="px-4 py-4 sm:px-6">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <div className="h-6 w-6 rounded-full bg-gray-200 animate-pulse" />
        </div>
        <div className="flex-1 min-w-0 space-y-1">
          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
          <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
        </div>
        <div className="flex-shrink-0">
          <div className="h-4 w-8 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </li>
  )
}

export default NotificationLoading