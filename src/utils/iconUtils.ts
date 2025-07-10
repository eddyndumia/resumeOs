import React from 'react';
import { ResumeItem } from '../data/resumeData';
import {
  FaFolder, FaFolderOpen, FaFileAlt, FaDesktop, FaUserCircle, FaHdd, FaRecycle,
  FaFileCode, FaFileWord, FaFileImage, FaFilePdf, FaFileArchive, FaFileAudio, FaFileVideo,
  FaQuestionCircle, FaCogs, FaLink, FaNetworkWired, FaTerminal, FaRegFileExcel, FaRegFilePowerpoint
} from 'react-icons/fa';
import { VscJson, VscSettingsGear, VscMarkdown } from 'react-icons/vsc';
import { DiReact, DiNodejsSmall, DiPython, DiJava, DiDocker, DiGit } from 'react-icons/di';
import { SiTypescript, SiJavascript, SiHtml5, SiCss3, SiTailwindcss } from 'react-icons/si';

export const getIconForExplorerItem = (
  item: ResumeItem,
  isExpanded?: boolean,
  size: number = 16,
  baseClassName: string = "mr-2 flex-shrink-0"
): React.ReactNode => {
  const className = `${baseClassName} text-[${size}px]`; // Ensure icon size is applied if not overridden by specific classes

  // 1. Specific system-level icons from resumeData icon hints
  if (item.icon) {
    switch (item.icon) {
      case 'myComputerIcon': return <FaDesktop size={size} className={`${className} text-blue-500 dark:text-blue-400`} />;
      case 'userFolderIcon': return <FaUserCircle size={size} className={`${className} text-green-500 dark:text-green-400`} />;
      case 'driveIcon': return <FaHdd size={size} className={`${className} text-gray-500 dark:text-gray-400`} />;
      case 'recycleBinEmptyIcon': return <FaRecycle size={size} className={`${className} text-gray-500 dark:text-gray-400`} />;
      case 'recycleBinFullIcon': return <FaRecycle size={size} className={`${className} text-blue-600 dark:text-blue-500`} />;

      case 'folderIcon': return isExpanded ? <FaFolderOpen size={size} className={`${className} text-yellow-500 dark:text-yellow-400`} /> : <FaFolder size={size} className={`${className} text-yellow-500 dark:text-yellow-400`} />;
      case 'folderSecureIcon': return isExpanded ? <FaFolderOpen size={size} className={`${className} text-purple-500 dark:text-purple-400`} /> : <FaFolder size={size} className={`${className} text-purple-500 dark:text-purple-400`} />;

      case 'fileTextIcon': return <FaFileAlt size={size} className={`${className} text-gray-700 dark:text-gray-300`} />;
      case 'wordDocIcon': return <FaFileWord size={size} className={`${className} text-blue-600 dark:text-blue-500`} />;
      case 'excelDocIcon': return <FaRegFileExcel size={size} className={`${className} text-green-600 dark:text-green-500`} />;
      case 'powerpointDocIcon': return <FaRegFilePowerpoint size={size} className={`${className} text-orange-600 dark:text-orange-500`} />;

      case 'executableFileIcon': return <DiReact size={size+2} className={`${className} text-cyan-500 dark:text-cyan-400`} />;
      case 'dataFileIcon': return <VscJson size={size} className={`${className} text-orange-500 dark:text-orange-400`} />;
      case 'certificateFileIcon': return <FaFilePdf size={size} className={`${className} text-red-500 dark:text-red-400`} />;
      case 'settingsFileIcon': return <FaCogs size={size} className={`${className} text-gray-600 dark:text-gray-500`} />;
      case 'urlFileIcon': return <FaLink size={size} className={`${className} text-sky-500 dark:text-sky-400`} />;
      case 'shortcutIcon': return <FaLink size={size} className={`${className} text-sky-500 dark:text-sky-400 transform -rotate-45 origin-center`} />;

      case 'reactIcon': return <DiReact size={size} className={`${className} text-cyan-500`} />;
      case 'nodejsIcon': return <DiNodejsSmall size={size} className={`${className} text-green-500`} />;
      case 'pythonIcon': return <DiPython size={size} className={`${className} text-yellow-500`} />;
      case 'javaIcon': return <DiJava size={size} className={`${className} text-red-500`} />;
      case 'dockerIcon': return <DiDocker size={size} className={`${className} text-blue-600`} />;
      case 'gitIcon': return <DiGit size={size} className={`${className} text-orange-600`} />;
      case 'typescriptIcon': return <SiTypescript size={size} className={`${className} text-blue-500`} />;
      case 'javascriptIcon': return <SiJavascript size={size} className={`${className} text-yellow-400`} />;
      case 'htmlIcon': return <SiHtml5 size={size} className={`${className} text-orange-500`} />;
      case 'cssIcon': return <SiCss3 size={size} className={`${className} text-blue-400`} />;
      case 'tailwindIcon': return <SiTailwindcss size={size} className={`${className} text-cyan-400`} />;

      default: break;
    }
  }

  // 2. Generic type-based icons if no specific hint
  if (item.type === 'folder') {
    return isExpanded ? <FaFolderOpen size={size} className={`${className} text-yellow-500 dark:text-yellow-400`} /> : <FaFolder size={size} className={`${className} text-yellow-500 dark:text-yellow-400`} />;
  }

  // 3. Generic file icons by extension (if no specific icon hint matched above)
  const lowerName = item.name.toLowerCase();
  if (lowerName.endsWith('.txt')) return <FaFileAlt size={size} className={`${className} text-gray-700 dark:text-gray-300`} />;
  if (lowerName.endsWith('.md')) return <VscMarkdown size={size} className={`${className} text-gray-700 dark:text-gray-300`} />;
  if (lowerName.endsWith('.js') || lowerName.endsWith('.jsx')) return <SiJavascript size={size} className={`${className} text-yellow-400 dark:text-yellow-300`} />;
  if (lowerName.endsWith('.ts') || lowerName.endsWith('.tsx')) return <SiTypescript size={size} className={`${className} text-blue-500 dark:text-blue-400`} />;
  if (lowerName.endsWith('.json')) return <VscJson size={size} className={`${className} text-orange-500 dark:text-orange-400`} />;
  if (lowerName.endsWith('.exe') || lowerName.endsWith('.app') || lowerName.endsWith('.bat') || lowerName.endsWith('.sh')) return <FaTerminal size={size} className={`${className} text-gray-700 dark:text-gray-300`} />;
  if (lowerName.endsWith('.dat') || lowerName.endsWith('.cfg') || lowerName.endsWith('.ini') || lowerName.endsWith('.config')) return <VscSettingsGear size={size} className={`${className} text-gray-700 dark:text-gray-300`} />;
  if (lowerName.endsWith('.html') || lowerName.endsWith('.htm')) return <SiHtml5 size={size} className={`${className} text-orange-600 dark:text-orange-500`} />;
  if (lowerName.endsWith('.css')) return <SiCss3 size={size} className={`${className} text-blue-600 dark:text-blue-500`} />;
  if (lowerName.endsWith('.pdf')) return <FaFilePdf size={size} className={`${className} text-red-600 dark:text-red-500`} />;
  if (lowerName.endsWith('.doc') || lowerName.endsWith('.docx')) return <FaFileWord size={size} className={`${className} text-blue-700 dark:text-blue-500`} />;
  if (lowerName.endsWith('.xls') || lowerName.endsWith('.xlsx')) return <FaRegFileExcel size={size} className={`${className} text-green-700 dark:text-green-500`} />;
  if (lowerName.endsWith('.ppt') || lowerName.endsWith('.pptx')) return <FaRegFilePowerpoint size={size} className={`${className} text-orange-700 dark:text-orange-500`} />;
  if (lowerName.endsWith('.zip') || lowerName.endsWith('.rar') || lowerName.endsWith('.tar') || lowerName.endsWith('.gz')) return <FaFileArchive size={size} className={`${className} text-yellow-600 dark:text-yellow-500`} />;
  if (lowerName.endsWith('.png') || lowerName.endsWith('.jpg') || lowerName.endsWith('.jpeg') || lowerName.endsWith('.gif') || lowerName.endsWith('.svg') || lowerName.endsWith('.ico')) return <FaFileImage size={size} className={`${className} text-purple-600 dark:text-purple-500`} />;
  if (lowerName.endsWith('.mp3') || lowerName.endsWith('.wav') || lowerName.endsWith('.ogg')) return <FaFileAudio size={size} className={`${className} text-pink-600 dark:text-pink-500`} />;
  if (lowerName.endsWith('.mp4') || lowerName.endsWith('.mov') || lowerName.endsWith('.avi') || lowerName.endsWith('.webm')) return <FaFileVideo size={size} className={`${className} text-indigo-600 dark:text-indigo-500`} />;
  if (lowerName.endsWith('.url') || lowerName.endsWith('.lnk')) return <FaLink size={size} className={`${className} text-sky-500 dark:text-sky-400`} />;


  return <FaQuestionCircle size={size} className={`${className} text-gray-400 dark:text-gray-500`} />; // Default unknown file
};
