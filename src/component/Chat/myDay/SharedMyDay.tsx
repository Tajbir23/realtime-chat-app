import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import userTypeCheck from "../../../redux/typeCheck/user";
import { Helmet } from "react-helmet-async";

interface myDay {
    myDay: string;
    myDayEndAt: number;
    userId: userTypeCheck
}
const SharedMyDay = () => {
    const {id} = useParams()
    const [data, setData] = useState<myDay>()
    // console.log(id)
    useEffect(() => {
        fetch(`${import.meta.env.VITE_API}/api/share/${id}`,{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        }).then(res => res.json())
        .then(data => setData(data))
    },[id])

  return (
    <>
    <Helmet>
    <title>{data?.userId?.name ? `${data.userId.name}'s Shared My Day` : 'Loading...'}</title>
        <meta name="description" content={`${data?.userId?.name}'s shared post for today.`} />
        <meta property="og:title" content={`${data?.userId?.name}'s My Day`} />
        <meta property="og:description" content={data?.myDay || "Check out the shared content!"} />
        <meta property="og:site_name" content="Chat app" />
        <meta property="og:image" content={data?.userId?.photoUrl || "/default-image.png"} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${data?.userId?.name}'s My Day`} />
        <meta name="twitter:description" content={data?.myDay || "Check out the shared content!"} />
        <meta name="twitter:image" content={data?.userId?.photoUrl || "/default-image.png"} />
        <link rel="canonical" href={window.location.href} />
      </Helmet>
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 pb-4">
            <div className="w-20 h-20 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-white shadow-md">
              <img src={data?.userId?.photoUrl} alt={data?.userId?.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col items-center sm:items-start">
              <p className="text-2xl sm:text-xl lg:text-2xl font-semibold">{data?.userId.name}</p>
              <p className={`text-sm sm:text-base  ${data?.userId?.isActive ? 'text-green-500' : 'text-red-500'} flex items-center`}>
                <span className={`w-2 h-2 bg-green-500 rounded-full mr-2`}></span>
                {data?.userId?.isActive ? "Active" : "Offline"}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-gray-600 text-base sm:text-lg mb-4" dangerouslySetInnerHTML={{__html: data?.myDay || ''}} />
              
          </div>
        </div>
        
      </div>
    </div>
    </>
  )
}
export default SharedMyDay