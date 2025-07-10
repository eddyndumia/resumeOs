import React from 'react';

interface ContentViewProps {
  selectedId: string;
}

export const ContentView: React.FC<ContentViewProps> = ({ selectedId }) => {
  const getFolderName = (id: string) => {
    switch (id) {
      case 'exp': return '/Experience';
      case 'proj': return '/Projects';
      case 'cert': return '/Certifications';
      default: return '';
    }
  };

  return (
    <div className="content flex-1 bg-[#fafafa] p-4">
      {selectedId ? (
        <div>
          <h2 className="text-lg font-semibold text-[#333] mb-4">
            {getFolderName(selectedId)}
          </h2>
          <div className="text-[#666]">
            Folder contents will be displayed here
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full text-[#666]">
          Select a folder to view its contents
        </div>
      )}
    </div>
  );
};