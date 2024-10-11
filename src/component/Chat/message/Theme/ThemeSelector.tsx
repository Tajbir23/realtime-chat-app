import { useEffect, useRef} from 'react';
import { useDispatch } from 'react-redux';
import { updateTheme } from '../../../../redux/features/user/friendsSlice';

// Define theme options
const themes = {
  white: '',
  reset: 'bg-gray-100',
  default: 'bg-blue-500 text-white',
  green: 'bg-green-500 text-white',
  purple: 'bg-purple-500 text-white',
  red: 'bg-red-500 text-white',
};

const ThemeSelector = ({setIsThemeOpen, chatId}: {setIsThemeOpen: (isOpen: boolean) => void; chatId: string}) => {
  const themeRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch()
  // const [selectedTheme, setSelectedTheme] = useState<keyof typeof themes>('white');

  useEffect(() => {
    // Close the theme selector when clicked outside
    const handleClickOutside = (event: MouseEvent | TouchEvent | KeyboardEvent) => {
      if (themeRef.current && !(themeRef.current as Node).contains(event.target as Node)) {
        setIsThemeOpen(false)
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  },[themeRef, setIsThemeOpen])

  
  const handleThemeChange = async (theme: keyof typeof themes) => {
    // setSelectedTheme(theme);
    const setSelectedTheme = themes[theme];
    try {
      const res = await fetch(`${import.meta.env.VITE_API}/api/chat/theme/${chatId}`,{
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          theme: setSelectedTheme,
        }),
      })
      const data = await res.json()
      console.log(data)
      if(res.ok) {
        dispatch(updateTheme(data))
        setIsThemeOpen(false)
      }
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <div ref={themeRef} className={`flex items-center justify-center p-5 rounded-lg bg-white`}>
      
      <div className='grid grid-cols-3 gap-5'>
        <div onClick={() => handleThemeChange('default')} className={`h-8 w-8 rounded-full border border-black ${themes.default}`}></div>
        <div onClick={() => handleThemeChange('green')} className={`h-8 w-8 rounded-full border border-black ${themes.green}`}></div>
        <div onClick={() => handleThemeChange('purple')} className={`h-8 w-8 rounded-full border border-black ${themes.purple}`}></div>
        <div onClick={() => handleThemeChange('red')} className={`h-8 w-8 rounded-full border border-black ${themes.red}`}></div>
        <div onClick={() => handleThemeChange('reset')} className={`h-8 w-8 rounded-full border border-black ${themes.reset}`}></div>
      </div>
    </div>
  );
};
export default ThemeSelector;
