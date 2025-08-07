import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { ProjectData, ProcessingStatus, ProcessingStage } from '../types/project';

interface ProcessingPanelProps {
  status: ProcessingStatus;
  projectData: ProjectData;
}

export const ProcessingPanel: React.FC<ProcessingPanelProps> = ({ status, projectData }) => {
  const [currentStage, setCurrentStage] = useState(0);
  const [stages, setStages] = useState<ProcessingStage[]>([
    { id: 'analyze', name: 'Análise da Planta Arquitetônica', status: 'pending', progress: 0 },
    { id: 'extract', name: 'Extração de Entidades e Dimensões', status: 'pending', progress: 0 },
    { id: 'standards', name: 'Carregamento de Normas Técnicas', status: 'pending', progress: 0 },
    { id: 'electrical', name: 'Geração do Projeto Elétrico', status: 'pending', progress: 0 },
    { id: 'hydraulic', name: 'Geração do Projeto Hidráulico', status: 'pending', progress: 0 },
    { id: 'hvac', name: 'Geração do Projeto HVAC', status: 'pending', progress: 0 },
    { id: 'compliance', name: 'Validação de Compliance', status: 'pending', progress: 0 },
    { id: 'documentation', name: 'Geração da Documentação', status: 'pending', progress: 0 }
  ]);

  useEffect(() => {
    if (status === 'processing') {
      const interval = setInterval(() => {
        setStages(prev => {
          const updated = [...prev];
          const activeIndex = updated.findIndex(s => s.status === 'active');
          
          if (activeIndex >= 0) {
            updated[activeIndex].progress += 10;
            if (updated[activeIndex].progress >= 100) {
              updated[activeIndex].status = 'completed';
              if (activeIndex + 1 < updated.length) {
                updated[activeIndex + 1].status = 'active';
                setCurrentStage(activeIndex + 1);
              }
            }
          } else if (updated[0].status === 'pending') {
            updated[0].status = 'active';
            setCurrentStage(0);
          }
          
          return updated;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [status]);

  const getStageIcon = (stage: ProcessingStage) => {
    switch (stage.status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'active':
        return <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const overallProgress = stages.reduce((sum, stage) => sum + stage.progress, 0) / stages.length;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            🔄 Processamento TGA em Andamento
          </h2>
          <p className="text-gray-600 mt-1">
            Gerando projetos automaticamente para {projectData.disciplines.length} disciplina(s)
          </p>
        </div>

        {/* Overall Progress */}
        <div className="px-6 py-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progresso Geral</span>
            <span className="text-sm text-gray-500">{Math.round(overallProgress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <motion.div
              className="bg-blue-600 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${overallProgress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Processing Stages */}
        <div className="px-6 py-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Etapas do Processamento</h3>
          
          <div className="space-y-4">
            {stages.map((stage, index) => (
              <motion.div
                key={stage.id}
                className={`flex items-center p-4 rounded-lg border-2 transition-all ${
                  stage.status === 'active'
                    ? 'border-blue-500 bg-blue-50'
                    : stage.status === 'completed'
                    ? 'border-green-500 bg-green-50'
                    : stage.status === 'error'
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="mr-4">
                  {getStageIcon(stage)}
                </div>
                
                <div className="flex-1">
                  <h4 className={`font-medium ${
                    stage.status === 'active' ? 'text-blue-900' :
                    stage.status === 'completed' ? 'text-green-900' :
                    stage.status === 'error' ? 'text-red-900' :
                    'text-gray-700'
                  }`}>
                    {stage.name}
                  </h4>
                  
                  {stage.status === 'active' && (
                    <div className="mt-2">
                      <div className="w-full bg-white rounded-full h-2">
                        <motion.div
                          className="bg-blue-600 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${stage.progress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      <p className="text-xs text-blue-700 mt-1">
                        {stage.progress}% concluído
                      </p>
                    </div>
                  )}
                  
                  {stage.status === 'completed' && (
                    <p className="text-xs text-green-700 mt-1">
                      ✓ Concluído com sucesso
                    </p>
                  )}
                </div>
                
                <div className="text-sm text-gray-500">
                  {index + 1}/{stages.length}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Project Info */}
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