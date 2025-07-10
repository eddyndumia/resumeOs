import React from 'react';
import { ResumeItem, getItemsByParentId, getItemById } from '../data/resumeData';
import { getIconForExplorerItem } from '../utils/iconUtils'; // Import from new location

interface ContentViewProps {
  selectedItem?: ResumeItem; // The currently selected item from App.tsx
  allItems: ResumeItem[]; // Pass all items for looking up children, etc.
  onSelectItem: (id: string) => void; // To handle navigation within ContentView
  onContextMenu: (item: ResumeItem, event: React.MouseEvent) => void;
  expandedFolders: Set<string>; // To pass to any potential recursive rendering here
  onToggleFolder: (folderId: string) => void; // If folders here can be toggled
}


// View Modes: 'icons', 'list', 'details'
type ViewMode = 'icons' | 'list' | 'details';

const ItemCard: React.FC<{
  item: ResumeItem;
  onDoubleClick: () => void;
  onClick: () => void;
  onContextMenu: (event: React.MouseEvent) => void;
  isSelected: boolean;
}> = ({ item, onDoubleClick, onClick, onContextMenu, isSelected }) => (
  <div
    className={`flex flex-col items-center p-2 m-1 w-24 h-28 text-center cursor-pointer rounded
                border border-transparent hover:bg-blue-100 dark:hover:bg-blue-800
                ${isSelected ? 'bg-blue-200 dark:bg-blue-600 border-blue-400 dark:border-blue-500' : ''}`}
    onClick={onClick}
    onDoubleClick={onDoubleClick}
    onContextMenu={onContextMenu}
    title={item.name}
  >
    <div className="text-3xl mb-1 flex items-center justify-center h-10 w-10"> {/* Container for consistent icon sizing */}
      {getIconForExplorerItem(item, false, 28, "flex-shrink-0")} {/* Larger icon for card view, no margin needed if centered */}
    </div>
    <span className={`text-xs break-words ${isSelected ? 'text-black dark:text-white': 'text-gray-800 dark:text-gray-200'}`}>
      {item.name}
    </span>
  </div>
);

const ListItem: React.FC<{
  item: ResumeItem;
  onDoubleClick: () => void;
  onClick: () => void;
  onContextMenu: (event: React.MouseEvent) => void;
  isSelected: boolean;
}> = ({ item, onDoubleClick, onClick, onContextMenu, isSelected }) => (
  <div
    className={`flex items-center p-1.5 w-full cursor-pointer rounded
                border border-transparent hover:bg-blue-100 dark:hover:bg-blue-800
                ${isSelected ? 'bg-blue-200 dark:bg-blue-600 border-blue-400 dark:border-blue-500' : ''}`}
    onClick={onClick}
    onDoubleClick={onDoubleClick}
    onContextMenu={onContextMenu}
    title={item.name}
  >
    <div className="text-lg mr-2">
      {getIconForExplorerItem(item, false)}
    </div>
    <span className={`text-sm truncate ${isSelected ? 'text-black dark:text-white': 'text-gray-800 dark:text-gray-200'}`}>
      {item.name}
    </span>
    {/* Add more columns for 'details' view here, e.g., item.details */}
  </div>
);


export const ContentView: React.FC<ContentViewProps> = ({
  selectedItem,
  allItems,
  onSelectItem,
  onContextMenu,
  // expandedFolders, // Not used directly yet, but available
  // onToggleFolder,  // Not used directly yet, but available
}) => {
  // TODO: Implement view mode state if we want to switch between icons, list, details
  // const [viewMode, setViewMode] = useState<ViewMode>('icons');
  const [locallySelectedId, setLocallySelectedId] = React.useState<string | null>(null);


  if (!selectedItem) {
    return (
      <div className="flex-1 bg-white dark:bg-gray-800 p-4 flex items-center justify-center text-gray-500 dark:text-gray-400">
        Select an item from the sidebar to view its contents.
      </div>
    );
  }

  // If the selected item is a file, display its content
  if (selectedItem.type === 'file') {
    return (
      // Ensure text selection is possible for file content
      <div className="flex-1 bg-white dark:bg-gray-800 p-4 md:p-6 overflow-y-auto select-text">
        {typeof selectedItem.content === 'string' ? (
          <pre className="text-sm whitespace-pre-wrap break-all font-mono text-gray-800 dark:text-gray-200 select-text">
            {selectedItem.content}
          </pre>
        ) : (
          selectedItem.content // Assuming content is ReactNode
        )}
      </div>
    );
  }

  // If the selected item is a folder, display its children
  const children = getItemsByParentId(selectedItem.id);

  const handleItemClick = (itemId: string) => {
    setLocallySelectedId(itemId);
    // To make it feel like Windows Explorer, single click selects, double click opens.
    // We don't directly call onSelectItem here on single click,
    // that's for the parent App to control global selection.
    // Or, we can make single click select globally too: onSelectItem(itemId);
  };

  const handleItemDoubleClick = (itemId: string) => {
    onSelectItem(itemId); // This will trigger navigation in App.tsx
    setLocallySelectedId(null); // Reset local selection after navigating
  };

  if (children.length === 0) {
    return (
      <div className="flex-1 bg-white dark:bg-gray-800 p-4 flex items-center justify-center text-gray-500 dark:text-gray-400">
        This folder is empty.
      </div>
    );
  }

  // Default to "icons" view for folders
  return (
    <div className="content-view flex-1 bg-white dark:bg-gray-800 p-2 sm:p-4 overflow-y-auto">
      <div className="flex flex-wrap">
        {children.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            isSelected={locallySelectedId === item.id}
            onClick={() => handleItemClick(item.id)}
            onDoubleClick={() => handleItemDoubleClick(item.id)}
            onContextMenu={(e) => {
              e.stopPropagation(); // Prevent ContentView's own context menu if any
              onContextMenu(item, e);
              setLocallySelectedId(item.id); // Select item on right click
            }}
          />
        ))}
      </div>
    </div>
  );
};