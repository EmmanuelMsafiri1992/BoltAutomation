import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { ProjectData, ProcessingStatus, ProcessingStage } from '../types/project';

interface ProcessingPanelProps {
  status: ProcessingStatus;
  projectData: ProjectData;
  stages: ProcessingStage[]; // Now receives stages as a prop from App.tsx
}

export const ProcessingPanel: React.FC<ProcessingPanelProps> = ({ status, projectData, stages }) => {
  // This component now receives all its dynamic data via props.
  // The state management for the stages has been moved up to App.tsx.

  // Helper function to get the correct icon based on the stage status
  const getStatusIcon = (stage: ProcessingStage) => {
    switch (stage.status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'active':
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header and Progress Bar */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Status do Processamento
          </h3>
          <p className="text-sm text-gray-600">
            Acompanhe o andamento da geração do seu projeto TGA.
          </p>
        </div>

        {/* Stages List */}
        <div className="divide-y divide-gray-200">
          {stages.map((stage, index) => (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center justify-between p-6 ${
                stage.status === 'active' ? 'bg-blue-50' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">
                  {getStatusIcon(stage)}
                </div>
                <div>
                  <p className={`font-medium ${
                    stage.status === 'completed' ? 'text-green-800' :
                    stage.status === 'active' ? 'text-blue-800' : 'text-gray-900'
                  }`}>
                    {stage.name}
                  </p>
                  <div className="w-48 bg-gray-200 rounded-full h-2.5 mt-2">
                    <div
                      className={`h-2.5 rounded-full transition-all duration-500 ${
                        stage.status === 'completed' ? 'bg-green-500' :
                        stage.status === 'active' ? 'bg-blue-500' : 'bg-transparent'
                      }`}
                      style={{ width: `${stage.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="text-sm text-gray-500">
                {stage.status === 'completed' && (
                  <p className="text-green-600">✓ Concluído</p>
                )}
                {stage.status === 'active' && (
                  <p className="text-blue-600">Processando...</p>
                )}
                {stage.status === 'pending' && (
                  <p>Aguardando</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Project Info Summary */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Arquivo:</span>
              <p className="font-medium text-gray-900 truncate">
                {projectData.dwgFile?.name || 'N/A'}
              </p>
            </div>
            <div>
              <span className="text-gray-500">Tipo:</span>
              <p className="font-medium text-gray-900">
                {projectData.projectType}
              </p>
            </div>
            <div>
              <span className="text-gray-500">Área:</span>
              <p className="font-medium text-gray-900">
                {projectData.totalArea.toLocaleString()} m²
              </p>
            </div>
            <div>
              <span className="text-gray-500">Disciplinas:</span>
              <p className="font-medium text-gray-900">
                {projectData.disciplines.length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
