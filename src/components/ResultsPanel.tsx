import React from 'react';
import { Download, Eye, FileText, Share2 } from 'lucide-react';
import { ProjectData, ProcessingStatus, GeneratedFile } from '../types/project';

interface ResultsPanelProps {
  projectData: ProjectData;
  processingStatus: ProcessingStatus;
}

export const ResultsPanel: React.FC<ResultsPanelProps> = ({ projectData, processingStatus }) => {
  // Mock generated files based on selected disciplines
  const generateMockFiles = (): GeneratedFile[] => {
    const files: GeneratedFile[] = [];
    
    projectData.disciplines.forEach(discipline => {
      // DWG files
      files.push({
        id: `${discipline.code}-dwg`,
        name: `${discipline.code}_${discipline.name.replace(/\s+/g, '_')}.dwg`,
        type: 'DWG',
        discipline: discipline.name,
        size: Math.floor(Math.random() * 5000000) + 500000,
        downloadUrl: '#'
      });
      
      // PDF files
      files.push({
        id: `${discipline.code}-pdf`,
        name: `${discipline.code}_${discipline.name.replace(/\s+/g, '_')}_Plantas.pdf`,
        type: 'PDF',
        discipline: discipline.name,
        size: Math.floor(Math.random() * 2000000) + 200000,
        downloadUrl: '#'
      });
      
      // Excel calculations
      if (['EL', 'HY', 'HV'].includes(discipline.code)) {
        files.push({
          id: `${discipline.code}-xlsx`,
          name: `${discipline.code}_Memoriais_Calculos.xlsx`,
          type: 'XLSX',
          discipline: discipline.name,
          size: Math.floor(Math.random() * 500000) + 50000,
          downloadUrl: '#'
        });
      }
    });
    
    // Technical reports
    files.push({
      id: 'compliance-report',
      name: 'Relatorio_Compliance_Normas_Tecnicas.pdf',
      type: 'PDF',
      discipline: 'Compliance',
      size: 850000,
      downloadUrl: '#'
    });
    
    files.push({
      id: 'technical-specs',
      name: 'Especificacoes_Tecnicas.pdf',
      type: 'PDF',
      discipline: 'Documentação',
      size: 1200000,
      downloadUrl: '#'
    });
    
    return files;
  };

  const generatedFiles = processingStatus === 'completed' ? generateMockFiles() : [];

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'DWG':
        return '📐';
      case 'PDF':
        return '📄';
      case 'XLSX':
        return '📊';
      default:
        return '📁';
    }
  };

  const groupFilesByDiscipline = (files: GeneratedFile[]) => {
    return files.reduce((groups, file) => {
      const discipline = file.discipline;
      if (!groups[discipline]) {
        groups[discipline] = [];
      }
      groups[discipline].push(file);
      return groups;
    }, {} as Record<string, GeneratedFile[]>);
  };

  if (processingStatus !== 'completed') {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4">⏳</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Processamento em Andamento
          </h2>
          <p className="text-gray-600">
            Os resultados aparecerão aqui após a conclusão do processamento.
          </p>
        </div>
      </div>
    );
  }

  const groupedFiles = groupFilesByDiscipline(generatedFiles);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                📊 Resultados do Projeto TGA
              </h2>
              <p className="text-gray-600 mt-1">
                {generatedFiles.length} arquivos gerados para {Object.keys(groupedFiles).length} disciplina(s)
              </p>
            </div>
            
            <div className="flex space-x-2">
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download size={16} className="mr-2" />
                Download Tudo
              </button>
              <button className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <Share2 size={16} className="mr-2" />
                Compartilhar
              </button>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="px-6 py-4 bg-green-50 border-b border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {generatedFiles.filter(f => f.type === 'DWG').length}
              </div>
              <div className="text-sm text-gray-600">Plantas DWG</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {generatedFiles.filter(f => f.type === 'PDF').length}
              </div>
              <div className="text-sm text-gray-600">Documentos PDF</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {generatedFiles.filter(f => f.type === 'XLSX').length}
              </div>
              <div className="text-sm text-gray-600">Planilhas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {formatFileSize(generatedFiles.reduce((sum, f) => sum + f.size, 0))}
              </div>
              <div className="text-sm text-gray-600">Tamanho Total</div>
            </div>
          </div>
        </div>

        {/* Files by Discipline */}
        <div className="px-6 py-6">
          <div className="space-y-6">
            {Object.entries(groupedFiles).map(([discipline, files]) => (
              <div key={discipline} className="border border-gray-200 rounded-lg">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">
                    {discipline} ({files.length} arquivo{files.length !== 1 ? 's' : ''})
                  </h3>
                </div>
                
                <div className="p-4">
                  <div className="grid gap-3">
                    {files.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">
                            {getFileIcon(file.type)}
                          </span>
                          <div>
                            <p className="font-medium text-gray-900">
                              {file.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {file.type} • {formatFileSize(file.size)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                            <Eye size={16} />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                            <Download size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Project Summary */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            <p>
              <strong>✅ Projeto concluído com sucesso</strong> • 
              Todos os arquivos foram gerados seguindo as normas técnicas aplicáveis para {projectData.region}
            </p>
            <p className="mt-1">
              Tempo total de processamento: ~{Math.ceil(projectData.disciplines.length * 2.5)} minutos
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};