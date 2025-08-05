import React from 'react';
import { Wifi, Database, CheckCircle, AlertCircle } from 'lucide-react';
import { ProjectData, ProcessingStatus } from '../types/project';

interface StatusBarProps {
  projectData: ProjectData;
  processingStatus: ProcessingStatus;
}

export const StatusBar: React.FC<StatusBarProps> = ({ projectData, processingStatus }) => {
  const getStatusColor = (status: ProcessingStatus) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'processing':
        return 'text-blue-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: ProcessingStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'processing':
        return <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />;
      case 'error':
        return <AlertCircle size={16} className="text-red-600" />;
      default:
        return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
    }
  };

  const getStatusText = (status: ProcessingStatus) => {
    switch (status) {
      case 'completed':
        return 'Projeto Concluído';
      case 'processing':
        return 'Processando...';
      case 'error':
        return 'Erro no Processamento';
      default:
        return 'Aguardando Configuração';
    }
  };

  return (
    <div className="bg-gray-800 text-white px-6 py-3">
      <div className="flex items-center justify-between text-sm">
        {/* Left side - System status */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Wifi size={16} className="text-green-400" />
            <span>Sistema Online</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Database size={16} className="text-green-400" />
            <span>Normas Atualizadas</span>
          </div>
          
          <div className="flex items-center space-x-2">
            {getStatusIcon(processingStatus)}
            <span className={getStatusColor(processingStatus)}>
              {getStatusText(processingStatus)}
            </span>
          </div>
        </div>

        {/* Right side - Project info */}
        <div className="flex items-center space-x-6 text-gray-300">
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

          <span className="text-xs text-gray-400">
            TGA System v1.0
          </span>
        </div>
      </div>
    </div>
  );
};