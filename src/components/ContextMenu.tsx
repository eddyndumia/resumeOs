import React, { useEffect } from 'react';

interface ContextMenuProps {
  options: Array<{ label: string; action: () => void }>;
  position: { x: number; y: number };
  visible: boolean;
  onHide: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ options, position, visible, onHide }) => {
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (visible) {
        onHide();
      }
    };

    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && visible) {
        onHide();
      }
    };

    if (visible) {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [visible, onHide]);

  if (!visible) return null;

  return (
    <div
      className="context-menu absolute bg-white/95 dark:bg-[#1A1A1A]/90 rounded-md shadow-xl border border-gray-200 dark:border-gray-700 py-1 w-[180px] z-[1000] animate-in fade-in-0 zoom-in-95 duration-100"
      style={{ left: position.x, top: position.y }}
    >
      {options.map((option, index) => (
        <div
          key={index}
          className="context-menu-item px-4 py-2 text-sm text-gray-800 dark:text-gray-100 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          onClick={() => {
            option.action();
            onHide();
          }}
        >
          {option.label}
        </div>
      ))}
    </div>
  );
};