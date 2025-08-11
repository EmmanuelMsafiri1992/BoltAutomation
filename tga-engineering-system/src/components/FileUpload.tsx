import React, { useRef, useState } from 'react';
import { Upload, File, X, CheckCircle } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  currentFile: File | null;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, currentFile }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (isValidFile(file)) {
        onFileUpload(file);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (isValidFile(file)) {
        onFileUpload(file);
      }
    }
  };

  const removeFile = () => {
    onFileUpload(null as unknown as File); // Pass null to clear the file
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isValidFile = (file: File) => {
    const allowedTypes = ['application/dwg', 'application/pdf', 'application/dxf', 'image/vnd.dwg', 'image/vnd.dxf'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const isAcceptedType = allowedTypes.includes(file.type) || ['dwg', 'dxf', 'pdf'].includes(fileExtension || '');
    const isUnderSizeLimit = file.size <= 50 * 1024 * 1024; // 50MB

    if (!isAcceptedType) {
      console.error('Tipo de arquivo não suportado.');
      return false;
    }
    if (!isUnderSizeLimit) {
      console.error('O arquivo excede o tamanho máximo de 50MB.');
      return false;
    }
    return true;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        📁 Upload de Planta Arquitetônica
      </h3>
      
      {!currentFile ? (
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors
                      ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".dwg,.pdf,.dxf"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <p className="text-sm font-medium text-gray-900 mb-1">
            Clique para fazer upload ou arraste o arquivo
          </p>
          <p className="text-xs text-gray-500">
            DWG, PDF ou DXF até 50MB
          </p>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-900">
                  {currentFile.name}
                </p>
                <p className="text-xs text-green-700">
                  {(currentFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              onClick={removeFile}
              className="text-green-600 hover:text-green-800 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
