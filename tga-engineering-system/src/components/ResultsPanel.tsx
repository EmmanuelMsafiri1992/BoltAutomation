import React from 'react';
import { Download, Eye, FileText, Share2 } from 'lucide-react';
import { ProjectData, ProcessingStatus, GeneratedFile } from '../types/project';

interface ResultsPanelProps {
  projectData: ProjectData;
  processingStatus: ProcessingStatus;
  // This prop is now required as it holds the generated files from App.tsx
  generatedFiles: GeneratedFile[]; 
}

// Helper function to format file sizes for better readability
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Helper function to get an icon based on file type
const getFileIcon = (fileType: string) => {
  switch (fileType.toLowerCase()) {
    case 'dwg':
      return <FileText size={20} className="text-orange-500" />;
    case 'pdf':
      return <FileText size={20} className="text-red-500" />;
    case 'xlsx':
      return <FileText size={20} className="text-green-600" />;
    default:
      return <FileText size={20} className="text-gray-400" />;
  }
};

export const ResultsPanel: React.FC<ResultsPanelProps> = ({ projectData, processingStatus, generatedFiles }) => {

  // Function to simulate a file download. In a real application, this would
  // fetch the file from a server and trigger the download.
  const handleDownload = (file: GeneratedFile) => {
    // For this mock app, we'll just log to the console and simulate a download link click.
    console.log(`Simulating download for: ${file.name}`);
    const link = document.createElement('a');
    link.href = file.downloadUrl; // Use the mock download URL
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Function to simulate opening a file for viewing
  const handleView = (file: GeneratedFile) => {
    // For this mock app, we'll log to the console and open a new tab.
    console.log(`Simulating view for: ${file.name}`);
    window.open(file.downloadUrl, '_blank');
  };

  // Group files by discipline
  const groupedFiles = generatedFiles.reduce((acc, file) => {
    if (!acc[file.discipline]) {
      acc[file.discipline] = [];
    }
    acc[file.discipline].push(file);
    return acc;
  }, {} as Record<string, GeneratedFile[]>);

  // Show a message if no files were generated
  if (processingStatus !== 'completed' || generatedFiles.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p>Aguardando a conclusão do processamento para exibir os resultados...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-inner">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          📦 Arquivos Gerados
        </h3>
        
        {Object.entries(groupedFiles).map(([discipline, files]) => (
          <div key={discipline} className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
              <h4 className="font-medium text-gray-900">{discipline}</h4>
            </div>
            <div className="divide-y divide-gray-200">
              {files.map((file) => (
                <div key={file.id} className="p-4 flex items-center justify-between hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-4 flex-grow">
                    <div className="flex-shrink-0">
                      {getFileIcon(file.type)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {file.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {file.type} • {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <button
                      onClick={() => handleView(file)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-lg"
                      title="Visualizar"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => handleDownload(file)}
                      className="p-2 text-gray-400 hover:text-green-600 transition-colors rounded-lg"
                      title="Baixar"
                    >
                      <Download size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Project Summary */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
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
  );
};
