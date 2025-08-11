import React from 'react';
import { Wifi, Database, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { ProjectData, ProcessingStatus } from '../types/project';

interface StatusBarProps {
  projectData: ProjectData;
  processingStatus: ProcessingStatus;
  currentProgress: number; // New prop for overall progress
}

export const StatusBar: React.FC<StatusBarProps> = ({ projectData, processingStatus, currentProgress }) => {
  // Helper function to get the status text based on the processing status
  const getStatusText = (status: ProcessingStatus) => {
    switch (status) {
      case 'completed':
        return 'Projeto Concluído';
      case 'processing':
        return 'Processando...';
      case 'error':
        return 'Ocorreu um Erro';
      default:
        return 'Aguardando Início';
    }
  };

  // Helper function to get the status icon based on the processing status
  const getStatusIcon = (status: ProcessingStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="text-green-400" />;
      case 'processing':
        return <Loader2 size={16} className="text-blue-400 animate-spin" />;
      case 'error':
        return <AlertCircle size={16} className="text-red-400" />;
      default:
        return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
    }
  };

  // Helper function to get the progress bar color
  const getProgressBarColor = (status: ProcessingStatus) => {
    switch (status) {
      case 'completed':
        return 'bg-green-400';
      case 'processing':
        return 'bg-blue-400';
      case 'error':
        return 'bg-red-400';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className="bg-slate-800 text-white shadow-inner">
      <div className="px-6 py-2 flex items-center justify-between">
        {/* Left side - System status */}
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <Wifi size={16} className="text-green-400" />
            <span>Sistema Online</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Database size={16} className="text-green-400" />
            <span>Normas Atualizadas</span>
          </div>
          
          {/* Processing Status */}
          <div className="flex items-center space-x-2">
            {getStatusIcon(processingStatus)}
            <span className={`font-medium ${
                processingStatus === 'completed' ? 'text-green-400' :
                processingStatus === 'processing' ? 'text-blue-400' :
                processingStatus === 'error' ? 'text-red-400' : 'text-gray-400'
              }`}>
              {getStatusText(processingStatus)}
            </span>
          </div>
        </div>

        {/* Right side - Project info and progress bar */}
        <div className="flex items-center space-x-6 text-sm text-gray-300">
          {projectData.dwgFile && (
            <span>
              📁 {projectData.dwgFile.name.length > 20 
                  ? projectData.dwgFile.name.substring(0, 20) + '...' 
                  : projectData.dwgFile.name}
            </span>
          )}
          
          <span>
            🏗️ {projectData.projectType}
          </span>
          
          <span>
            📐 {projectData.totalArea.toLocaleString()} m²
          </span>
          
          {projectData.disciplines.length > 0 && (
            <span>
              ⚙️ {projectData.disciplines.length} disciplina(s)
            </span>
          )}
          
          {/* Progress Bar */}
          {processingStatus === 'processing' && (
            <div className="w-24 h-2 bg-gray-600 rounded-full overflow-hidden">
              <div
                className={`h-full ${getProgressBarColor(processingStatus)} transition-all duration-500`}
                style={{ width: `${currentProgress}%` }}
              ></div>
            </div>
          )}

          <span className="text-xs text-gray-400">
            TGA System v1.0
          </span>
        </div>
      </div>
    </div>
  );
};
