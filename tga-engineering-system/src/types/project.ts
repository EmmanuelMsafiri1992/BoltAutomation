export interface ProjectData {
  dwgFile: File | null;
  projectType: 'residential' | 'office' | 'industrial' | 'retail' | 'healthcare' | 'education';
  totalArea: number;
  floors: number;
  region: 'germany' | 'europe' | 'international';
  disciplines: TGADiscipline[];
  standards: TechnicalStandard[];
  processingStatus: ProcessingStatus;
}

export interface TGADiscipline {
  code: string;
  name: string;
  enabled: boolean;
  priority: number;
}

export interface TechnicalStandard {
  number: string;
  title: string;
  type: 'DIN' | 'VDI' | 'VOB' | 'EN' | 'ISO';
  category: string;
  compliance: boolean;
}

export type ProcessingStatus = 'idle' | 'processing' | 'completed' | 'error';

export interface ProcessingStage {
  id: string;
  name: string;
  status: 'pending' | 'active' | 'completed' | 'error';
  progress: number;
  duration?: number;
}

export interface GeneratedFile {
  id: string;
  name: string;
  type: string;
  discipline: string;
  size: number;
  downloadUrl: string;
}

export interface ComplianceResult {
  standard: string;
  compliant: boolean;
  score: number;
  violations: string[];
  recommendations: string[];
}
