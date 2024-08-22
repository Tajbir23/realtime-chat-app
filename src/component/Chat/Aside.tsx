
import { FaToggleOff } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toggle } from "../../redux/features/toggle/toggleSlice";
import ToggleStateCheck from "../../redux/typeCheck/toggle";

const Aside = () => {
    const toggleState: boolean = useSelector((state: ToggleStateCheck) => state.toggle.isOpen)
    const dispatch = useDispatch()

    const dummy = new Array(10).fill('')

    console.log(toggleState)
  return (
    <div className="w-full h-full sm:w-[35%] md:w-1/3 lg:w-80">
        <aside className="w-full h-full sm:w-[35%] md:w-1/3 lg:w-80 fixed overflow-auto">
            <div>
                <div className="flex items-center gap-5 border-b border-black p-5 bg-gray-500 fixed w-full sm:w-[35%] md:w-1/3 lg:w-80">
                    <img className="h-14 w-14 rounded-full border-blue-900 border-[4px]" src="https://i.ibb.co/6XLHVGH/12555.jpg" alt="image not found" />
                    <div>
                        <h1 className="text-lg font-bold">My name</h1>
                        <p>Active</p>
                    </div>
                    <FaToggleOff onClick={() => dispatch(toggle())} className="ml-auto text-4xl cursor-pointer" />
                </div>

                <div className="pt-28 px-5 flex flex-col gap-5">
                    {dummy.map((item, i) => {
                        return <div className="flex items-center gap-5 cursor-pointer hover:bg-gray-500 p-2">
                        <img className="h-14 w-14 rounded-full border-blue-900 border-[4px]" src="https://i.ibb.co/6XLHVGH/12555.jpg" alt="image not found" />
                        <div>
                            <h1 className="text-lg font-bold">My name</h1>
                            <p>Active</p>
                        </div>
                        </div>
                    })}
                </div>
            </div>

            
        </aside>
    </div>
  )
}

export default Aside