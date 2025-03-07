import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { updateTheme } from '../../../../redux/features/user/friendsSlice';

const themes = [
  { id: 'sunset', color: 'bg-gradient-to-r from-orange-400 to-pink-500 text-white hover:translate-z-2 transition-transform duration-300', label: 'Sunset Glow' },
  { id: 'ocean', color: 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white hover:translate-z-1 transition-transform duration-300', label: 'Ocean Waves' },
  { id: 'aurora', color: 'bg-gradient-to-r from-green-300 to-purple-400 text-white hover:translate-z-3 transition-transform duration-300', label: 'Aurora Lights' },
  { id: 'golden', color: 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white hover:translate-z-2 transition-transform duration-300', label: 'Golden Hour' },
  { id: 'midnight', color: 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:translate-z-1 transition-transform duration-300', label: 'Midnight Sky' },
  { id: 'cherry', color: 'bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:translate-z-2 transition-transform duration-300', label: 'Cherry Blossom' },
  { id: 'forest', color: 'bg-gradient-to-r from-emerald-400 to-teal-500 text-white hover:translate-z-3 transition-transform duration-300', label: 'Enchanted Forest' },
  { id: 'cosmic', color: 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:translate-z-2 transition-transform duration-300', label: 'Cosmic Dream' },
  { id: 'reset', color: '', label: 'Clean Slate' },
];

const ThemeSelector = ({
  setIsThemeOpen,
  chatId
}: {
  setIsThemeOpen: (isOpen: boolean) => void;
  chatId: string;
}) => {
  const themeRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent | KeyboardEvent) => {
      if (themeRef.current && !themeRef.current.contains(event.target as Node)) {
        setIsThemeOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [setIsThemeOpen]);

  const handleThemeChange = async (themeId: string, themeColor: string) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API}/api/chat/theme/${chatId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          theme: themeColor,
          themeType: themeId
        }),
      });

      const data = await res.json();
      if (res.ok) {
        dispatch(updateTheme(data));
        setIsThemeOpen(false);
      }
    } catch (error) {
      console.error('Failed to update theme:', error);
    }
  };

  return (
    <div 
      ref={themeRef}
      className="bg-white rounded-lg shadow-xl p-4 min-w-[200px]"
    >
      <h3 className="text-gray-700 font-medium mb-3 text-center">Choose Theme</h3>
      <div className="space-y-2">
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => handleThemeChange(theme.id, theme.color)}
            className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className={`w-6 h-6 rounded-full ${theme.color} shadow-inner border border-gray-200`} />
            <span className="text-sm text-gray-600">{theme.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector;
