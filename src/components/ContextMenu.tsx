import React, { useEffect, useRef } from 'react';

export interface MenuOption { // Exporting for App.tsx
  label: string;
  action: () => void;
  disabled?: boolean;
  isSeparator?: boolean; // For adding a line separator
  isBold?: boolean; // For options like "Open"
}

interface ContextMenuProps {
  options: MenuOption[];
  position: { x: number; y: number };
  visible: boolean;
  onHide: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ options, position, visible, onHide }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        if (visible) { // Only hide if visible and click is outside
          onHide();
        }
      }
    };

    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && visible) {
        onHide();
      }
    };

    if (visible) {
      // Add slight delay to prevent immediate closing if triggered by the same click event
      setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
      }, 0);
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [visible, onHide]);

  if (!visible) return null;

  // Adjust position if menu would go off-screen
  const adjustedPosition = { ...position };
  const menuWidth = 200; // Approximate width, can be dynamic if needed
  const menuHeight = options.length * 30 + 10; // Approximate height

  if (position.x + menuWidth > window.innerWidth) {
    adjustedPosition.x = window.innerWidth - menuWidth - 5; // 5px buffer
  }
  if (position.y + menuHeight > window.innerHeight) {
    adjustedPosition.y = window.innerHeight - menuHeight - 5; // 5px buffer
  }
  if (adjustedPosition.x < 0) adjustedPosition.x = 5;
  if (adjustedPosition.y < 0) adjustedPosition.y = 5;


  return (
    <div
      ref={menuRef} // Ref for click outside detection
      className="context-menu-class absolute bg-gray-100 dark:bg-gray-700 border-t-gray-300 border-l-gray-300 border-r-gray-500 border-b-gray-500 dark:border-t-gray-600 dark:border-l-gray-600 dark:border-r-gray-900 dark:border-b-gray-900 border-2 shadow-md py-0.5 w-48 sm:w-52 z-[1000] text-xs" // Classic Windows styling. `context-menu-class` added for App.tsx click outside.
      style={{ left: adjustedPosition.x, top: adjustedPosition.y }}
      // Prevent context menu on the context menu itself
      onContextMenu={(e) => e.preventDefault()}
    >
      {options.map((option, index) => {
        if (option.isSeparator) {
          return <hr key={`sep-${index}`} className="my-0.5 border-gray-400 dark:border-gray-500 border-t-[1.5px]" />;
        }
        return (
          <div
            key={index}
            className={`context-menu-item px-3 py-1.5 flex items-center justify-between
                        ${option.disabled
                          ? 'text-gray-400 dark:text-gray-500 cursor-default'
                          : 'text-gray-800 dark:text-gray-100 cursor-pointer hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500'
                        }
                        ${option.isBold ? 'font-semibold' : ''}
                      `}
            onClick={(e) => {
              e.stopPropagation(); // Prevent click from bubbling to document listener immediately
              if (!option.disabled) {
                option.action();
                onHide();
              }
            }}
          >
            <span>{option.label}</span>
            {/* Placeholder for submenu arrow if needed later: e.g. option.submenu && <span>▶</span> */}
          </div>
        );
      })}
    </div>
  );
};