import React from 'react';
import { TGADiscipline } from '../types/project';
import { Lightbulb, Plug, Droplet, Wind, Shield, Building, Box, Zap } from 'lucide-react';

interface DisciplineSelectorProps {
  selectedDisciplines: TGADiscipline[];
  onDisciplinesChange: (disciplines: TGADiscipline[]) => void;
}

const AVAILABLE_DISCIPLINES: TGADiscipline[] = [
  { code: 'AR', name: 'Arquitetura Base', enabled: true, priority: 1 },
  { code: 'ST', name: 'Estrutural', enabled: false, priority: 2 },
  { code: 'EL', name: 'Elétrico', enabled: false, priority: 3 },
  { code: 'HY', name: 'Hidráulico', enabled: false, priority: 4 },
  { code: 'HV', name: 'HVAC (Climatização)', enabled: false, priority: 5 },
  { code: 'FP', name: 'Prevenção Incêndio', enabled: false, priority: 6 },
  { code: 'GA', name: 'Automação Predial', enabled: false, priority: 7 },
  { code: 'LI', name: 'Iluminação', enabled: false, priority: 8 }
];

export const DisciplineSelector: React.FC<DisciplineSelectorProps> = ({ 
  selectedDisciplines, 
  onDisciplinesChange 
}) => {
  const toggleDiscipline = (code: string) => {
    const current = selectedDisciplines.find(d => d.code === code);
    let updated: TGADiscipline[];
    
    if (current) {
      // Remove discipline
      updated = selectedDisciplines.filter(d => d.code !== code);
    } else {
      // Add discipline
      const disciplineToAdd = AVAILABLE_DISCIPLINES.find(d => d.code === code);
      if (disciplineToAdd) {
        updated = [...selectedDisciplines, disciplineToAdd];
      } else {
        updated = selectedDisciplines;
      }
    }

    onDisciplinesChange(updated);
  };

  const isSelected = (code: string) => selectedDisciplines.some(d => d.code === code);

  const getDisciplineIcon = (code: string) => {
    switch (code) {
      case 'AR': return <Building size={20} />;
      case 'ST': return <Box size={20} />;
      case 'EL': return <Zap size={20} />;
      case 'HY': return <Droplet size={20} />;
      case 'HV': return <Wind size={20} />;
      case 'FP': return <Shield size={20} />;
      case 'GA': return <Plug size={20} />;
      case 'LI': return <Lightbulb size={20} />;
      default: return null;
    }
  };

  const estimatedTime = selectedDisciplines.length > 0 ? (selectedDisciplines.length * 2.5).toFixed(1) : '0';

  return (
    <div className="space-y-6 bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          ⚙️ Selecionar Disciplinas TGA
        </h3>
      </div>
      
      <div className="grid grid-cols-1 gap-2">
        {AVAILABLE_DISCIPLINES.map((discipline) => (
          <div
            key={discipline.code}
            onClick={() => toggleDiscipline(discipline.code)}
            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors border
                        ${isSelected(discipline.code)
                          ? 'bg-blue-50 border-blue-200'
                          : 'bg-white border-gray-200 hover:bg-gray-50'
                        }`}
          >
            <div className="flex items-center flex-1">
              <span className={`text-lg mr-3 ${isSelected(discipline.code) ? 'text-blue-600' : 'text-gray-500'}`}>
                {getDisciplineIcon(discipline.code)}
              </span>
              <div>
                <p className={`font-medium ${
                  isSelected(discipline.code) ? 'text-blue-900' : 'text-gray-900'
                }`}>
                  {discipline.code} - {discipline.name}
                </p>
                <p className={`text-xs ${
                  isSelected(discipline.code) ? 'text-blue-700' : 'text-gray-500'
                }`}>
                  Prioridade: {discipline.priority}
                </p>
              </div>
            </div>
            
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              isSelected(discipline.code)
                ? 'border-blue-500 bg-blue-500'
                : 'border-gray-300'
            }`}>
              {isSelected(discipline.code) && (
                <div className="w-2 h-2 bg-white rounded-full"></div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 p-3 rounded-lg">
        <p className="text-sm text-gray-600">
          <strong>{selectedDisciplines.length}</strong> disciplina(s) selecionada(s)
        </p>
        {selectedDisciplines.length > 0 && (
          <p className="text-xs text-gray-500 mt-1">
            Tempo estimado: ~{estimatedTime} minutos
          </p>
        )}
      </div>
    </div>
  );
};
