export enum ShiftType {
  N8 = 'N8',   // Noturno 12h
  D6 = 'D6',   // Diurno 6h
  PR2 = 'PR2', // Manhã, Tarde e Noite
  M15 = 'M15', // Manhã
  T15 = 'T15', // Tarde
  DSR = 'DSR', // Descanso Semanal Remunerado
  FE = 'FE',   // Férias/Feriado
  L = 'L',     // Licença
  OFF = '',    // Empty/Off
}

export type EmployeeCategory = 
  | 'Técnicas de Enfermagem'
  | 'Enfermeiras'
  | 'Técnicas de Enfermagem - APH'
  | 'Enfermeiras - APH';

export interface Employee {
  id: string;
  name: string;
  category: EmployeeCategory;
  schedule: Record<number, ShiftType>; // Day (1-31) -> ShiftCode
}

export interface RosterStats {
  totalN8: number;
  totalD6: number;
  totalDSR: number;
  totalFE: number;
}

export interface GenerateScheduleRequest {
  employees: { id: string; name: string; category: string }[];
  monthDays: number;
}