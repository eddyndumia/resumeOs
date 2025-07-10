import React from 'react';

interface SidebarItem {
  id: string;
  label: string;
  type: 'folder' | 'file';
  children?: SidebarItem[];
}

interface SidebarProps {
  items: SidebarItem[];
  selectedId: string;
  onSelect: (id: string) => void;
  onContextMenu: (id: string, type: 'folder' | 'file', event: React.MouseEvent) => void;
}

const FolderIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#ffa500]">
    <path d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2h-8l-2-2z" fill="currentColor"/>
  </svg>
);

export const Sidebar: React.FC<SidebarProps> = ({ items, selectedId, onSelect, onContextMenu }) => {
  const hardcodedItems = [
    { id: 'exp', label: '/Experience', type: 'folder' as const, children: [] },
    { id: 'proj', label: '/Projects', type: 'folder' as const, children: [] },
    { id: 'cert', label: '/Certifications', type: 'folder' as const, children: [] },
  ];

  return (
    <div className="w-[260px] bg-white border-r border-[#ddd]">
      <div className="p-4">
        {hardcodedItems.map((item) => (
          <div
            key={item.id}
            className={`flex items-center px-4 py-1 text-sm text-[#444] leading-6 cursor-pointer hover:bg-[#eef0f2] transition-colors duration-150 ${
              selectedId === item.id ? 'bg-[#dde1e5] border-l-3 border-l-[#007aff]' : ''
            }`}
            onClick={() => onSelect(item.id)}
            onContextMenu={(e) => {
              e.preventDefault();
              onContextMenu(item.id, item.type, e);
            }}
          >
            <FolderIcon />
            <span className="ml-2">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};