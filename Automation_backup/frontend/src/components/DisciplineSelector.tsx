import React from 'react';
import { TGADiscipline } from '../types/project';

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
      const discipline = AVAILABLE_DISCIPLINES.find(d => d.code === code);
      if (discipline) {
        updated = [...selectedDisciplines, { ...discipline, enabled: true }];
      } else {
        return;
      }
    }
    
    onDisciplinesChange(updated);
  };

  const getDisciplineIcon = (code: string) => {
    const icons = {
      AR: '🏗️',
      ST: '🏛️',
      EL: '⚡',
      HY: '🚰',
      HV: '❄️',
      FP: '🔥',
      GA: '🤖',
      LI: '💡'
    };
    return icons[code as keyof typeof icons] || '📋';
  };

  const isSelected = (code: string) => selectedDisciplines.some(d => d.code === code);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          ⚙️ Disciplinas TGA
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Selecione as disciplinas que deseja gerar automaticamente
        </p>
      </div>

      <div className="space-y-2">
        {AVAILABLE_DISCIPLINES.map((discipline) => (
          <div
            key={discipline.code}
            className={`relative flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
              isSelected(discipline.code)
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
            onClick={() => toggleDiscipline(discipline.code)}
          >
            <div className="flex items-center flex-1">
              <span className="text-lg mr-3">
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
            Tempo estimado: {selectedDisciplines.length * 2-3} minutos
          </p>
        )}
      </div>
    </div>
  );
};