import React from 'react';

interface WindowShellProps {
  children: React.ReactNode;
}

export const WindowShell: React.FC<WindowShellProps> = ({ children }) => {
  return (
    <div className="w-screen h-screen bg-[#f2f2f5] p-0">
      <div className="w-full h-full bg-[#f2f2f5] border border-[#ccc] rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
        {/* Top Bar */}
        <div className="h-10 bg-[#e0e0e0] flex items-center px-3 rounded-t-lg">
          <div className="flex items-center space-x-2">
            <div className="traffic-light red"></div>
            <div className="traffic-light yellow"></div>
            <div className="traffic-light green"></div>
          </div>
          <div className="flex-1 text-center">
            <span className="text-sm font-medium text-[#333]">ResumeOS</span>
          </div>
        </div>
        
        {/* Main Container */}
        <div className="flex h-[calc(100%-40px)]">
          {children}
        </div>
      </div>
    </div>
  );
};