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
              // Secondary button style
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-500 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors"
            >
              <Download size={16} />
              Export JSON
            </button>
          </div>
        </div>
      </div>

      {/* Increased top padding for content area, and max-w-4xl for slightly wider content if needed */}
      <div className="max-w-4xl mx-auto p-6 sm:p-8">
        {/* Tab Navigation */}
        {/* Using a slightly more pronounced background for the tab container */}
        <div className="mb-8 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-sm">
          <div className="hidden sm:flex space-x-1">
            {['experience', 'projects', 'certifications'].map((section) => (
              <button
                key={section}
                onClick={() => { setEditingItem(null); setActiveSection(section);}} // Clear editing item when changing tabs
                className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${ // Increased py
                  activeSection === section
                    ? 'bg-white dark:bg-gray-700 text-indigo-700 dark:text-indigo-300 shadow' // Accent color for active tab text
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200/70 dark:hover:bg-gray-700/70 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
            ))}
          </div>
          
          {/* Mobile Dropdown - styled to match FormField */}
          <select
            value={activeSection}
            onChange={(e) => { setEditingItem(null); setActiveSection(e.target.value);}} // Clear editing item
            className="sm:hidden block w-full text-sm shadow-sm border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:outline-none rounded-md min-h-[44px] px-3 py-2"
          >
            {['experience', 'projects', 'certifications'].map((section) => (
              <option key={section} value={section}>
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Content Area */}
        <div className="transition-opacity duration-300 ease-in-out">
          {editingItem && editingItem.section === activeSection ? (
             // Using slightly different bg for edit form section for better visual separation
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 sm:p-8 shadow-xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                <Edit3 size={22} className="text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                  {editingItem.index < data[activeSection].length ? 'Edit' : 'Add New'} {activeSection.slice(0, -1)}
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
                        {/* Standardized small button styles */}
                        <Edit3 size={14} />
                        Edit
                      </button>
                      <button
                        onClick={() => removeItem(index)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700/50 rounded-md hover:bg-red-100 dark:hover:bg-red-800/50 hover:border-red-300 dark:hover:border-red-600 transition-colors"
                      >
                        <Trash2 size={14} />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {data[activeSection]?.length === 0 && (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No {activeSection}</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by adding a new {activeSection.slice(0,-1)}.</p>
                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={addItem}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900"
                    >
                      <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                      Add New {activeSection.slice(0, -1)}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons - Standardized */}
          {!editingItem && data[activeSection]?.length > 0 && ( // Only show if not editing AND there are items
            <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-3">
              <button
                onClick={addItem}
                // Primary button style (Green for "Add")
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors"
              >
                <Plus size={18} />
                Add New {activeSection.slice(0, -1)}
              </button>
              <button
                onClick={handleSave}
                // Primary button style (Blue for "Save")
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors"
              >
                <Download size={18} /> {/* Changed icon to Save/Download style */}
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Toast Notification - slightly refined */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-800 dark:bg-gray-100 text-white dark:text-gray-800 px-5 py-3.5 rounded-lg shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-4 duration-300">
          {/* <CheckCircle size={20} className="text-green-400 dark:text-green-500" /> */}
          <div className="w-2 h-2 bg-green-400 dark:bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">Changes saved successfully!</span>
        </div>
      )}
    </div>
  );
};

export default AdminEditor;