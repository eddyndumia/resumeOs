import { FC } from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeToggle: FC<ThemeToggleProps> = ({ theme, toggleTheme }) => (
  <button
    onClick={toggleTheme}
    aria-label="Toggle dark mode"
    className="ml-auto mr-4 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
  >
    {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
  </button>
);

export default ThemeToggle;