import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FormBuilder } from '../components/FormBuilder';
import { ArrowLeft, Plus, Trash2, Edit3, Download } from 'lucide-react';
import { experienceSchema, type Experience } from '../schemas/experience';
import { projectSchema, type Project } from '../schemas/projects';
import { certificationSchema, type Certification } from '../schemas/certifications';
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
  const [editingItem, setEditingItem] = useState<{ section: string; index: number } | null>(null);

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

  const getSchema = (section: string) => {
    switch (section) {
      case 'experience': return experienceSchema;
      case 'projects': return projectSchema;
      case 'certifications': return certificationSchema;
      default: return experienceSchema;
    }
  };

  const getDefaultItem = (section: string) => {
    switch (section) {
      case 'experience':
        return { id: Date.now().toString(), title: '', company: '', startDate: '', endDate: '', description: '' };
      case 'projects':
        return { id: Date.now().toString(), title: '', description: '', technologies: [], url: '' };
      case 'certifications':
        return { id: Date.now().toString(), title: '', issuer: '', date: '', credentialId: '' };
      default:
        return {};
    }
  };

  const addItem = () => {
    const newItem = getDefaultItem(activeSection);
    setData((prev: any) => ({
      ...prev,
      [activeSection]: [...prev[activeSection], newItem],
    }));
    setEditingItem({ section: activeSection, index: data[activeSection].length });
  };

  const removeItem = (index: number) => {
    setData((prev: any) => ({
      ...prev,
      [activeSection]: prev[activeSection].filter((_: any, i: number) => i !== index),
    }));
    if (editingItem?.index === index) {
      setEditingItem(null);
    }
  };

  const handleFormSubmit = (values: any) => {
    if (!editingItem) return;
    
    // Handle array fields for projects
    if (values.technologies && typeof values.technologies === 'string') {
      values.technologies = values.technologies.split(',').map((t: string) => t.trim()).filter(Boolean);
    }

    setData((prev: any) => ({
      ...prev,
      [editingItem.section]: prev[editingItem.section].map((item: any, index: number) =>
        index === editingItem.index ? values : item
      ),
    }));
    
    setEditingItem(null);
  };

  const startEditing = (section: string, index: number) => {
    setActiveSection(section);
    setEditingItem({ section, index });
  };

  const getDisplayValue = (item: any, key: string) => {
    if (Array.isArray(item[key])) {
      return item[key].join(', ');
    }
    return item[key] || '';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-['Inter','Segoe_UI',system-ui] transition-colors duration-200">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
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

      <div className="max-w-3xl mx-auto p-4 sm:p-6">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="hidden sm:flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl transition-colors duration-200">
            {['experience', 'projects', 'certifications'].map((section) => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all min-h-[44px] ${
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
          {editingItem && editingItem.section === activeSection ? (
            <div className="bg-white dark:bg-[#1E1E1E] rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-6">
                <Edit3 size={20} className="text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {editingItem.index < data[activeSection].length ? 'Edit' : 'Add'} {activeSection.slice(0, -1)}
                </h3>
              </div>
              
              <FormBuilder
                schema={getSchema(activeSection)}
                defaultValues={{
                  ...data[activeSection][editingItem.index] || getDefaultItem(activeSection),
                  technologies: Array.isArray(data[activeSection][editingItem.index]?.technologies) 
                    ? data[activeSection][editingItem.index].technologies.join(', ')
                    : data[activeSection][editingItem.index]?.technologies || ''
                }}
                onSubmit={handleFormSubmit}
                onCancel={() => setEditingItem(null)}
              />
            </div>
          ) : (
            <div className="space-y-4">
              {data[activeSection]?.map((item: any, index: number) => (
                <div key={item.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        {item.title || `${activeSection.slice(0, -1)} #${index + 1}`}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        {Object.entries(item).map(([key, value]) => {
                          if (key === 'id' || key === 'title') return null;
                          return (
                            <div key={key} className={key.includes('description') ? 'sm:col-span-2' : ''}>
                              <span className="text-gray-500 dark:text-gray-400 capitalize">
                                {key.replace(/([A-Z])/g, ' $1').trim()}:
                              </span>
                              <span className="ml-2 text-gray-900 dark:text-gray-100">
                                {getDisplayValue(item, key) || 'Not specified'}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => startEditing(activeSection, index)}
                        className="flex items-center gap-1 px-3 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
                      >
                        <Edit3 size={14} />
                        Edit
                      </button>
                      <button
                        onClick={() => removeItem(index)}
                        className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                      >
                        <Trash2 size={14} />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          {!editingItem && (
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button
                onClick={addItem}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors min-h-[44px] font-medium shadow-sm"
              >
                <Plus size={18} />
                Add {activeSection.slice(0, -1)}
              </button>
              <button
                onClick={handleSave}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors min-h-[44px] font-medium shadow-sm"
              >
                <Download size={18} />
                Save All Changes
              </button>
            </div>
          )
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