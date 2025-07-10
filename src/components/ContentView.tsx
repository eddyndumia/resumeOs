import React, { useState, useEffect } from 'react';
import experienceData from '../data/experience.json';
import projectsData from '../data/projects.json';
import certificationsData from '../data/certifications.json';

interface ContentViewProps {
  selectedId: string;
}

export const ContentView: React.FC<ContentViewProps> = ({ selectedId }) => {
  const [data, setData] = useState<any>({
    exp: experienceData,
    proj: projectsData,
    cert: certificationsData,
  });

  useEffect(() => {
    const saved = localStorage.getItem('resumeData');
    if (saved) {
      const parsedData = JSON.parse(saved);
      setData({
        exp: parsedData.experience || experienceData,
        proj: parsedData.projects || projectsData,
        cert: parsedData.certifications || certificationsData,
      });
    }
  }, []);

  const getFolderName = (id: string) => {
    switch (id) {
      case 'exp': return '/Experience';
      case 'proj': return '/Projects';
      case 'cert': return '/Certifications';
      default: return '';
    }
  };

  const renderCard = (item: any, index: number) => (
    <div key={item.id || index} className="bg-white border border-[#ddd] rounded-md p-4 w-[300px] m-3">
      <h3 className="font-medium text-[#333] mb-2">{item.title}</h3>
      {item.company && <p className="text-sm text-[#666] mb-1">{item.company}</p>}
      {item.issuer && <p className="text-sm text-[#666] mb-1">{item.issuer}</p>}
      {item.startDate && (
        <p className="text-sm text-[#666] mb-2">
          {item.startDate} - {item.endDate || 'Present'}
        </p>
      )}
      {item.date && <p className="text-sm text-[#666] mb-2">{item.date}</p>}
      {item.description && <p className="text-sm text-[#333] leading-relaxed">{item.description}</p>}
      {item.technologies && (
        <div className="mt-2">
          {item.technologies.map((tech: string, i: number) => (
            <span key={i} className="inline-block bg-gray-100 text-xs px-2 py-1 rounded mr-1 mb-1">
              {tech}
            </span>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="content flex-1 bg-[#fafafa] p-4">
      {selectedId ? (
        <div>
          <h2 className="text-lg font-semibold text-[#333] mb-4">
            {getFolderName(selectedId)}
          </h2>
          <div className="flex flex-wrap">
            {data[selectedId]?.map(renderCard) || (
              <div className="text-[#666]">No items found</div>
            )}
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