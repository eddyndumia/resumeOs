import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FormField } from '../components/FormField';
import { ArrowLeft, Plus, Trash2, Save, Download } from 'lucide-react';
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
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('resumeData');
    if (saved) {
      setData(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    const preventRightClick = (e: MouseEvent) => e.preventDefault();
    document.addEventListener('contextmenu', preventRightClick);
    return () => document.removeEventListener('contextmenu', preventRightClick);
  }, []);

  const handleSave = () => {
    localStorage.setItem('resumeData', JSON.stringify(data));
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resume-data.json';
    a.click();
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-['Inter','Segoe_UI',system-ui]">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
                <ArrowLeft size={20} />
                <span className="text-sm font-medium">Back to ResumeOS</span>
              </Link>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Admin Panel - {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
              </h1>
            </div>
            <button
              onClick={exportJSON}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-md transition-colors"
            >
              <Download size={16} />
              Export JSON
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="hidden sm:flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            {['experience', 'projects', 'certifications'].map((section) => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all min-h-[44px] ${
                  activeSection === section
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
            ))}
          </div>
          
          {/* Mobile Dropdown */}
          <select
            value={activeSection}
            onChange={(e) => setActiveSection(e.target.value)}
            className="sm:hidden w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-sm min-h-[44px]"
          >
            {['experience', 'projects', 'certifications'].map((section) => (
              <option key={section} value={section}>
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Content Area */}
        <div className="transition-opacity duration-200">
          <div className="space-y-6">
            {data[activeSection]?.map((item: any, index: number) => (
              <div key={item.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} #{index + 1}
                  </h3>
                  <button
                    onClick={() => removeItem(index)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                  >
                    <Trash2 size={16} />
                    Remove
                  </button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(item).map(([key, value]) => {
                    if (key === 'id') return null;
                    return (
                      <div key={key} className={key.includes('description') ? 'sm:col-span-2' : ''}>
                        <FormField
                          label={key}
                          value={value}
                          onChange={(newValue) => handleFieldChange(index, key, newValue)}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button
              onClick={addItem}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors min-h-[44px] font-medium"
            >
              <Plus size={18} />
              Add {activeSection.slice(0, -1)}
            </button>
            <button
              onClick={handleSave}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors min-h-[44px] font-medium"
            >
              <Save size={18} />
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg animate-in slide-in-from-bottom-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-300 rounded-full"></div>
            Changes saved successfully ✅
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEditor;