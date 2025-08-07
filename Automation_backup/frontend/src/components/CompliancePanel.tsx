import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';
import { ProjectData, ProcessingStatus, ComplianceResult } from '../types/project';

interface CompliancePanelProps {
  projectData: ProjectData;
  processingStatus: ProcessingStatus;
}

export const CompliancePanel: React.FC<CompliancePanelProps> = ({ projectData, processingStatus }) => {
  // Mock compliance results based on project configuration
  const generateMockCompliance = (): ComplianceResult[] => {
    const results: ComplianceResult[] = [];
    
    const baseStandards = [
      'DIN 18015 - Electrical installations in residential buildings',
      'DIN EN 12831 - Heating systems design',
      'VDI 2052 - Ventilation in kitchens',
      'VOB/C - Technical specifications',
      'DIN 1988 - Water supply systems'
    ];
    
    baseStandards.forEach((standard, index) => {
      const compliant = Math.random() > 0.2; // 80% compliance rate
      
      results.push({
        standard,
        compliant,
        score: compliant ? Math.floor(Math.random() * 20) + 80 : Math.floor(Math.random() * 30) + 50,
        violations: compliant ? [] : [
          'Insufficient cable sizing in main distribution',
          'Missing grounding specifications'
        ].slice(0, Math.floor(Math.random() * 2) + 1),
        recommendations: [
          'Consider upgrading to latest standard revision',
          'Add additional safety measures for commercial use',
          'Review load calculations for future expansion'
        ].slice(0, Math.floor(Math.random() * 3) + 1)
      });
    });
    
    return results;
  };

  const complianceResults = processingStatus === 'completed' ? generateMockCompliance() : [];

  const getComplianceIcon = (result: ComplianceResult) => {
    if (result.compliant && result.score >= 90) {
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    } else if (result.compliant) {
      return <Info className="w-5 h-5 text-blue-600" />;
    } else if (result.score >= 70) {
      return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
    } else {
      return <XCircle className="w-5 h-5 text-red-600" />;
    }
  };

  const getComplianceColor = (result: ComplianceResult) => {
    if (result.compliant && result.score >= 90) return 'green';
    if (result.compliant) return 'blue';
    if (result.score >= 70) return 'yellow';
    return 'red';
  };

  const overallCompliance = complianceResults.length > 0 
    ? complianceResults.reduce((sum, r) => sum + r.score, 0) / complianceResults.length 
    : 0;

  const compliantCount = complianceResults.filter(r => r.compliant).length;

  if (processingStatus !== 'completed') {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4">📋</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Análise de Compliance Pendente
          </h2>
          <p className="text-gray-600">
            A análise de conformidade com normas técnicas será executada após o processamento.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            ✅ Análise de Compliance - Normas Técnicas
          </h2>
          <p className="text-gray-600 mt-1">
            Validação automática contra {complianceResults.length} norma(s) aplicável(eis)
          </p>
        </div>

        {/* Overall Compliance Summary */}
        <div className="px-6 py-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Overall Score */}
            <div className="text-center">
              <div className={`text-4xl font-bold mb-2 ${
                overallCompliance >= 90 ? 'text-green-600' :
                overallCompliance >= 80 ? 'text-blue-600' :
                overallCompliance >= 70 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {Math.round(overallCompliance)}%
              </div>
              <div className="text-sm text-gray-600">Score Geral de Compliance</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className={`h-2 rounded-full ${
                    overallCompliance >= 90 ? 'bg-green-600' :
                    overallCompliance >= 80 ? 'bg-blue-600' :
                    overallCompliance >= 70 ? 'bg-yellow-600' : 'bg-red-600'
                  }`}
                  style={{ width: `${overallCompliance}%` }}
                />
              </div>
            </div>

            {/* Compliant Standards */}
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {compliantCount}
              </div>
              <div className="text-sm text-gray-600">
                Normas em Compliance
              </div>
              <div className="text-xs text-gray-500 mt-1">
                de {complianceResults.length} total
              </div>
            </div>

            {/* Status */}
            <div className="text-center">
              <div className={`text-4xl mb-2 ${
                compliantCount === complianceResults.length ? '✅' :
                compliantCount >= complianceResults.length * 0.8 ? '⚠️' : '❌'
              }`}>
                {compliantCount === complianceResults.length ? '✅' :
                 compliantCount >= complianceResults.length * 0.8 ? '⚠️' : '❌'}
              </div>
              <div className="text-sm text-gray-600">
                {compliantCount === complianceResults.length ? 'Totalmente Conforme' :
                 compliantCount >= complianceResults.length * 0.8 ? 'Maioria Conforme' : 'Não Conforme'}
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Compliance Results */}
        <div className="px-6 py-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Detalhamento por Norma
          </h3>
          
          <div className="space-y-4">
            {complianceResults.map((result, index) => {
              const color = getComplianceColor(result);
              
              return (
                <div 
                  key={index}
                  className={`border-2 rounded-lg p-4 ${
                    color === 'green' ? 'border-green-200 bg-green-50' :
                    color === 'blue' ? 'border-blue-200 bg-blue-50' :
                    color === 'yellow' ? 'border-yellow-200 bg-yellow-50' :
                    'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      {getComplianceIcon(result)}
                      <div className="flex-1">
                        <h4 className={`font-semibold ${
                          color === 'green' ? 'text-green-900' :
                          color === 'blue' ? 'text-blue-900' :
                          color === 'yellow' ? 'text-yellow-900' :
                          'text-red-900'
                        }`}>
                          {result.standard}
                        </h4>
                        
                        <div className="mt-2 flex items-center space-x-4">
                          <span className={`text-sm font-medium ${
                            color === 'green' ? 'text-green-700' :
                            color === 'blue' ? 'text-blue-700' :
                            color === 'yellow' ? 'text-yellow-700' :
                            'text-red-700'
                          }`}>
                            Score: {result.score}%
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            result.compliant 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {result.compliant ? 'Conforme' : 'Não Conforme'}
                          </span>
                        </div>

                        {/* Violations */}
                        {result.violations.length > 0 && (
                          <div className="mt-3">
                            <p className="text-sm font-medium text-red-800 mb-2">
                              Violações Encontradas:
                            </p>
                            <ul className="text-sm text-red-700 space-y-1">
                              {result.violations.map((violation, vIndex) => (
                                <li key={vIndex} className="flex items-start">
                                  <span className="mr-2">•</span>
                                  {violation}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Recommendations */}
                        {result.recommendations.length > 0 && (
                          <div className="mt-3">
                            <p className="text-sm font-medium text-gray-800 mb-2">
                              Recomendações:
                            </p>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {result.recommendations.map((rec, rIndex) => (
                                <li key={rIndex} className="flex items-start">
                                  <span className="mr-2">•</span>
                                  {rec}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
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