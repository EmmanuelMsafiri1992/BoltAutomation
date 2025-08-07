import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { ProjectConfig } from './components/ProjectConfig';
import { DisciplineSelector } from './components/DisciplineSelector';
import { ProcessingPanel } from './components/ProcessingPanel';
import { ResultsPanel } from './components/ResultsPanel';
import { CompliancePanel } from './components/CompliancePanel';
import { Header } from './components/Header';
import { StatusBar } from './components/StatusBar';
import { ProjectData, ProcessingStatus } from './types/project';

function App() {
  const [projectData, setProjectData] = useState<ProjectData>({
    dwgFile: null,
    projectType: 'office',
    totalArea: 1000,
    floors: 3,
    region: 'germany',
    disciplines: [],
    standards: [],
    processingStatus: 'idle'
  });

  const [activeTab, setActiveTab] = useState<'config' | 'processing' | 'results' | 'compliance'>('config');
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus>('idle');

  const handleProjectUpdate = (updates: Partial<ProjectData>) => {
    setProjectData(prev => ({ ...prev, ...updates }));
  };

  const handleStartProcessing = async () => {
    setProcessingStatus('processing');
    setActiveTab('processing');
    
    // Simulate processing workflow
    const stages = [
      'Analisando planta arquitetônica...',
      'Extraindo entidades e dimensões...',
      'Carregando normas técnicas relevantes...',
      'Gerando projeto elétrico...',
      'Gerando projeto hidráulico...',
      'Gerando projeto HVAC...',
      'Validando compliance...',
      'Gerando documentação final...'
    ];

    for (let i = 0; i < stages.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Update processing status with current stage
    }

    setProcessingStatus('completed');
    setActiveTab('results');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <div className="flex-1 flex">
        {/* Left Sidebar - Configuration */}
        <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-6 space-y-6">
            <FileUpload 
              onFileUpload={(file) => handleProjectUpdate({ dwgFile: file })}
              currentFile={projectData.dwgFile}
            />
            
            <ProjectConfig 
              config={projectData}
              onConfigUpdate={handleProjectUpdate}
            />
            
            <DisciplineSelector 
              selectedDisciplines={projectData.disciplines}
              onDisciplinesChange={(disciplines) => handleProjectUpdate({ disciplines })}
            />
            
            <button 
              onClick={handleStartProcessing}
              disabled={!projectData.dwgFile || projectData.disciplines.length === 0}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              🚀 Iniciar Geração TGA
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Tab Navigation */}
          <div className="bg-white border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'config', label: 'Configuração', icon: '⚙️' },
                { id: 'processing', label: 'Processamento', icon: '🔄' },
                { id: 'results', label: 'Resultados', icon: '📊' },
                { id: 'compliance', label: 'Compliance', icon: '✅' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="flex-1 p-6">
            {activeTab === 'config' && (
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Configuração do Projeto TGA
                </h2>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <p className="text-gray-600">
                    Configure os parâmetros do seu projeto no painel lateral esquerdo. 
                    Upload sua planta DWG/PDF, selecione o tipo de projeto e as disciplinas 
                    que deseja gerar automaticamente.
                  </p>
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-blue-900">📐 Análise Inteligente</h3>
                      <p className="text-sm text-blue-700 mt-1">
                        IA analisa plantas e extrai automaticamente dimensões e layout
                      </p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-green-900">⚡ Geração Automática</h3>
                      <p className="text-sm text-green-700 mt-1">
                        Projetos elétricos, hidráulicos e HVAC gerados automaticamente
                      </p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-purple-900">📋 Compliance</h3>
                      <p className="text-sm text-purple-700 mt-1">
                        Validação automática com normas técnicas alemãs e internacionais
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'processing' && (
              <ProcessingPanel 
                status={processingStatus}
                projectData={projectData}
              />
            )}

            {activeTab === 'results' && (
              <ResultsPanel 
                projectData={projectData}
                processingStatus={processingStatus}
              />
            )}

            {activeTab === 'compliance' && (
              <CompliancePanel 
                projectData={projectData}
                processingStatus={processingStatus}
              />
            )}
          </div>
        </div>
      </div>

      <StatusBar projectData={projectData} processingStatus={processingStatus} />
    </div>
  );
}

export default App;