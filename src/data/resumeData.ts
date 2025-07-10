// src/data/resumeData.ts
import React from 'react';

export interface ResumeItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  icon?: string; // Consider using specific icon names or React components later
  parentId?: string | null;
  childrenIds?: string[];
  content?: string | React.ReactNode; // For file content
  details?: string; // For folder list view, like "File folder"
}

export const resumeData: ResumeItem[] = [
  // Root level items (Desktop)
  {
    id: 'myComputer',
    name: 'My Computer',
    type: 'folder',
    parentId: null,
    icon: 'myComputerIcon', // Placeholder for actual icon
    childrenIds: ['resumeDriveC'],
    details: 'System Folder'
  },
  {
    id: 'userProfile',
    name: 'Jules Doe (User)',
    type: 'folder',
    parentId: null,
    icon: 'userFolderIcon',
    childrenIds: ['desktop', 'documents', 'downloads'],
    details: 'User Profile Folder'
  },
  {
    id: 'recycleBin',
    name: 'Recycle Bin',
    type: 'folder', // Special system folder
    parentId: null,
    icon: 'recycleBinEmptyIcon', // or recycleBinFullIcon
    childrenIds: [], // Initially empty
    details: 'Contains deleted items'
  },

  // Inside My Computer
  {
    id: 'resumeDriveC',
    name: 'Resume (C:)',
    type: 'folder', // Represents a drive
    parentId: 'myComputer',
    icon: 'driveIcon',
    childrenIds: ['programFiles', 'windowsResume', 'personalInfo'],
    details: 'Local Disk'
  },

  // Inside User Profile
  {
    id: 'desktop',
    name: 'Desktop',
    type: 'folder',
    parentId: 'userProfile',
    icon: 'folderIcon',
    childrenIds: ['resumeShortcut'], // Shortcut to the main resume folder/file
    details: 'File folder'
  },
  {
    id: 'resumeShortcut',
    name: 'View Resume.lnk',
    type: 'file', // Represents a shortcut
    parentId: 'desktop',
    icon: 'shortcutIcon',
    content: 'Shortcut to "My Resume" section or C:/Windows Resume/My Resume.exe',
    details: 'Shortcut'
  },
  {
    id: 'documents',
    name: 'Documents',
    type: 'folder',
    parentId: 'userProfile',
    icon: 'folderIcon',
    childrenIds: ['coverLetterDoc', 'referencesDoc'],
    details: 'File folder'
  },
  {
    id: 'coverLetterDoc',
    name: 'Cover Letter.docx',
    type: 'file',
    parentId: 'documents',
    icon: 'wordDocIcon',
    content: React.createElement('div', {},
      React.createElement('h2', {className: 'text-xl font-semibold mb-2'}, 'Cover Letter'),
      React.createElement('p', {}, 'Dear Hiring Manager, ... I am writing to express my keen interest in the Software Engineer position...')
    ),
    details: 'Microsoft Word Document'
  },
  {
    id: 'referencesDoc',
    name: 'References.docx',
    type: 'file',
    parentId: 'documents',
    icon: 'wordDocIcon',
    content: React.createElement('div', {},
      React.createElement('h2', {className: 'text-xl font-semibold mb-2'}, 'References'),
      React.createElement('p', {}, 'Available upon request.')
    ),
    details: 'Microsoft Word Document'
  },
  {
    id: 'downloads',
    name: 'Downloads',
    type: 'folder',
    parentId: 'userProfile',
    icon: 'folderIcon',
    childrenIds: [],
    details: 'File folder'
  },


  // Inside Resume (C:)
  {
    id: 'programFiles',
    name: 'Program Files',
    type: 'folder',
    parentId: 'resumeDriveC',
    icon: 'folderIcon',
    childrenIds: [],
    details: 'File folder'
  },
  {
    id: 'windowsResume',
    name: 'Windows Resume', // Main resume content starts here
    type: 'folder',
    parentId: 'resumeDriveC',
    icon: 'folderIcon',
    childrenIds: ['summary', 'experience', 'education', 'skills', 'projects', 'contact'],
    details: 'File folder - Core Resume Data'
  },
  {
    id: 'personalInfo',
    name: 'Personal Info',
    type: 'folder',
    parentId: 'resumeDriveC',
    icon: 'folderSecureIcon', // Icon suggesting privacy/security
    childrenIds: ['contactInfoTxt', 'addressInfoTxt'],
    details: 'File folder'
  },
  {
    id: 'contactInfoTxt',
    name: 'Contact.txt',
    type: 'file',
    parentId: 'personalInfo',
    icon: 'fileTextIcon',
    content: React.createElement('div', {className: 'font-mono text-sm p-4 bg-white dark:bg-gray-800 rounded shadow'},
      React.createElement('h3', {className: 'text-lg font-semibold mb-2 border-b pb-1'}, 'Contact Information'),
      React.createElement('p', {}, 'Email: jules.doe@example.com'),
      React.createElement('p', {}, 'Phone: (555) 123-4567'),
      React.createElement('p', {}, 'LinkedIn: linkedin.com/in/julesdoe'),
      React.createElement('p', {}, 'GitHub: github.com/julesdoe')
    ),
    details: 'Text Document'
  },
  {
    id: 'addressInfoTxt',
    name: 'Address.txt',
    type: 'file',
    parentId: 'personalInfo',
    icon: 'fileTextIcon',
    content: React.createElement('div', {className: 'font-mono text-sm p-4 bg-white dark:bg-gray-800 rounded shadow'},
      React.createElement('h3', {className: 'text-lg font-semibold mb-2 border-b pb-1'}, 'Address'),
      React.createElement('p', {}, '123 Main Street'),
      React.createElement('p', {}, 'Anytown, ST 12345')
    ),
    details: 'Text Document'
  },

  // Core Resume Sections (inside C:/Windows Resume)
  {
    id: 'summary',
    name: 'Summary.exe', // Making them look like executables or rich text files
    type: 'file',
    parentId: 'windowsResume',
    icon: 'executableFileIcon', // or 'richTextBoxIcon'
    content: React.createElement('div', {className: 'p-4'},
      React.createElement('h2', {className: 'text-2xl font-bold mb-3 text-blue-700 dark:text-blue-400'}, 'Professional Summary'),
      React.createElement('p', {className: 'text-gray-700 dark:text-gray-300 leading-relaxed'}, 'Dynamic and results-oriented Full Stack Engineer with 5+ years of experience in developing and implementing innovative software solutions. Proficient in React, Node.js, Python, and cloud technologies. Proven ability to lead projects and collaborate effectively in fast-paced environments.')
    ),
    details: 'Application'
  },
  {
    id: 'experience',
    name: 'Work Experience',
    type: 'folder',
    parentId: 'windowsResume',
    icon: 'folderIcon',
    childrenIds: ['job1', 'job2'],
    details: 'File folder'
  },
  {
    id: 'job1',
    name: 'SeniorDev_TechCorp.dat',
    type: 'file',
    parentId: 'experience',
    icon: 'dataFileIcon',
    content: React.createElement('div', {className: 'p-4'},
      React.createElement('h3', {className: 'text-xl font-semibold text-gray-800 dark:text-gray-200'}, 'Senior Software Engineer'),
      React.createElement('p', {className: 'text-md text-indigo-600 dark:text-indigo-400 mb-1'}, 'Tech Solutions Inc. | Jan 2020 - Present'),
      React.createElement('ul', {className: 'list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1'},
        React.createElement('li', {}, 'Led the development of a new client-facing analytics dashboard using React and D3.js, resulting in a 20% increase in user engagement.'),
        React.createElement('li', {}, 'Architected and implemented microservices using Node.js and Docker, improving system scalability and reducing server costs by 15%.'),
        React.createElement('li', {}, 'Mentored junior engineers and conducted code reviews to ensure high-quality software delivery.')
      )
    ),
    details: 'Configuration File'
  },
  {
    id: 'job2',
    name: 'Dev_InnovateLLC.dat',
    type: 'file',
    parentId: 'experience',
    icon: 'dataFileIcon',
    content: React.createElement('div', {className: 'p-4'},
      React.createElement('h3', {className: 'text-xl font-semibold text-gray-800 dark:text-gray-200'}, 'Software Engineer'),
      React.createElement('p', {className: 'text-md text-indigo-600 dark:text-indigo-400 mb-1'}, 'Innovate LLC | Jun 2017 - Dec 2019'),
      React.createElement('ul', {className: 'list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1'},
        React.createElement('li', {}, 'Developed and maintained features for a SaaS product using Python (Django) and PostgreSQL.'),
        React.createElement('li', {}, 'Collaborated with cross-functional teams to define project requirements and deliver solutions on time.'),
        React.createElement('li', {}, 'Contributed to the migration of legacy systems to a modern cloud infrastructure (AWS).')
      )
    ),
    details: 'Configuration File'
  },
  {
    id: 'education',
    name: 'Education History',
    type: 'folder',
    parentId: 'windowsResume',
    icon: 'folderIcon',
    childrenIds: ['degree1', 'cert1'],
    details: 'File folder'
  },
  {
    id: 'degree1',
    name: 'BS_ComputerScience.edu',
    type: 'file',
    parentId: 'education',
    icon: 'certificateFileIcon', // Or a generic file icon
    content: React.createElement('div', {className: 'p-4'},
      React.createElement('h3', {className: 'text-xl font-semibold text-gray-800 dark:text-gray-200'}, 'B.S. in Computer Science'),
      React.createElement('p', {className: 'text-md text-indigo-600 dark:text-indigo-400 mb-1'}, 'State University | Graduated: May 2017'),
      React.createElement('p', {className: 'text-gray-600 dark:text-gray-400'}, 'Relevant Coursework: Data Structures, Algorithms, Database Management, Software Engineering.')
    ),
    details: 'Educational Record'
  },
  {
    id: 'cert1',
    name: 'CloudPractitioner.cert',
    type: 'file',
    parentId: 'education',
    icon: 'certificateFileIcon',
    content: React.createElement('div', {className: 'p-4'},
      React.createElement('h3', {className: 'text-xl font-semibold text-gray-800 dark:text-gray-200'}, 'AWS Certified Cloud Practitioner'),
      React.createElement('p', {className: 'text-md text-indigo-600 dark:text-indigo-400 mb-1'}, 'Amazon Web Services | Issued: Mar 2021'),
    ),
    details: 'Certificate File'
  },
  {
    id: 'skills',
    name: 'Skills.cfg',
    type: 'file',
    parentId: 'windowsResume',
    icon: 'settingsFileIcon',
    content: React.createElement('div', {className: 'p-4'},
      React.createElement('h2', {className: 'text-2xl font-bold mb-3 text-blue-700 dark:text-blue-400'}, 'Technical Skills'),
      React.createElement('div', {className: 'grid grid-cols-1 md:grid-cols-2 gap-4'},
        React.createElement('div', {},
          React.createElement('h4', {className: 'text-lg font-semibold text-gray-800 dark:text-gray-200'}, 'Programming Languages:'),
          React.createElement('p', {className: 'text-gray-600 dark:text-gray-400'}, 'JavaScript (ES6+), TypeScript, Python, Java, C#')
        ),
        React.createElement('div', {},
          React.createElement('h4', {className: 'text-lg font-semibold text-gray-800 dark:text-gray-200'}, 'Frameworks & Libraries:'),
          React.createElement('p', {className: 'text-gray-600 dark:text-gray-400'}, 'React, Node.js, Express, Django, Spring Boot, .NET')
        ),
        React.createElement('div', {},
          React.createElement('h4', {className: 'text-lg font-semibold text-gray-800 dark:text-gray-200'}, 'Databases:'),
          React.createElement('p', {className: 'text-gray-600 dark:text-gray-400'}, 'PostgreSQL, MySQL, MongoDB, SQL Server')
        ),
        React.createElement('div', {},
          React.createElement('h4', {className: 'text-lg font-semibold text-gray-800 dark:text-gray-200'}, 'Tools & Technologies:'),
          React.createElement('p', {className: 'text-gray-600 dark:text-gray-400'}, 'Git, Docker, Kubernetes, AWS, Azure, Jenkins, Jira')
        )
      )
    ),
    details: 'Configuration Settings'
  },
  {
    id: 'projects',
    name: 'Projects Showcase',
    type: 'folder',
    parentId: 'windowsResume',
    icon: 'folderIcon',
    childrenIds: ['project1', 'project2'],
    details: 'File folder'
  },
  {
    id: 'project1',
    name: 'PortfolioSite_README.txt',
    type: 'file',
    parentId: 'projects',
    icon: 'fileTextIcon',
    content: React.createElement('div', {className: 'p-4'},
      React.createElement('h3', {className: 'text-xl font-semibold text-gray-800 dark:text-gray-200'}, 'Personal Portfolio Website (This App!)'),
      React.createElement('p', {className: 'text-md text-indigo-600 dark:text-indigo-400 mb-1'}, 'React, TypeScript, Tailwind CSS'),
      React.createElement('p', {className: 'text-gray-600 dark:text-gray-400'}, 'Developed an interactive resume application styled as a Windows Explorer interface. Features include dynamic content rendering, custom context menus, and a themeable UI.')
    ),
    details: 'Text Document'
  },
  {
    id: 'project2',
    name: 'AIChatbot_README.txt',
    type: 'file',
    parentId: 'projects',
    icon: 'fileTextIcon',
    content: React.createElement('div', {className: 'p-4'},
      React.createElement('h3', {className: 'text-xl font-semibold text-gray-800 dark:text-gray-200'}, 'AI Customer Service Chatbot'),
      React.createElement('p', {className: 'text-md text-indigo-600 dark:text-indigo-400 mb-1'}, 'Python, NLTK, TensorFlow'),
      React.createElement('p', {className: 'text-gray-600 dark:text-gray-400'}, 'Built a machine learning-powered chatbot to handle customer inquiries, reducing response times by 30%. Integrated with existing CRM systems.')
    ),
    details: 'Text Document'
  },
  {
    id: 'contact',
    name: 'ContactMe.url',
    type: 'file',
    parentId: 'windowsResume',
    icon: 'urlFileIcon', // or 'htmlFileIcon'
    content: React.createElement('div', {className: 'p-4 font-mono text-sm bg-white dark:bg-gray-800 rounded shadow'},
      React.createElement('h2', {className: 'text-xl font-semibold mb-3 border-b pb-1'}, 'Contact Card'),
      React.createElement('p', {}, 'Name: Jules Doe'),
      React.createElement('p', {}, 'Email: jules.doe@example.com'),
      React.createElement('p', {}, 'Phone: (555) 123-4567'),
      React.createElement('p', {}, 'LinkedIn: ', React.createElement('a', {href: 'https://linkedin.com/in/julesdoe', target: '_blank', className: 'text-blue-500 hover:underline'}, 'linkedin.com/in/julesdoe')),
      React.createElement('p', {}, 'GitHub: ', React.createElement('a', {href: 'https://github.com/julesdoe', target: '_blank', className: 'text-blue-500 hover:underline'}, 'github.com/julesdoe')),
      React.createElement('p', {className: 'mt-4 text-xs italic'}, 'This "URL" file contains my contact details. In a real OS, it might open an email client or a webpage.')
    ),
    details: 'Internet Shortcut'
  },
];

// Helper function to get items by parent ID for easier rendering
export const getItemsByParentId = (parentId: string | null): ResumeItem[] => {
  return resumeData.filter(item => item.parentId === parentId);
}

// Helper function to get a single item by ID
export const getItemById = (id: string): ResumeItem | undefined => {
  return resumeData.find(item => item.id === id);
}

// Helper to get all descendant file contents of a folder (recursive)
// This might be useful for a "details" view or search
export const getFolderContentsRecursive = (folderId: string): ResumeItem[] => {
  const items: ResumeItem[] = [];
  const folder = getItemById(folderId);

  if (folder && folder.type === 'folder' && folder.childrenIds) {
    for (const childId of folder.childrenIds) {
      const childItem = getItemById(childId);
      if (childItem) {
        items.push(childItem);
        if (childItem.type === 'folder') {
          items.push(...getFolderContentsRecursive(childId));
        }
      }
    }
  }
  return items;
};
