import React, { useState, useEffect } from 'react';
import { WindowShell } from '../components/WindowShell';
import { FormField } from '../components/FormField';
import experienceData from '../data/experience.json';
import projectsData from '../data/projects.json';
import certificationsData from '../data/certifications.json';

const AdminEditor: React.FC = () => {
  const [activeSection, setActiveSection] = useState('experience');
  const [data, setData] = useState<any>({
    experience: experienceData,
    projects: projectsData,
    certifications: certificationsData,
  });

  useEffect(() => {
    const saved = localStorage.getItem('resumeData');
    if (saved) {
      setData(JSON.parse(saved));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('resumeData', JSON.stringify(data));
    alert('Data saved successfully!');
  };

  const handleFieldChange = (sectionIndex: number, field: string, value: any) => {
    setData((prev: any) => ({
      ...prev,
      [activeSection]: prev[activeSection].map((item: any, index: number) =>
        index === sectionIndex ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addItem = () => {
    const newItem = activeSection === 'experience' 
      ? { id: Date.now().toString(), title: '', company: '', startDate: '', endDate: '', description: '' }
      : activeSection === 'projects'
      ? { id: Date.now().toString(), title: '', description: '', technologies: [], url: '' }
      : { id: Date.now().toString(), title: '', issuer: '', date: '', credentialId: '' };

    setData((prev: any) => ({
      ...prev,
      [activeSection]: [...prev[activeSection], newItem],
    }));
  };

  const removeItem = (index: number) => {
    setData((prev: any) => ({
      ...prev,
      [activeSection]: prev[activeSection].filter((_: any, i: number) => i !== index),
    }));
  };

  return (
    <WindowShell>
      <div className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-4">Admin Editor</h1>
          <div className="flex space-x-4 mb-6">
            {['experience', 'projects', 'certifications'].map((section) => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`px-4 py-2 rounded ${
                  activeSection === section
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {data[activeSection]?.map((item: any, index: number) => (
            <div key={item.id} className="border border-gray-300 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Item {index + 1}</h3>
                <button
                  onClick={() => removeItem(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
              
              {Object.entries(item).map(([key, value]) => {
                if (key === 'id') return null;
                return (
                  <FormField
                    key={key}
                    label={key}
                    value={value}
                    onChange={(newValue) => handleFieldChange(index, key, newValue)}
                  />
                );
              })}
            </div>
          ))}
        </div>

        <div className="mt-6 flex space-x-4">
          <button
            onClick={addItem}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Add Item
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save Changes
          </button>
        </div>
      </div>
    </WindowShell>
  );
};

export default AdminEditor;