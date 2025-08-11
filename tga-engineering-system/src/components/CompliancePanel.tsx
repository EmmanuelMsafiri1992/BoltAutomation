import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';
import { ProjectData, ProcessingStatus, ComplianceResult } from '../types/project';

interface CompliancePanelProps {
  projectData: ProjectData;
  processingStatus: ProcessingStatus;
  complianceResults: ComplianceResult[]; // Now receives compliance results as a prop
}

export const CompliancePanel: React.FC<CompliancePanelProps> = ({ projectData, processingStatus, complianceResults }) => {

  // Helper function to render a violation/recommendation list
  const renderList = (items: string[], type: 'violation' | 'recommendation') => {
    const listStyle = type === 'violation' ? 'text-red-700' : 'text-yellow-700';
    const bulletStyle = type === 'violation' ? 'text-red-500' : 'text-yellow-500';
    
    return (
      <ul className="list-none space-y-1">
        {items.map((item, index) => (
          <li key={index} className="flex items-start">
            <span className={`mr-2 flex-shrink-0 ${bulletStyle}`}>•</span>
            <span className={`text-sm ${listStyle}`}>{item}</span>
          </li>
        ))}
      </ul>
    );
  };
  
  return (
    <div className="p-6">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Análise de Compliance
          </h3>
          <p className="text-sm text-gray-600">
            Relatório detalhado sobre a conformidade do projeto com as normas técnicas selecionadas.
          </p>
        </div>

        {/* Compliance Results List */}
        <div className="p-6 overflow-y-auto max-h-[500px]">
          <div className="space-y-6">
            {complianceResults.length === 0 && (
              <div className="text-center text-gray-500 py-10">
                <p>Nenhum resultado de compliance disponível. Inicie o processamento para gerar o relatório.</p>
              </div>
            )}
            {complianceResults.map((result, index) => (
              <div
                key={index}
                className={`bg-white border rounded-lg overflow-hidden transition-all duration-300
                  ${result.compliant ? 'border-green-300' : 'border-red-300'}`}
              >
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {result.compliant
                        ? <CheckCircle size={24} className="text-green-500" />
                        : <XCircle size={24} className="text-red-500" />}
                    </div>
                    <div>
                      <p className={`font-semibold ${result.compliant ? 'text-green-800' : 'text-red-800'}`}>
                        {result.standard}
                      </p>
                      <p className={`text-sm ${result.compliant ? 'text-green-600' : 'text-red-600'}`}>
                        {result.compliant ? 'Conforme' : 'Não Conforme'}
                        <span className="ml-2 font-medium">({result.score}%)</span>
                      </p>
                    </div>
                  </div>
                  <div className="p-2 bg-gray-100 rounded-lg text-sm text-gray-600">
                    Detalhes
                  </div>
                </div>

                {/* Violations and Recommendations */}
                {(!result.compliant || result.recommendations.length > 0) && (
                  <div className="p-4 bg-gray-50 border-t border-gray-200">
                    <div className="space-y-4">
                      {result.violations.length > 0 && (
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <AlertTriangle size={16} className="text-red-500" />
                            <p className="font-semibold text-red-800 text-sm">Violações Encontradas</p>
                          </div>
                          {renderList(result.violations, 'violation')}
                        </div>
                      )}
                      {result.recommendations.length > 0 && (
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <Info size={16} className="text-yellow-500" />
                            <p className="font-semibold text-yellow-800 text-sm">Recomendações</p>
                          </div>
                          {renderList(result.recommendations, 'recommendation')}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Regional Standards Info */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">
                Normas Aplicáveis: {projectData.region === 'germany' ? 'Alemanha (DIN/VDI)' : 
                                   projectData.region === 'europe' ? 'Europa (EN/ISO)' : 'Internacional'}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Análise baseada no tipo de projeto: {projectData.projectType} • Área: {projectData.totalArea.toLocaleString()} m²
              </p>
            </div>
            <button className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
              📄 Baixar Relatório Completo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
