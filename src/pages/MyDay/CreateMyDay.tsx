import { useState } from "react"
import toast from "react-hot-toast";
import ReactQuill from "react-quill"
import 'react-quill/dist/quill.snow.css';

const maxLength = 100
const CreateMyDay = () => {
    const [value, setValue] = useState('')
    const [disable, setDisable] = useState(false)
    const [count, setCount] = useState(0)
    
    const handleChange = (content: string, delta: unknown, source: string, editor: ReactQuill.UnprivilegedEditor) => {
        const text = editor.getText()
        setCount(text.length)
        if(text.length <= maxLength){
            setValue(content)
            setDisable(false)
        }else {
            setValue(content)
            setDisable(true)
        }
        console.log(delta,source)
    }

    const handlePostDay = async(e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        try {
            const response = await fetch(`${import.meta.env.VITE_API}/api/create_my_day`,{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    content: value,
                }),
            })
            if(response.ok) {
                toast.success("Your day has been posted")
                setValue("")
            }
            await response.json();
            // console.log(data)
        } catch (error) {
            // Handle error
            console.error(error)
        }
    }



    const toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote', 'code-block'],
        ['link', 'formula'],
      
        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
        [{ 'direction': 'rtl' }],                         // text direction
      
        [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      
        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        [{ 'font': [] }],
        [{ 'align': [] }],
      
        ['clean']                                         // remove formatting button
      ];

      const module = {
        toolbar: toolbarOptions,
      }
  return (
    <div className="sm:ml-80 flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full sm:w-3/4 lg:w-1/2 bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200 text-center font-semibold text-xl text-gray-700">
          Create Your Day
            <div className="text-sm"><span>Max length : {maxLength}</span> <span>Count : {count}</span></div>
        </div>
        <ReactQuill
          modules={module}
          theme="snow"
          value={value}
          onChange={handleChange}
          placeholder="Write about your day..."
          className="h-96 p-2"
        />
        
      </div>
      <div className="p-4 text-right">
          <button
            onClick={handlePostDay}
            disabled={disable}
            className={`px-6 py-2 ${disable ? "bg-gray-500" : "bg-blue-600"} text-white rounded-lg transition-colors`}
          >
            Post
          </button>
        </div>
    </div>
  )
}

export default CreateMyDay