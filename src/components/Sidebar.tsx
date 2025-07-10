import React from 'react';
import { ResumeItem, getItemsByParentId } from '../data/resumeData';
import { getIconForExplorerItem } from '../utils/iconUtils'; // Import from new location
import { FaChevronDown, FaChevronRight } from 'react-icons/fa'; // For expand/collapse toggles


interface SidebarProps {
  allItems: ResumeItem[]; // All items to build the tree
  rootItems: ResumeItem[]; // Top-level items to display initially
  selectedId: string;
  onSelectItem: (id: string) => void;
  onToggleFolder: (folderId: string) => void;
  expandedFolders: Set<string>;
  onContextMenu: (item: ResumeItem, event: React.MouseEvent) => void;
}


const SidebarRecursiveItem: React.FC<{
  item: ResumeItem;
  level: number;
} & Omit<SidebarProps, 'rootItems' | 'allItems'>> = ({
  item,
  level,
  selectedId,
  onSelectItem,
  onToggleFolder,
  expandedFolders,
  onContextMenu,
}) => {
  const isSelected = selectedId === item.id;
  const isExpanded = item.type === 'folder' && expandedFolders.has(item.id);
  const children = item.type === 'folder' ? getItemsByParentId(item.id) : [];

  const handleItemClick = () => {
    if (item.type === 'folder') {
      // Clicking a folder in sidebar usually selects it AND toggles expansion if already selected
      // or just selects if not selected. Our App.tsx handles selection and expansion separately.
      // For sidebar, let's make click select, and a separate chevron/icon click toggle.
      onSelectItem(item.id);
       // Optionally, auto-expand on select if not already expanded:
      if (!isExpanded) {
        onToggleFolder(item.id);
      }
    } else {
      onSelectItem(item.id);
    }
  };

  const handleToggleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent item selection when clicking toggle
    if (item.type === 'folder') {
      onToggleFolder(item.id);
    }
  };

  return (
    <>
      <div
        className={`flex items-center w-full text-left px-2 py-1 my-0.5 rounded
                    text-xs cursor-pointer select-none
                    ${isSelected ? 'bg-blue-500 dark:bg-blue-700 text-white' : 'text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
        style={{ paddingLeft: `${level * 12 + 8}px` }} // Indentation
        onClick={handleItemClick}
        onContextMenu={(e) => onContextMenu(item, e)}
        title={item.name}
      >
        {item.type === 'folder' && (children.length > 0 || item.icon === 'driveIcon' || item.icon === 'myComputerIcon') ? (
          <span onClick={handleToggleClick} className="mr-1 w-4 h-4 flex items-center justify-center cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 rounded-sm">
            {isExpanded ? <FaChevronDown size={8} /> : <FaChevronRight size={8} />}
          </span>
        ) : (
          // Spacer if no toggle for alignment, or for files
          <span className="mr-1 w-4 h-4"></span>
        )}
        {getIconForExplorerItem(item, isExpanded, 16, "mr-1.5 flex-shrink-0")} {/* Adjusted margin for icon */}
        <span className="truncate flex-grow">{item.name}</span>
      </div>
      {isExpanded && children.length > 0 && (
        <div className="pl-0"> {/* No additional padding for the container of children */}
          {children.map(child => (
            <SidebarRecursiveItem
              key={child.id}
              item={child}
              level={level + 1}
              selectedId={selectedId}
              onSelectItem={onSelectItem}
              onToggleFolder={onToggleFolder}
              expandedFolders={expandedFolders}
              onContextMenu={onContextMenu}
            />
          ))}
        </div>
      )}
    </>
  );
};

export const Sidebar: React.FC<SidebarProps> = (props) => {
  return (
    <div className="sidebar w-52 md:w-60 lg:w-72 bg-gray-100 dark:bg-gray-800 border-r border-gray-300 dark:border-gray-600 p-1 overflow-y-auto flex-shrink-0">
      {props.rootItems.map(item => (
        <SidebarRecursiveItem
          key={item.id}
          item={item}
          level={0}
          selectedId={props.selectedId}
          onSelectItem={props.onSelectItem}
          onToggleFolder={props.onToggleFolder}
          expandedFolders={props.expandedFolders}
          onContextMenu={props.onContextMenu}
        />
      ))}
    </div>
  );
};