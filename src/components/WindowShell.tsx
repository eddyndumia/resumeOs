import React from 'react';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../hooks/useTheme';
import { ResumeItem } from '../data/resumeData'; // Import ResumeItem
import { FaFolder, FaFileAlt, FaChevronRight } from 'react-icons/fa'; // Example icons

interface WindowShellProps {
  children: React.ReactNode;
  title?: string; // Title for the window
  currentPathItems?: ResumeItem[]; // For breadcrumbs/address bar
}

// Windows-like icons for minimize, maximize, close
const WindowControls: React.FC = () => (
  <div className="flex items-center space-x-1">
    <button aria-label="Minimize" className="h-5 w-5 bg-gray-300 dark:bg-gray-600 border border-gray-400 dark:border-gray-500 rounded-sm flex items-center justify-center text-xs font-bold hover:bg-gray-400 dark:hover:bg-gray-500">_</button>
    <button aria-label="Maximize" className="h-5 w-5 bg-gray-300 dark:bg-gray-600 border border-gray-400 dark:border-gray-500 rounded-sm flex items-center justify-center text-xs font-bold hover:bg-gray-400 dark:hover:bg-gray-500">□</button>
    <button aria-label="Close" className="h-5 w-5 bg-red-500 border border-red-600 rounded-sm flex items-center justify-center text-white text-xs font-bold hover:bg-red-600">✕</button>
  </div>
);

// Simple icon mapping - extend this
const getIconForItem = (itemType: 'folder' | 'file', iconName?: string) => {
  if (iconName === 'myComputerIcon') return <FaFolder className="text-blue-500 mr-1" />; // Replace with actual My Computer icon
  if (iconName === 'driveIcon') return <FaFolder className="text-gray-700 mr-1" />; // Replace with actual Drive icon
  if (itemType === 'folder') return <FaFolder className="text-yellow-500 mr-1" />;
  return <FaFileAlt className="text-gray-400 mr-1" />;
};


export const WindowShell: React.FC<WindowShellProps> = ({ children, title = "File Explorer", currentPathItems = [] }) => {
  const { theme, toggleTheme } = useTheme();
  
  // Build breadcrumb string
  const pathString = currentPathItems.map(item => item.name).join(' > ');

  return (
    // Main screen container - using a more Windows XP like blue for background potentially
    // For now, sticking to neutral for better theme compatibility.
    <div className="w-screen h-screen bg-gray-100 dark:bg-gray-800 p-2 sm:p-4 md:p-8 flex items-center justify-center">
      {/* Window Frame - Classic Windows look */}
      <div className="window-frame w-full max-w-5xl h-full max-h-[90vh] bg-gray-200 dark:bg-gray-700 border-2 border-t-white border-l-white border-r-gray-500 border-b-gray-500 dark:border-t-gray-600 dark:border-l-gray-600 dark:border-r-gray-900 dark:border-b-gray-900 shadow-lg flex flex-col">
        {/* Title Bar - Classic Windows blue */}
        <div className="title-bar h-7 bg-blue-600 dark:bg-blue-800 flex items-center justify-between px-1 border-b border-blue-700 dark:border-blue-900">
          <div className="flex items-center">
            {/* Icon can go here later */}
            <span className="text-xs font-bold text-white ml-1">{title}</span>
          </div>
          <WindowControls />
        </div>

        {/* Menu Bar (Optional - File, Edit, View etc.) */}
        {/* For simplicity, skipping for now, but could be added here */}
        {/* <div className="menu-bar h-6 bg-gray-200 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600 flex items-center px-2 text-xs">
          <span>File</span> <span className="ml-3">Edit</span> <span className="ml-3">View</span> <span className="ml-3">Help</span>
        </div> */}

        {/* Address Bar / Breadcrumbs */}
        <div className="address-bar h-8 bg-white dark:bg-gray-600 border-b border-gray-300 dark:border-gray-500 flex items-center px-2 text-xs text-gray-700 dark:text-gray-200 overflow-hidden">
          <span className="font-semibold mr-1 text-gray-500 dark:text-gray-400">Address:</span>
          <div className="flex items-center overflow-x-auto whitespace-nowrap py-1">
            {currentPathItems.map((item, index) => (
              <React.Fragment key={item.id}>
                {index > 0 && <FaChevronRight className="text-gray-400 dark:text-gray-500 mx-1 text-[10px]" />}
                <span className="hover:underline cursor-pointer" onClick={() => console.log(`Navigate to ${item.id} (not implemented yet)`)}>
                  {getIconForItem(item.type, item.icon)}
                  {item.name}
                </span>
              </React.Fragment>
            ))}
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="flex flex-1 overflow-hidden h-[calc(100%-28px-32px)]"> {/* Adjusted height for title and address bar */}
          {children}
        </div>

        {/* Status Bar (Optional) */}
        <div className="status-bar h-5 bg-gray-200 dark:bg-gray-700 border-t border-gray-300 dark:border-gray-600 px-2 text-xs text-gray-600 dark:text-gray-400 flex items-center justify-between">
          <span>{currentPathItems.length} item(s)</span>
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} /> {/* Moved ThemeToggle to status bar */}
        </div>
      </div>
    </div>
  );
};