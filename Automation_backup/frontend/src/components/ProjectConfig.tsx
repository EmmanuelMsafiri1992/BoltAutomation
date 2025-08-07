import React from 'react';
import { ProjectData } from '../types/project';

interface ProjectConfigProps {
  config: ProjectData;
  onConfigUpdate: (updates: Partial<ProjectData>) => void;
}

export const ProjectConfig: React.FC<ProjectConfigProps> = ({ config, onConfigUpdate }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          🏗️ Configuração do Projeto
        </h3>
      </div>

      {/* Project Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tipo de Edificação
        </label>
        <select
          value={config.projectType}
          onChange={(e) => onConfigUpdate({ projectType: e.target.value as any })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="residential">Residencial</option>
          <option value="office">Escritório Comercial</option>
          <option value="industrial">Industrial</option>
          <option value="retail">Varejo/Shopping</option>
          <option value="healthcare">Saúde/Hospital</option>
          <option value="education">Educacional</option>
        </select>
      </div>

      {/* Total Area */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Área Total (m²)
        </label>
        <input
          type="number"
          min="10"
          max="100000"
          step="10"
          value={config.totalArea}
          onChange={(e) => onConfigUpdate({ totalArea: parseInt(e.target.value) })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Number of Floors */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Número de Pavimentos
        </label>
        <input
          type="number"
          min="1"
          max="50"
          value={config.floors}
          onChange={(e) => onConfigUpdate({ floors: parseInt(e.target.value) })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Region/Standards */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Região/Normas Aplicáveis
        </label>
        <select
          value={config.region}
          onChange={(e) => onConfigUpdate({ region: e.target.value as any })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="germany">Alemanha (DIN/VDI)</option>
          <option value="europe">Europa (EN/ISO)</option>
          <option value="international">Internacional</option>
        </select>
      </div>

      {/* Project Summary */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Resumo do Projeto</h4>
        <div className="space-y-1 text-sm text-gray-600">
          <p>• Tipo: {getProjectTypeLabel(config.projectType)}</p>
          <p>• Área: {config.totalArea.toLocaleString()} m²</p>
          <p>• Pavimentos: {config.floors}</p>
          <p>• Normas: {getRegionLabel(config.region)}</p>
        </div>
      </div>
    </div>
  );
};

const getProjectTypeLabel = (type: string) => {
  const labels = {
    residential: 'Residencial',
    office: 'Escritório Comercial',
    industrial: 'Industrial',
    retail: 'Varejo/Shopping',
    healthcare: 'Saúde/Hospital',
    education: 'Educacional'
  };
  return labels[type as keyof typeof labels] || type;
};

const getRegionLabel = (region: string) => {
  const labels = {
    germany: 'Alemanha (DIN/VDI)',
    europe: 'Europa (EN/ISO)',
    international: 'Internacional'
  };
  return labels[region as keyof typeof labels] || region;
};