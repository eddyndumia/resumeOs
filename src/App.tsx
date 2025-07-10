import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { WindowShell } from './components/WindowShell';
import { Sidebar } from './components/Sidebar';
import { ContentView } from './components/ContentView';
import { ContextMenu, MenuOption } from './components/ContextMenu';
import { ResumeItem, resumeData, getItemById, getItemsByParentId } from './data/resumeData';

function App() {
  const [selectedId, setSelectedId] = useState<string>('myComputer'); // Default selection
  const [currentPath, setCurrentPath] = useState<ResumeItem[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['myComputer', 'userProfile', 'resumeDriveC', 'windowsResume'])); // Keep some important folders open by default

  const [menuState, setMenuState] = useState<{
    visible: boolean;
    x: number;
    y: number;
    targetItem?: ResumeItem;
  }>({ visible: false, x: 0, y: 0, targetItem: undefined });

  const buildPath = useCallback((itemId: string | null): ResumeItem[] => {
    const path: ResumeItem[] = [];
    let currentItem = itemId ? getItemById(itemId) : null;
    while (currentItem) {
      path.unshift(currentItem);
      currentItem = currentItem.parentId ? getItemById(currentItem.parentId) : null;
    }
    return path;
  }, []);

  useEffect(() => {
    setCurrentPath(buildPath(selectedId));
  }, [selectedId, buildPath]);

  const handleSelectItem = (itemId: string) => {
    const item = getItemById(itemId);
    if (!item) return;

    setSelectedId(itemId);

    if (item.type === 'folder') {
      setExpandedFolders(prev => {
        const newSet = new Set(prev);
        if (newSet.has(itemId)) {
          // Optional: clicking an already selected open folder could collapse it
          // newSet.delete(itemId);
        } else {
          newSet.add(itemId);
        }
        return newSet;
      });
    }
    hideContextMenu(); // Hide context menu on item selection
  };

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(folderId)) {
        newSet.delete(folderId);
      } else {
        newSet.add(folderId);
      }
      return newSet;
    });
    hideContextMenu();
  };

  const handleContextMenu = (item: ResumeItem, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setMenuState({
      visible: true,
      x: event.clientX,
      y: event.clientY,
      targetItem: item,
    });
  };

  const hideContextMenu = () => {
    setMenuState(prev => ({ ...prev, visible: false }));
  };

  useEffect(() => {
    const handleGlobalClick = (event: MouseEvent) => {
      if (menuState.visible) {
        // Basic check: if the click is not inside a context menu element
        // A more robust solution would involve refs or checking class names.
        if (!(event.target as HTMLElement).closest('.context-menu-item-class')) { // Assuming ContextMenu items might have this class
          hideContextMenu();
        }
      }
    };

    // We already prevent default in handleContextMenu for specific items.
    // This global one is more about ensuring clicks outside our UI hide the menu.
    // document.addEventListener('contextmenu', handleGlobalContextMenu); // This might be too broad
    document.addEventListener('click', handleGlobalClick, true); // Use capture phase for wider coverage

    return () => {
      // document.removeEventListener('contextmenu', handleGlobalContextMenu);
      document.removeEventListener('click', handleGlobalClick, true);
    };
  }, [menuState.visible]);

  const getMenuOptions = (): MenuOption[] => {
    if (!menuState.targetItem) return [];

    const item = menuState.targetItem;
    let options: MenuOption[] = [];

    if (item.type === 'folder') {
      options.push({ label: 'Open', action: () => handleSelectItem(item.id), isBold: true });
      options.push({
        label: expandedFolders.has(item.id) ? 'Collapse' : 'Expand',
        action: () => toggleFolder(item.id)
      });
    } else { // File
      options.push({ label: 'Open', action: () => handleSelectItem(item.id), isBold: true });
    }

    options.push({ isSeparator: true });

    if (item.id === 'recycleBin') {
        options.push({ label: 'Empty Recycle Bin', action: () => alert('Emptying Recycle Bin (not implemented)') });
        options.push({ isSeparator: true });
    }

    // Common actions for files and folders (except special ones like Recycle Bin for some)
    if (item.id !== 'myComputer' && item.id !== 'userProfile' && item.id !== 'resumeDriveC') { // Example: some items might not be renamable
        options.push({ label: 'Rename', action: () => alert(`Rename ${item.name} (not implemented)`) });
    }

    if (item.type === 'file' && item.id !== 'resumeShortcut') {
        options.push({ label: 'Download', action: () => alert(`Download ${item.name} (not implemented)`) });
    }

    // Add "Delete" option - this would need more logic (move to recycle bin, etc.)
    if (item.id !== 'myComputer' && item.id !== 'userProfile' && item.id !== 'recycleBin') { // Can't delete these
        options.push({ label: 'Delete', action: () => alert(`Delete ${item.name} (not implemented)`) });
    }

    if (options.length > 0 && !options[options.length -1].isSeparator) { // Ensure there's a separator before properties if other items exist
        const lastOption = options[options.length -1];
        if(lastOption && !lastOption.isSeparator) {
             options.push({ isSeparator: true });
        }
    }

    options.push({ label: 'Properties', action: () => alert(`Properties for ${item.name} (not implemented)`) });

    // Remove any trailing separators or multiple separators
    options = options.filter((opt, index, arr) => {
        if (opt.isSeparator) {
            if (index === 0 || index === arr.length -1) return false; // No leading/trailing separators
            if (arr[index-1].isSeparator) return false; // No double separators
        }
        return true;
    });

    return options;
  };

  const sidebarTopLevelItems = getItemsByParentId(null); // Get "Desktop" items like My Computer, User Profile

  return (
    <WindowShell title={currentPath.length > 0 ? currentPath[currentPath.length -1].name : "File Explorer"} currentPathItems={currentPath}>
      <Sidebar
        allItems={resumeData} // Pass all items for hierarchical rendering
        selectedId={selectedId}
        onSelectItem={handleSelectItem}
        onToggleFolder={toggleFolder}
        expandedFolders={expandedFolders}
        onContextMenu={handleContextMenu}
        rootItems={sidebarTopLevelItems} // Specify what to render at the top level
      />
      <ContentView
        selectedItem={getItemById(selectedId)}
        allItems={resumeData}
        onSelectItem={handleSelectItem} // For navigating within ContentView
        onContextMenu={handleContextMenu} // For context menus on items in ContentView
        expandedFolders={expandedFolders} // Pass expanded state
        onToggleFolder={toggleFolder} // Pass toggle function
      />
      <Link
        to="/admin"
        className="fixed bottom-4 right-4 z-50 bg-blue-600 dark:bg-indigo-600 text-white px-3 py-1.5 rounded-full shadow-lg hover:bg-blue-700 dark:hover:bg-indigo-700 transition-colors text-xs font-medium"
      >
        Admin
      </Link>
      <ContextMenu
        options={getMenuOptions()}
        position={{ x: menuState.x, y: menuState.y }}
        visible={menuState.visible}
        onHide={hideContextMenu}
      />
    </WindowShell>
  )
}

export default App
