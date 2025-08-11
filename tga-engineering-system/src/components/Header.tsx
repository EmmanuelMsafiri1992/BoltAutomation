import React from 'react';
import { Settings, HelpCircle, User } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-slate-800 text-white shadow-lg">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">TGA</span>
              </div>
              <h1 className="text-xl font-bold">Sistema TGA Alemão</h1>
            </div>
            <div className="hidden md:flex items-center space-x-1 text-sm text-gray-300">
              <span>Technische Gebäudeausrüstung</span>
              <span>•</span>
              <span>Automated Engineering System</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Sistema Online</span>
              </div>
              <div className="text-gray-400">v1.0.0</div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                <Settings size={18} />
              </button>
              <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                <HelpCircle size={18} />
              </button>
              <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                <User size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
