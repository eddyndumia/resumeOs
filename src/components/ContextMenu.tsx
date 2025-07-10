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
      className="context-menu absolute bg-white border border-[#ccc] rounded shadow-[0_2px_8px_rgba(0,0,0,0.15)] py-1 w-[180px] z-[1000]"
      style={{ left: position.x, top: position.y }}
    >
      {options.map((option, index) => (
        <div
          key={index}
          className="context-menu-item px-4 py-1.5 text-sm text-[#333] cursor-pointer hover:bg-[#f0f0f0]"
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