
import { ShiftType, EmployeeCategory } from './types';

export const DAYS_IN_MONTH = 31; // Fallback default
export const INITIAL_ROWS_PER_CATEGORY = 10; // Quantidade de linhas vazias iniciais

export const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

// Definições internas dos períodos
export const SHIFT_DEFINITIONS: Record<string, string> = {
  'D6': 'Manhã, Tarde',
  'N8': 'Noite',
  'PR2': 'Manhã, Tarde e Noite',
  'M15': 'Manhã',
  'T15': 'Tarde',
};

export const SHIFT_COLORS: Record<string, string> = {
  [ShiftType.N8]: 'bg-blue-100 text-blue-800 border-blue-200',
  [ShiftType.D6]: 'bg-sky-100 text-sky-800 border-sky-200',
  [ShiftType.PR2]: 'bg-purple-100 text-purple-800 border-purple-200',
  [ShiftType.M15]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  [ShiftType.T15]: 'bg-orange-100 text-orange-800 border-orange-200',
  [ShiftType.DSR]: 'bg-orange-100 text-orange-800 border-orange-200',
  [ShiftType.FE]: 'bg-green-200 text-green-900 border-green-300',
  [ShiftType.L]: 'bg-gray-200 text-gray-700 border-gray-300',
  [ShiftType.OFF]: 'bg-white border-gray-100',
};

export const SHIFT_LABELS: Record<ShiftType, string> = {
  [ShiftType.N8]: 'Plantão Noturno (N8)',
  [ShiftType.D6]: 'Diurno (D6)',
  [ShiftType.PR2]: 'Plantão 24h (PR2)',
  [ShiftType.M15]: 'Manhã (M15)',
  [ShiftType.T15]: 'Tarde (T15)',
  [ShiftType.DSR]: 'Descanso (DSR)',
  [ShiftType.FE]: 'Férias (FE)',
  [ShiftType.L]: 'Licença (L)',
  [ShiftType.OFF]: 'Vazio',
};

export const CATEGORIES: EmployeeCategory[] = [
  'Técnicas de Enfermagem',
  'Enfermeiras',
  'Técnicas de Enfermagem - APH',
  'Enfermeiras - APH'
];

export const CATEGORY_THEMES: Record<EmployeeCategory, { headerBg: string, iconBg: string, iconColor: string }> = {
  'Técnicas de Enfermagem': { headerBg: 'bg-emerald-600', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-700' },
  'Enfermeiras': { headerBg: 'bg-blue-600', iconBg: 'bg-blue-100', iconColor: 'text-blue-700' },
  'Técnicas de Enfermagem - APH': { headerBg: 'bg-amber-600', iconBg: 'bg-amber-100', iconColor: 'text-amber-700' },
  'Enfermeiras - APH': { headerBg: 'bg-rose-600', iconBg: 'bg-rose-100', iconColor: 'text-rose-700' },
};

export const INITIAL_EMPLOYEES: string[] = [];

// --- DEFAULT CONFIG VALUES ---
export const DEFAULT_LAYOUT_CONFIG = {
  // Textos
  titleReport: 'DISTRIBUIÇÃO DIÁRIA DAS ATIVIDADES DE ENFERMAGEM',
  col6Name: 'COLUNA 6',
  col7Name: 'COLUNA 7',
  
  // Dimensões (px) - Bases iniciais para proporção
  numberWidth: 25,
  nameWidth: 220,
  occurrencesWidth: 120,
  activitiesWidth: 120,
  redistWidth: 60,
  timeWidth: 40,
  signatureWidth: 90,
  
  // Fontes (px)
  fontSizeTitle: 16,
  fontSizeTable: 11,
  
  // Cores (Hex)
  colorMorningHeader: '#ffeebb',
  colorMorningRow: '#fffbe6',
  colorAfternoonHeader: '#d4edda',
  colorAfternoonRow: '#e8f5e9',
  colorNightHeader: '#cce5ff',
  colorNightRow: '#e6f2ff'
};

// --- MODELOS DE MALA DIRETA ---

// Modelo UTI NEO - Atualizado: Adicionado colunas EXPURGO e KAMISHIBAI
const TEMPLATE_UTI_NEO = `
<!-- PÁGINA 1: MANHÃ E TARDE -->
<div style="font-family: Arial, sans-serif; max-width: 100%; padding: 30px 60px; color: #000; box-sizing: border-box;">
  <div style="text-align: center; margin-bottom: 10px;">
    <h2 style="margin: 0; font-size: {{TAM_FONTE_TITULO}}px; color: #000;">{{TITULO_DOC}}</h2>
  </div>

  <table style="width: 100%; border-collapse: collapse; border: none; font-size: 12px; font-weight: bold; margin-bottom: 5px; color: #000;">
    <tr>
      <td style="text-align: left; border: none; padding: 0; width: 20%;">SETOR: UTI NEO</td>
      <td style="text-align: center; border: none; padding: 0; width: 60%;">DATA: {{DATA_EXTENSO}}</td>
      <td style="text-align: right; border: none; padding: 0; width: 20%; white-space: nowrap;">DIA: {{DIA_SEMANA}}</td>
    </tr>
  </table>

  <!-- TABELA MANHÃ -->
  <table style="width: 100%; border-collapse: collapse; border: 1px solid black; font-size: {{TAM_FONTE_TABELA}}px; margin-bottom: 5px; color: #000;">
    <thead>
      <tr style="background-color: {{COR_CAB_MANHA}};">
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: {{W_NUMERO}}px;">Nº</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; text-align: left; width: {{W_NOME}}px;">MANHÃ - ENFERMEIROS</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: {{W_OCORRENCIA}}px;">TROCAS, BH E REMANEJAMENTOS</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: {{W_ATIVIDADE}}px;">DISTRIBUIÇÃO DAS ATIVIDADES</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: {{W_REDIST}}px;">REDISTRIBUIÇÃO DAS ATIVIDADES</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: 40px;">EXPURGO</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: 40px;">KAMISHIBAI</th>
        <th colspan="3" style="border: 1px solid black; padding: 2px; text-align: center;">HORÁRIO</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: {{W_ASSINATURA}}px;">ASSINATURA FUNCIONÁRIO</th>
      </tr>
      <tr style="background-color: {{COR_CAB_MANHA}};">
         <th style="border: 1px solid black; padding: 2px; width: {{W_HORARIO}}px;">ENTRADA</th>
         <th style="border: 1px solid black; padding: 2px; width: {{W_HORARIO}}px;">INTERVALO</th>
         <th style="border: 1px solid black; padding: 2px; width: {{W_HORARIO}}px;">SAÍDA</th>
      </tr>
    </thead>
    <tbody>
      {{TABELA_ENFERMEIROS_MANHA}}
      <tr style="background-color: {{COR_CAB_MANHA}};">
        <td style="border: 1px solid black; padding: 2px;">&nbsp;</td>
        <td style="border: 1px solid black; padding: 2px; font-weight: bold;">TÉCNICOS</td>
        <td style="border: 1px solid black; padding: 2px;" colspan="9"></td>
      </tr>
      {{TABELA_TECNICOS_MANHA}}
    </tbody>
  </table>
  <div style="margin-top: 5px; font-size: {{TAM_FONTE_TABELA}}px; font-weight: bold; padding-top: 2px; color: #000; margin-bottom: 10px;">
    ENFERMEIRO RESPONSÁVEL PELA DISTRIBUIÇÃO: ______________________________ CARIMBO/ASSINATURA
  </div>

  <!-- TABELA TARDE -->
  <table style="width: 100%; border-collapse: collapse; border: 1px solid black; font-size: {{TAM_FONTE_TABELA}}px; margin-bottom: 5px; color: #000;">
    <thead>
      <tr style="background-color: {{COR_CAB_TARDE}};">
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: {{W_NUMERO}}px;">Nº</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; text-align: left; width: {{W_NOME}}px;">TARDE - ENFERMEIROS</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: {{W_OCORRENCIA}}px;">TROCAS, BH E REMANEJAMENTOS</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: {{W_ATIVIDADE}}px;">DISTRIBUIÇÃO DAS ATIVIDADES</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: {{W_REDIST}}px;">REDISTRIBUIÇÃO DAS ATIVIDADES</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: 40px;">EXPURGO</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: 40px;">KAMISHIBAI</th>
        <th colspan="3" style="border: 1px solid black; padding: 2px; text-align: center;">HORÁRIO</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: {{W_ASSINATURA}}px;">ASSINATURA FUNCIONÁRIO</th>
      </tr>
      <tr style="background-color: {{COR_CAB_TARDE}};">
         <th style="border: 1px solid black; padding: 2px; width: {{W_HORARIO}}px;">ENTRADA</th>
         <th style="border: 1px solid black; padding: 2px; width: {{W_HORARIO}}px;">INTERVALO</th>
         <th style="border: 1px solid black; padding: 2px; width: {{W_HORARIO}}px;">SAÍDA</th>
      </tr>
    </thead>
    <tbody>
      {{TABELA_ENFERMEIROS_TARDE}}
      <tr style="background-color: {{COR_CAB_TARDE}};">
        <td style="border: 1px solid black; padding: 2px;">&nbsp;</td>
        <td style="border: 1px solid black; padding: 2px; font-weight: bold;">TÉCNICOS</td>
        <td style="border: 1px solid black; padding: 2px;" colspan="9"></td>
      </tr>
      {{TABELA_TECNICOS_TARDE}}
    </tbody>
  </table>
  <div style="margin-top: 5px; font-size: {{TAM_FONTE_TABELA}}px; font-weight: bold; padding-top: 2px; color: #000; margin-bottom: 10px;">
    ENFERMEIRO RESPONSÁVEL PELA DISTRIBUIÇÃO: ______________________________ CARIMBO/ASSINATURA
  </div>
</div>

{{QUEBRA_DE_PAGINA}}

<!-- PÁGINA 2: NOITE -->
<div style="font-family: Arial, sans-serif; max-width: 100%; padding: 30px 60px; color: #000; box-sizing: border-box; display: flex; flex-direction: column; height: 100%;">
  <div style="text-align: center; margin-bottom: 10px;">
    <h2 style="margin: 0; font-size: {{TAM_FONTE_TITULO}}px; color: #000;">{{TITULO_DOC}}</h2>
  </div>

  <table style="width: 100%; border-collapse: collapse; border: none; font-size: 12px; font-weight: bold; margin-bottom: 5px; color: #000;">
    <tr>
      <td style="text-align: left; border: none; padding: 0; width: 20%;">SETOR: UTI NEO</td>
      <td style="text-align: center; border: none; padding: 0; width: 60%;">DATA: {{DATA_EXTENSO}}</td>
      <td style="text-align: right; border: none; padding: 0; width: 20%; white-space: nowrap;">DIA: {{DIA_SEMANA}}</td>
    </tr>
  </table>

  <!-- TABELA NOITE -->
  <table style="width: 100%; border-collapse: collapse; border: 1px solid black; font-size: {{TAM_FONTE_TABELA}}px; margin-bottom: 5px; color: #000;">
    <thead>
      <tr style="background-color: {{COR_CAB_NOITE}};">
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: {{W_NUMERO}}px;">Nº</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; text-align: left; width: {{W_NOME}}px;">NOITE - ENFERMEIROS</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: {{W_OCORRENCIA}}px;">TROCAS, BH E REMANEJAMENTOS</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: {{W_ATIVIDADE}}px;">DISTRIBUIÇÃO DAS ATIVIDADES</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: {{W_REDIST}}px;">REDISTRIBUIÇÃO DAS ATIVIDADES</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: 40px;">EXPURGO</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: 40px;">KAMISHIBAI</th>
        <th colspan="3" style="border: 1px solid black; padding: 2px; text-align: center;">HORÁRIO</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: {{W_ASSINATURA}}px;">ASSINATURA FUNCIONÁRIO</th>
      </tr>
      <tr style="background-color: {{COR_CAB_NOITE}};">
         <th style="border: 1px solid black; padding: 2px; width: {{W_HORARIO}}px;">ENTRADA</th>
         <th style="border: 1px solid black; padding: 2px; width: {{W_HORARIO}}px;">INTERVALO</th>
         <th style="border: 1px solid black; padding: 2px; width: {{W_HORARIO}}px;">SAÍDA</th>
      </tr>
    </thead>
    <tbody>
      {{TABELA_ENFERMEIROS_NOITE}}
      <tr style="background-color: {{COR_CAB_NOITE}};">
        <td style="border: 1px solid black; padding: 2px;">&nbsp;</td>
        <td style="border: 1px solid black; padding: 2px; font-weight: bold;">TÉCNICOS</td>
        <td style="border: 1px solid black; padding: 2px;" colspan="9"></td>
      </tr>
      {{TABELA_TECNICOS_NOITE}}
    </tbody>
  </table>

  <div style="margin-top: 5px; font-size: {{TAM_FONTE_TABELA}}px; font-weight: bold; padding-top: 2px; color: #000; margin-bottom: 20px;">
    ENFERMEIRO RESPONSÁVEL PELA DISTRIBUIÇÃO: ______________________________ CARIMBO/ASSINATURA
  </div>

  <div style="text-align: center; font-weight: bold; font-size: 14px; border: 1px solid black; border-bottom: none; padding: 2px; margin-top: auto; margin-bottom: 0;">
    ORGANIZAÇÃO DO DESCANSO NOTURNO
  </div>
  <table style="width: 100%; border-collapse: collapse; border: 1px solid black; font-size: {{TAM_FONTE_TABELA}}px; color: #000; margin-top: 0;">
    <thead>
      <tr style="background-color: #FFE699;">
        <th style="border: 1px solid black; padding: 2px; width: 30%; text-align: center; color: #000;">ENFERMEIROS</th>
        <th style="border: 1px solid black; padding: 2px; width: 10%; text-align: center; color: #000;">INÍCIO</th>
        <th style="border: 1px solid black; padding: 2px; width: 10%; text-align: center; color: #000;">FIM</th>
        <th style="border: 1px solid black; padding: 2px; width: 30%; text-align: center; color: #000;">REDISTRIBUIÇÃO</th>
        <th style="border: 1px solid black; padding: 2px; width: 20%; text-align: center; color: #000;">ASSINATURA</th>
      </tr>
    </thead>
    <tbody>
      <tr style="height: 18px;">
        <td style="border: 1px solid black; padding: 2px;">1.</td>
        <td style="border: 1px solid black; padding: 2px;"></td>
        <td style="border: 1px solid black; padding: 2px;"></td>
        <td style="border: 1px solid black; padding: 2px;"></td>
        <td style="border: 1px solid black; padding: 2px;"></td>
      </tr>
      <tr style="height: 18px;">
        <td style="border: 1px solid black; padding: 2px;">2.</td>
        <td style="border: 1px solid black; padding: 2px;"></td>
        <td style="border: 1px solid black; padding: 2px;"></td>
        <td style="border: 1px solid black; padding: 2px;"></td>
        <td style="border: 1px solid black; padding: 2px;"></td>
      </tr>
      <tr style="background-color: #FFE699;">
         <th style="border: 1px solid black; padding: 2px; text-align: center; color: #000;">TÉCNICOS/AUXILIARES</th>
         <th style="border: 1px solid black; padding: 2px; text-align: center; color: #000;">INÍCIO</th>
         <th style="border: 1px solid black; padding: 2px; text-align: center; color: #000;">FIM</th>
         <th style="border: 1px solid black; padding: 2px; text-align: center; color: #000;">REDISTRIBUIÇÃO</th>
         <th style="border: 1px solid black; padding: 2px; text-align: center; color: #000;">ASSINATURA</th>
      </tr>
      <tr style="height: 18px;">
        <td style="border: 1px solid black; padding: 2px;">1.</td>
        <td style="border: 1px solid black; padding: 2px;"></td>
        <td style="border: 1px solid black; padding: 2px;"></td>
        <td style="border: 1px solid black; padding: 2px;"></td>
        <td style="border: 1px solid black; padding: 2px;"></td>
      </tr>
      <tr style="height: 18px;">
        <td style="border: 1px solid black; padding: 2px;">2.</td>
        <td style="border: 1px solid black; padding: 2px;"></td>
        <td style="border: 1px solid black; padding: 2px;"></td>
        <td style="border: 1px solid black; padding: 2px;"></td>
        <td style="border: 1px solid black; padding: 2px;"></td>
      </tr>
      <tr style="height: 18px;">
        <td style="border: 1px solid black; padding: 2px;">3.</td>
        <td style="border: 1px solid black; padding: 2px;"></td>
        <td style="border: 1px solid black; padding: 2px;"></td>
        <td style="border: 1px solid black; padding: 2px;"></td>
        <td style="border: 1px solid black; padding: 2px;"></td>
      </tr>
      <tr style="height: 18px;">
        <td style="border: 1px solid black; padding: 2px;">4.</td>
        <td style="border: 1px solid black; padding: 2px;"></td>
        <td style="border: 1px solid black; padding: 2px;"></td>
        <td style="border: 1px solid black; padding: 2px;"></td>
        <td style="border: 1px solid black; padding: 2px;"></td>
      </tr>
    </tbody>
  </table>
</div>
`;

// Modelo Padrão (Cópia da UTI NEO mas com nomes de colunas customizáveis)
const TEMPLATE_STANDARD = `
<!-- PÁGINA 1: MANHÃ E TARDE -->
<div style="font-family: Arial, sans-serif; max-width: 100%; padding: 30px 60px; color: #000; box-sizing: border-box;">
  <div style="text-align: center; margin-bottom: 10px;">
    <h2 style="margin: 0; font-size: {{TAM_FONTE_TITULO}}px; color: #000;">{{TITULO_DOC}}</h2>
  </div>

  <table style="width: 100%; border-collapse: collapse; border: none; font-size: 12px; font-weight: bold; margin-bottom: 5px; color: #000;">
    <tr>
      <td style="text-align: left; border: none; padding: 0; width: 20%;">SETOR: {{NOME_SETOR}}</td>
      <td style="text-align: center; border: none; padding: 0; width: 60%;">DATA: {{DATA_EXTENSO}}</td>
      <td style="text-align: right; border: none; padding: 0; width: 20%; white-space: nowrap;">DIA: {{DIA_SEMANA}}</td>
    </tr>
  </table>

  <!-- TABELA MANHÃ -->
  <table style="width: 100%; border-collapse: collapse; border: 1px solid black; font-size: {{TAM_FONTE_TABELA}}px; margin-bottom: 5px; color: #000;">
    <thead>
      <tr style="background-color: {{COR_CAB_MANHA}};">
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: {{W_NUMERO}}px;">Nº</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; text-align: left; width: {{W_NOME}}px;">MANHÃ - ENFERMEIROS</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: {{W_OCORRENCIA}}px;">TROCAS, BH E REMANEJAMENTOS</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: {{W_ATIVIDADE}}px;">DISTRIBUIÇÃO DAS ATIVIDADES</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: {{W_REDIST}}px;">REDISTRIBUIÇÃO DAS ATIVIDADES</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: 40px;">{{NOME_COLUNA_6}}</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: 40px;">{{NOME_COLUNA_7}}</th>
        <th colspan="3" style="border: 1px solid black; padding: 2px; text-align: center;">HORÁRIO</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: {{W_ASSINATURA}}px;">ASSINATURA FUNCIONÁRIO</th>
      </tr>
      <tr style="background-color: {{COR_CAB_MANHA}};">
         <th style="border: 1px solid black; padding: 2px; width: {{W_HORARIO}}px;">ENTRADA</th>
         <th style="border: 1px solid black; padding: 2px; width: {{W_HORARIO}}px;">INTERVALO</th>
         <th style="border: 1px solid black; padding: 2px; width: {{W_HORARIO}}px;">SAÍDA</th>
      </tr>
    </thead>
    <tbody>
      {{TABELA_ENFERMEIROS_MANHA}}
      <tr style="background-color: {{COR_CAB_MANHA}};">
        <td style="border: 1px solid black; padding: 2px;">&nbsp;</td>
        <td style="border: 1px solid black; padding: 2px; font-weight: bold;">TÉCNICOS</td>
        <td style="border: 1px solid black; padding: 2px;" colspan="9"></td>
      </tr>
      {{TABELA_TECNICOS_MANHA}}
    </tbody>
  </table>
  <div style="margin-top: 5px; font-size: {{TAM_FONTE_TABELA}}px; font-weight: bold; padding-top: 2px; color: #000; margin-bottom: 10px;">
    ENFERMEIRO RESPONSÁVEL PELA DISTRIBUIÇÃO: ______________________________ CARIMBO/ASSINATURA
  </div>

  <!-- TABELA TARDE -->
  <table style="width: 100%; border-collapse: collapse; border: 1px solid black; font-size: {{TAM_FONTE_TABELA}}px; margin-bottom: 5px; color: #000;">
    <thead>
      <tr style="background-color: {{COR_CAB_TARDE}};">
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: {{W_NUMERO}}px;">Nº</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; text-align: left; width: {{W_NOME}}px;">TARDE - ENFERMEIROS</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: {{W_OCORRENCIA}}px;">TROCAS, BH E REMANEJAMENTOS</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: {{W_ATIVIDADE}}px;">DISTRIBUIÇÃO DAS ATIVIDADES</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: {{W_REDIST}}px;">REDISTRIBUIÇÃO DAS ATIVIDADES</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: 40px;">{{NOME_COLUNA_6}}</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: 40px;">{{NOME_COLUNA_7}}</th>
        <th colspan="3" style="border: 1px solid black; padding: 2px; text-align: center;">HORÁRIO</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: {{W_ASSINATURA}}px;">ASSINATURA FUNCIONÁRIO</th>
      </tr>
      <tr style="background-color: {{COR_CAB_TARDE}};">
         <th style="border: 1px solid black; padding: 2px; width: {{W_HORARIO}}px;">ENTRADA</th>
         <th style="border: 1px solid black; padding: 2px; width: {{W_HORARIO}}px;">INTERVALO</th>
         <th style="border: 1px solid black; padding: 2px; width: {{W_HORARIO}}px;">SAÍDA</th>
      </tr>
    </thead>
    <tbody>
      {{TABELA_ENFERMEIROS_TARDE}}
      <tr style="background-color: {{COR_CAB_TARDE}};">
        <td style="border: 1px solid black; padding: 2px;">&nbsp;</td>
        <td style="border: 1px solid black; padding: 2px; font-weight: bold;">TÉCNICOS</td>
        <td style="border: 1px solid black; padding: 2px;" colspan="9"></td>
      </tr>
      {{TABELA_TECNICOS_TARDE}}
    </tbody>
  </table>
  <div style="margin-top: 5px; font-size: {{TAM_FONTE_TABELA}}px; font-weight: bold; padding-top: 2px; color: #000; margin-bottom: 10px;">
    ENFERMEIRO RESPONSÁVEL PELA DISTRIBUIÇÃO: ______________________________ CARIMBO/ASSINATURA
  </div>
</div>

{{QUEBRA_DE_PAGINA}}

<!-- PÁGINA 2: NOITE -->
<div style="font-family: Arial, sans-serif; max-width: 100%; padding: 30px 60px; color: #000; box-sizing: border-box; display: flex; flex-direction: column; height: 100%;">
  <div style="text-align: center; margin-bottom: 10px;">
    <h2 style="margin: 0; font-size: {{TAM_FONTE_TITULO}}px; color: #000;">{{TITULO_DOC}}</h2>
  </div>

  <table style="width: 100%; border-collapse: collapse; border: none; font-size: 12px; font-weight: bold; margin-bottom: 5px; color: #000;">
    <tr>
      <td style="text-align: left; border: none; padding: 0; width: 20%;">SETOR: {{NOME_SETOR}}</td>
      <td style="text-align: center; border: none; padding: 0; width: 60%;">DATA: {{DATA_EXTENSO}}</td>
      <td style="text-align: right; border: none; padding: 0; width: 20%; white-space: nowrap;">DIA: {{DIA_SEMANA}}</td>
    </tr>
  </table>

  <!-- TABELA NOITE -->
  <table style="width: 100%; border-collapse: collapse; border: 1px solid black; font-size: {{TAM_FONTE_TABELA}}px; margin-bottom: 5px; color: #000;">
    <thead>
      <tr style="background-color: {{COR_CAB_NOITE}};">
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: {{W_NUMERO}}px;">Nº</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; text-align: left; width: {{W_NOME}}px;">NOITE - ENFERMEIROS</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: {{W_OCORRENCIA}}px;">TROCAS, BH E REMANEJAMENTOS</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: {{W_ATIVIDADE}}px;">DISTRIBUIÇÃO DAS ATIVIDADES</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: {{W_REDIST}}px;">REDISTRIBUIÇÃO DAS ATIVIDADES</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: 40px;">{{NOME_COLUNA_6}}</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: 40px;">{{NOME_COLUNA_7}}</th>
        <th colspan="3" style="border: 1px solid black; padding: 2px; text-align: center;">HORÁRIO</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: {{W_ASSINATURA}}px;">ASSINATURA FUNCIONÁRIO</th>
      </tr>
      <tr style="background-color: {{COR_CAB_NOITE}};">
         <th style="border: 1px solid black; padding: 2px; width: {{W_HORARIO}}px;">ENTRADA</th>
         <th style="border: 1px solid black; padding: 2px; width: {{W_HORARIO}}px;">INTERVALO</th>
         <th style="border: 1px solid black; padding: 2px; width: {{W_HORARIO}}px;">SAÍDA</th>
      </tr>
    </thead>
    <tbody>
      {{TABELA_ENFERMEIROS_NOITE}}
      <tr style="background-color: {{COR_CAB_NOITE}};">
        <td style="border: 1px solid black; padding: 2px;">&nbsp;</td>
        <td style="border: 1px solid black; padding: 2px; font-weight: bold;">TÉCNICOS</td>
        <td style="border: 1px solid black; padding: 2px;" colspan="9"></td>
      </tr>
      {{TABELA_TECNICOS_NOITE}}
    </tbody>
  </table>

  <div style="margin-top: 5px; font-size: {{TAM_FONTE_TABELA}}px; font-weight: bold; padding-top: 2px; color: #000; margin-bottom: 20px;">
    ENFERMEIRO RESPONSÁVEL PELA DISTRIBUIÇÃO: ______________________________ CARIMBO/ASSINATURA
  </div>

  <div style="text-align: center; font-weight: bold; font-size: 14px; border: 1px solid black; border-bottom: none; padding: 2px; margin-top: auto; margin-bottom: 0;">
    ORGANIZAÇÃO DO DESCANSO NOTURNO
  </div>
  <table style="width: 100%; border-collapse: collapse; border: 1px solid black; font-size: {{TAM_FONTE_TABELA}}px; color: #000; margin-top: 0;">
    <thead>
      <tr style="background-color: #FFE699;">
        <th style="border: 1px solid black; padding: 2px; width: 30%; text-align: center; color: #000;">ENFERMEIROS</th>
        <th style="border: 1px solid black; padding: 2px; width: 10%; text-align: center; color: #000;">INÍCIO</th>
        <th style="border: 1px solid black; padding: 2px; width: 10%; text-align: center; color: #000;">FIM</th>
        <th style="border: 1px solid black; padding: 2px; width: 30%; text-align: center; color: #000;">REDISTRIBUIÇÃO</th>
        <th style="border: 1px solid black; padding: 2px; width: 20%; text-align: center; color: #000;">ASSINATURA</th>
      </tr>
    </thead>
    <tbody>
      <tr style="height: 18px;">
        <td style="border: 1px solid black; padding: 2px;">1.</td>
        <td style="border: 1px solid black; padding: 2px;"></td>
        <td style="border: 1px solid black; padding: 2px;"></td>
        <td style="border: 1px solid black; padding: 2px;"></td>
        <td style="border: 1px solid black; padding: 2px;"></td>
      </tr>
      <tr style="height: 18px;">
        <td style="border: 1px solid black; padding: 2px;">2.</td>
        <td style="border: 1px solid black; padding: 2px;"></td>
        <td style="border: 1px solid black; padding: 2px;"></td>
        <td style="border: 1px solid black; padding: 2px;"></td>
        <td style="border: 1px solid black; padding: 2px;"></td>
      </tr>
      <tr style="background-color: #FFE699;">
         <th style="border: 1px solid black; padding: 2px; text-align: center; color: #000;">TÉCNICOS/AUXILIARES</th>
         <th style="border: 1px solid black; padding: 2px; text-align: center; color: #000;">INÍCIO</th>
         <th style="border: 1px solid black; padding: 2px; text-align: center; color: #000;">FIM</th>
         <th style="border: 1px solid black; padding: 2px; text-align: center; color: #000;">REDISTRIBUIÇÃO</th>
         <th style="border: 1px solid black; padding: 2px; text-align: center; color: #000;">ASSINATURA</th>
      </tr>
      <tr style="height: 18px;">
        <td style="border: 1px solid black; padding: 2px;">1.</td>
        <td style="border: 1px solid black; padding: 2px;"></td>
        <td style="border: 1px solid black; padding: 2px;"></td>
        <td style="border: 1px solid black; padding: 2px;"></td>
        <td style="border: 1px solid black; padding: 2px;"></td>
      </tr>
      <tr style="height: 18px;">
        <td style="border: 1px solid black; padding: 2px;">2.</td>
        <td style="border: 1px solid black; padding: 2px;"></td>
        <td style="border: 1px solid black; padding: 2px;"></td>
        <td style="border: 1px solid black; padding: 2px;"></td>
        <td style="border: 1px solid black; padding: 2px;"></td>
      </tr>
      <tr style="height: 18px;">
        <td style="border: 1px solid black; padding: 2px;">3.</td>
        <td style="border: 1px solid black; padding: 2px;"></td>
        <td style="border: 1px solid black; padding: 2px;"></td>
        <td style="border: 1px solid black; padding: 2px;"></td>
        <td style="border: 1px solid black; padding: 2px;"></td>
      </tr>
      <tr style="height: 18px;">
        <td style="border: 1px solid black; padding: 2px;">4.</td>
        <td style="border: 1px solid black; padding: 2px;"></td>
        <td style="border: 1px solid black; padding: 2px;"></td>
        <td style="border: 1px solid black; padding: 2px;"></td>
        <td style="border: 1px solid black; padding: 2px;"></td>
      </tr>
    </tbody>
  </table>
</div>
`;

// Modelo UCA - REFATORADO PARA ORGANIZAÇÃO (Tabela Limpa)
const TEMPLATE_UCA = `
<div style="font-family: Arial, sans-serif; max-width: 100%; padding: 30px 60px; color: #000; box-sizing: border-box;">
  <div style="text-align: center; margin-bottom: 10px;">
    <h2 style="margin: 0; font-size: {{TAM_FONTE_TITULO}}px; color: #000;">{{TITULO_DOC}}</h2>
  </div>

  <table style="width: 100%; border-collapse: collapse; border: none; font-size: 12px; font-weight: bold; margin-bottom: 5px; color: #000;">
    <tr>
      <td style="text-align: left; border: none; padding: 0; width: 20%;">SETOR: UCA</td>
      <td style="text-align: center; border: none; padding: 0; width: 60%;">DATA: {{DATA_EXTENSO}}</td>
      <td style="text-align: right; border: none; padding: 0; width: 20%; white-space: nowrap;">DIA: {{DIA_SEMANA}}</td>
    </tr>
  </table>

  <!-- TABELA MANHÃ -->
  <table style="width: 100%; border-collapse: collapse; border: 1px solid black; font-size: {{TAM_FONTE_TABELA}}px; margin-bottom: 5px; color: #000;">
    <thead>
      <tr style="background-color: {{COR_CAB_MANHA}};">
        <th rowspan="2" style="border: 1px solid black; padding: 4px; text-align: center; width: 22%; color: #000; vertical-align: middle;">
            <div style="border-bottom: 1px solid black; padding: 4px;">MANHÃ</div>
            <div style="padding: 4px;">ENFERMEIROS</div>
        </th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: 14%; color: #000; vertical-align: middle;">DISTRIBUIÇÃO<br/>ATIVIDADES</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: 12%; color: #000; vertical-align: middle;">ORG. ALMOTOLIAS/<br/>MULTIDOSES</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: 8%; color: #000; vertical-align: middle;">EXPURGO<br/>CME</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: 8%; color: #000; vertical-align: middle;">TEMP.<br/>GELADEIRA</th>
        <th colspan="3" style="border: 1px solid black; padding: 2px; color: #000; vertical-align: middle;">HORÁRIO</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: 16%; color: #000; vertical-align: middle;">ASSINATURA FUNCIONÁRIO</th>
      </tr>
      <tr style="background-color: {{COR_CAB_MANHA}};">
        <th style="border: 1px solid black; padding: 2px; width: 6.66%; color: #000; font-size: 9px;">ENTRADA</th>
        <th style="border: 1px solid black; padding: 2px; width: 6.66%; color: #000; font-size: 9px;">INTERVALO</th>
        <th style="border: 1px solid black; padding: 2px; width: 6.66%; color: #000; font-size: 9px;">SAÍDA</th>
      </tr>
    </thead>
    <tbody>
      {{TABELA_ENFERMEIROS_MANHA}}
      <tr style="background-color: {{COR_LIN_MANHA}};">
        <td style="border: 1px solid black; padding: 4px; font-weight: bold; color: #000;">TÉCNICOS/AUXILIARES</td>
        <td style="border: 1px solid black; padding: 4px;" colspan="8"></td>
      </tr>
      {{TABELA_TECNICOS_MANHA}}
      <tr>
        <td style="border: 1px solid black; padding: 4px; font-weight: bold; color: #000;">TÉCNICO/AUX.TRANSPORTE</td>
        <td style="border: 1px solid black; padding: 4px;" colspan="8"></td>
      </tr>
      <tr>
        <td style="border: 1px solid black; padding: 4px; font-weight: bold; color: #000;">FALTAS</td>
        <td style="border: 1px solid black; padding: 4px;" colspan="8"></td>
      </tr>
      <tr style="height: 40px;">
        <td style="border: 1px solid black; padding: 4px; font-weight: bold; color: #000; vertical-align: top;">TROCAS/REMANEJAMENTO</td>
        <td style="border: 1px solid black; padding: 4px;" colspan="8"></td>
      </tr>
    </tbody>
  </table>
  
  <div style="margin-top: 15px; font-size: {{TAM_FONTE_TABELA}}px; font-weight: bold; padding-top: 5px; color: #000; margin-bottom: 15px;">
    ENFERMEIRO RESPONSÁVEL PELA DISTRIBUIÇÃO- CARIMBO/ ASSINATURA: __________________________________________________
  </div>

  <!-- TABELA TARDE -->
  <table style="width: 100%; border-collapse: collapse; border: 1px solid black; font-size: {{TAM_FONTE_TABELA}}px; margin-bottom: 5px; color: #000;">
    <thead>
      <tr style="background-color: {{COR_CAB_TARDE}};">
        <th rowspan="2" style="border: 1px solid black; padding: 4px; text-align: center; width: 22%; color: #000; vertical-align: middle;">
            <div style="border-bottom: 1px solid black; padding: 4px;">TARDE</div>
            <div style="padding: 4px;">ENFERMEIROS</div>
        </th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: 14%; color: #000; vertical-align: middle;">DISTRIBUIÇÃO<br/>ATIVIDADES</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: 12%; color: #000; vertical-align: middle;">ORG. ALMOTOLIAS/<br/>MULTIDOSES</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: 8%; color: #000; vertical-align: middle;">EXPURGO<br/>CME</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: 8%; color: #000; vertical-align: middle;">TEMP.<br/>GELADEIRA</th>
        <th colspan="3" style="border: 1px solid black; padding: 2px; color: #000; vertical-align: middle;">HORÁRIO</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: 16%; color: #000; vertical-align: middle;">ASSINATURA FUNCIONÁRIO</th>
      </tr>
      <tr style="background-color: {{COR_CAB_TARDE}};">
        <th style="border: 1px solid black; padding: 2px; width: 6.66%; color: #000; font-size: 9px;">ENTRADA</th>
        <th style="border: 1px solid black; padding: 2px; width: 6.66%; color: #000; font-size: 9px;">INTERVALO</th>
        <th style="border: 1px solid black; padding: 2px; width: 6.66%; color: #000; font-size: 9px;">SAÍDA</th>
      </tr>
    </thead>
    <tbody>
      {{TABELA_ENFERMEIROS_TARDE}}
      <tr style="background-color: {{COR_LIN_TARDE}};">
        <td style="border: 1px solid black; padding: 4px; font-weight: bold; color: #000;">TÉCNICOS/AUXILIARES</td>
        <td style="border: 1px solid black; padding: 4px;" colspan="8"></td>
      </tr>
      {{TABELA_TECNICOS_TARDE}}
    </tbody>
  </table>
  
  <div style="margin-top: 15px; font-size: {{TAM_FONTE_TABELA}}px; font-weight: bold; padding-top: 5px; color: #000; margin-bottom: 15px;">
    ENFERMEIRO RESPONSÁVEL PELA DISTRIBUIÇÃO- CARIMBO/ ASSINATURA: __________________________________________________
  </div>
</div> {{QUEBRA_DE_PAGINA}}

<div style="font-family: Arial, sans-serif; max-width: 100%; padding: 30px 60px; color: #000; box-sizing: border-box;">
  <div style="text-align: center; margin-bottom: 10px;">
    <h2 style="margin: 0; font-size: {{TAM_FONTE_TITULO}}px; color: #000;">{{TITULO_DOC}}</h2>
  </div>

  <table style="width: 100%; border-collapse: collapse; border: none; font-size: 12px; font-weight: bold; margin-bottom: 5px; color: #000;">
    <tr>
      <td style="text-align: left; border: none; padding: 0; width: 20%;">SETOR: UCA</td>
      <td style="text-align: center; border: none; padding: 0; width: 60%;">DATA: {{DATA_EXTENSO}}</td>
      <td style="text-align: right; border: none; padding: 0; width: 20%; white-space: nowrap;">DIA: {{DIA_SEMANA}}</td>
    </tr>
  </table>

  <!-- TABELA PRINCIPAL NOITE (ESPECÍFICA UCA) -->
  <table style="width: 100%; border-collapse: collapse; border: 1px solid black; font-size: {{TAM_FONTE_TABELA}}px; margin-bottom: 15px; color: #000;">
    <thead>
      <tr style="background-color: {{COR_CAB_NOITE}};">
        <th rowspan="2" style="border: 1px solid black; padding: 4px; text-align: center; width: 22%; color: #000; vertical-align: middle;">
            <div style="border-bottom: 1px solid black; padding: 4px;">NOITE</div>
            <div style="padding: 4px;">ENFERMEIROS</div>
        </th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: 14%; color: #000; vertical-align: middle;">DISTRIBUIÇÃO<br/>ATIVIDADES</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: 12%; color: #000; vertical-align: middle;">ORG. ALMOTOLIAS/<br/>MULTIDOSES</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: 8%; color: #000; vertical-align: middle;">EXPURGO<br/>CME</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: 8%; color: #000; vertical-align: middle;">TEMP.<br/>GELADEIRA</th>
        <th colspan="3" style="border: 1px solid black; padding: 2px; color: #000; vertical-align: middle;">HORÁRIO</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: 16%; color: #000; vertical-align: middle;">ASSINATURA FUNCIONÁRIO</th>
      </tr>
      <tr style="background-color: {{COR_CAB_NOITE}};">
        <th style="border: 1px solid black; padding: 2px; width: 6.66%; color: #000; font-size: 9px;">ENTRADA</th>
        <th style="border: 1px solid black; padding: 2px; width: 6.66%; color: #000; font-size: 9px;">INTERVALO</th>
        <th style="border: 1px solid black; padding: 2px; width: 6.66%; color: #000; font-size: 9px;">SAÍDA</th>
      </tr>
    </thead>
    <tbody>
      {{TABELA_ENFERMEIROS_NOITE}}
      <tr style="background-color: {{COR_LIN_NOITE}};">
        <td style="border: 1px solid black; padding: 4px; font-weight: bold; color: #000;">TÉCNICOS/AUXILIARES</td>
        <td style="border: 1px solid black; padding: 4px;" colspan="8"></td>
      </tr>
      {{TABELA_TECNICOS_NOITE}}
      <tr>
        <td style="border: 1px solid black; padding: 4px; font-weight: bold; color: #000;">TÉCNICO/AUX.TRANSPORTE</td>
        <td style="border: 1px solid black; padding: 4px;" colspan="8"></td>
      </tr>
      <tr>
        <td style="border: 1px solid black; padding: 4px; font-weight: bold; color: #000;">FALTAS</td>
        <td style="border: 1px solid black; padding: 4px;" colspan="8"></td>
      </tr>
      <tr style="height: 40px;">
        <td style="border: 1px solid black; padding: 4px; font-weight: bold; color: #000; vertical-align: top;">TROCAS/REMANEJAMENTO</td>
        <td style="border: 1px solid black; padding: 4px;" colspan="8"></td>
      </tr>
    </tbody>
  </table>

  <div style="margin-top: 15px; font-size: {{TAM_FONTE_TABELA}}px; font-weight: bold; padding-top: 5px; color: #000; margin-bottom: 20px;">
    ENFERMEIRO RESPONSÁVEL PELA DISTRIBUIÇÃO- CARIMBO/ ASSINATURA: __________________________________________________
  </div>

  <div style="text-align: center; font-weight: bold; font-size: 14px; border: 1px solid black; border-bottom: none; padding: 2px; margin-top: auto; margin-bottom: 0;">
    ORGANIZAÇÃO DO DESCANSO NOTURNO
  </div>
  <table style="width: 100%; border-collapse: collapse; border: 1px solid black; font-size: {{TAM_FONTE_TABELA}}px; color: #000; margin-top: 0;">
    <thead>
      <tr style="background-color: #FFE699;">
        <th style="border: 1px solid black; padding: 2px; width: 30%; text-align: center; color: #000;">ENFERMEIROS</th>
        <th style="border: 1px solid black; padding: 2px; width: 10%; text-align: center; color: #000;">INÍCIO<br/>HORÁRIO<br/>DESCANSO</th>
        <th style="border: 1px solid black; padding: 2px; width: 10%; text-align: center; color: #000;">FIM<br/>HORÁRIO<br/>DESCANSO</th>
        <th style="border: 1px solid black; padding: 2px; width: 30%; text-align: center; color: #000;">REDISTRIBUIÇÃO DAS ATIVIDADES DURANTE DESCANSO</th>
        <th style="border: 1px solid black; padding: 2px; width: 20%; text-align: center; color: #000;">ASSINATURA DO PROFISSIONAL</th>
      </tr>
    </thead>
    <tbody>
      <tr style="height: 20px;">
        <td style="border: 1px solid black; padding: 2px;">1.</td>
        <td style="border: 1px solid black; padding: 2px;"></td>
        <td style="border: 1px solid black; padding: 2px;"></td>
        <td style="border: 1px solid black; padding: 2px;"></td>
        <td style="border: 1px solid black; padding: 2px;"></td>
      </tr>
      <tr style="height: 20px;">
        <td style="border: 1px solid black; padding: 2px;">2.</td>
        <td style="border: 1px solid black; padding: 2px;"></td>
        <td style="border: 1px solid black; padding: 2px;"></td>
        <td style="border: 1px solid black; padding: 2px;"></td>
        <td style="border: 1px solid black; padding: 2px;"></td>
      </tr>
      <tr style="background-color: #FFE699;">
         <th style="border: 1px solid black; padding: 2px; text-align: center; color: #000;">TÉCNICOS/AUXILIARES</th>
         <th style="border: 1px solid black; padding: 2px; text-align: center; color: #000;">INÍCIO<br/>HORÁRIO<br/>DESCANSO</th>
         <th style="border: 1px solid black; padding: 2px; text-align: center; color: #000;">FIM<br/>HORÁRIO<br/>DESCANSO</th>
         <th style="border: 1px solid black; padding: 2px; text-align: center; color: #000;">REDISTRIBUIÇÃO DAS ATIVIDADES DURANTE DESCANSO ( LEITOS E HORÁRIO)</th>
         <th style="border: 1px solid black; padding: 2px; text-align: center; color: #000;">ASSINATURA DO PROFISSIONAL</th>
      </tr>
      <tr style="height: 20px;">
        <td style="border: 1px solid black; padding: 2px;">1.</td>
        <td style="border: 1px solid black; padding: 2px;"></td>
        <td style="border: 1px solid black; padding: 2px;"></td>
        <td style="border: 1px solid black; padding: 2px;"></td>
        <td style="border: 1px solid black; padding: 2px;"></td>
      </tr>
      <tr style="height: 20px;">
        <td style="border: 1px solid black; padding: 2px;">2.</td>
        <td style="border: 1px solid black; padding: 2px;"></td>
        <td style="border: 1px solid black; padding: 2px;"></td>
        <td style="border: 1px solid black; padding: 2px;"></td>
        <td style="border: 1px solid black; padding: 2px;"></td>
      </tr>
      <tr style="height: 20px;">
        <td style="border: 1px solid black; padding: 2px;">3.</td>
        <td style="border: 1px solid black; padding: 2px;"></td>
        <td style="border: 1px solid black; padding: 2px;"></td>
        <td style="border: 1px solid black; padding: 2px;"></td>
        <td style="border: 1px solid black; padding: 2px;"></td>
      </tr>
       <tr style="height: 20px;">
        <td style="border: 1px solid black; padding: 2px;">4.</td>
        <td style="border: 1px solid black; padding: 2px;"></td>
        <td style="border: 1px solid black; padding: 2px;"></td>
        <td style="border: 1px solid black; padding: 2px;"></td>
        <td style="border: 1px solid black; padding: 2px;"></td>
      </tr>
    </tbody>
  </table>
</div>
`;

// Novo Modelo UCINCO - Atualizado: Adicionado coluna EXPURGO
const TEMPLATE_UCINCO = `
<div style="font-family: Arial, sans-serif; max-width: 100%; padding: 15px; color: #000; box-sizing: border-box;">
  <div style="text-align: center; margin-bottom: 5px;">
    <h2 style="margin: 0; font-size: {{TAM_FONTE_TITULO}}px; color: #000;">{{TITULO_DOC}}</h2>
  </div>

  <!-- Cabeçalho Tabela -->
  <table style="width: 100%; border-collapse: collapse; border: none; font-size: 11px; font-weight: bold; margin-bottom: 5px; color: #000;">
    <tr>
      <td style="text-align: left; border: none; padding: 0; width: 20%;">SETOR: UCINCO</td>
      <td style="text-align: center; border: none; padding: 0; width: 60%;">DATA: {{DATA_EXTENSO}}</td>
      <td style="text-align: right; border: none; padding: 0; width: 20%; white-space: nowrap;">DIA: {{DIA_SEMANA}}</td>
    </tr>
  </table>

  <!-- TABELA MANHÃ -->
  <table style="width: 100%; border-collapse: collapse; border: 1px solid black; font-size: {{TAM_FONTE_TABELA}}px; margin-bottom: 5px; color: #000;">
    <thead>
      <tr style="background-color: {{COR_CAB_MANHA}};">
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: {{W_NUMERO}}px;">Nº</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; text-align: left; width: {{W_NOME}}px;">MANHÃ - ENFERMEIROS</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: {{W_OCORRENCIA}}px;">TROCAS, BH E REMANEJAMENTOS</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: {{W_ATIVIDADE}}px;">DISTRIBUIÇÃO DAS ATIVIDADES</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: {{W_REDIST}}px;">REDISTRIBUIÇÃO DAS ATIVIDADES</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: 40px;">EXPURGO</th>
        <th colspan="3" style="border: 1px solid black; padding: 2px; text-align: center;">HORÁRIO</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: {{W_ASSINATURA}}px;">ASSINATURA FUNCIONÁRIO</th>
      </tr>
      <tr style="background-color: {{COR_CAB_MANHA}};">
         <th style="border: 1px solid black; padding: 2px; width: {{W_HORARIO}}px;">ENTRADA</th>
         <th style="border: 1px solid black; padding: 2px; width: {{W_HORARIO}}px;">INTERVALO</th>
         <th style="border: 1px solid black; padding: 2px; width: {{W_HORARIO}}px;">SAÍDA</th>
      </tr>
    </thead>
    <tbody>
      {{TABELA_ENFERMEIROS_MANHA}}
      <tr style="background-color: {{COR_CAB_MANHA}};">
        <td style="border: 1px solid black; padding: 2px;">&nbsp;</td>
        <td style="border: 1px solid black; padding: 2px; font-weight: bold;">TÉCNICOS</td>
        <td style="border: 1px solid black; padding: 2px;" colspan="8"></td>
      </tr>
      {{TABELA_TECNICOS_MANHA}}
    </tbody>
  </table>
  <div style="margin-top: 5px; font-size: {{TAM_FONTE_TABELA}}px; font-weight: bold; padding-top: 2px; color: #000; margin-bottom: 10px;">
    ENFERMEIRO RESPONSÁVEL PELA DISTRIBUIÇÃO: ______________________________ CARIMBO/ASSINATURA
  </div>

  <!-- TABELA TARDE -->
  <table style="width: 100%; border-collapse: collapse; border: 1px solid black; font-size: {{TAM_FONTE_TABELA}}px; margin-bottom: 5px; color: #000;">
    <thead>
      <tr style="background-color: {{COR_CAB_TARDE}};">
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: {{W_NUMERO}}px;">Nº</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; text-align: left; width: {{W_NOME}}px;">TARDE - ENFERMEIROS</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: {{W_OCORRENCIA}}px;">TROCAS, BH E REMANEJAMENTOS</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: {{W_ATIVIDADE}}px;">DISTRIBUIÇÃO DAS ATIVIDADES</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: {{W_REDIST}}px;">REDISTRIBUIÇÃO DAS ATIVIDADES</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: 40px;">EXPURGO</th>
        <th colspan="3" style="border: 1px solid black; padding: 2px; text-align: center;">HORÁRIO</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: {{W_ASSINATURA}}px;">ASSINATURA FUNCIONÁRIO</th>
      </tr>
      <tr style="background-color: {{COR_CAB_TARDE}};">
         <th style="border: 1px solid black; padding: 2px; width: {{W_HORARIO}}px;">ENTRADA</th>
         <th style="border: 1px solid black; padding: 2px; width: {{W_HORARIO}}px;">INTERVALO</th>
         <th style="border: 1px solid black; padding: 2px; width: {{W_HORARIO}}px;">SAÍDA</th>
      </tr>
    </thead>
    <tbody>
      {{TABELA_ENFERMEIROS_TARDE}}
      <tr style="background-color: {{COR_CAB_TARDE}};">
        <td style="border: 1px solid black; padding: 2px;">&nbsp;</td>
        <td style="border: 1px solid black; padding: 2px; font-weight: bold;">TÉCNICOS</td>
        <td style="border: 1px solid black; padding: 2px;" colspan="8"></td>
      </tr>
      {{TABELA_TECNICOS_TARDE}}
    </tbody>
  </table>
  <div style="margin-top: 5px; font-size: {{TAM_FONTE_TABELA}}px; font-weight: bold; padding-top: 2px; color: #000; margin-bottom: 10px;">
    ENFERMEIRO RESPONSÁVEL PELA DISTRIBUIÇÃO: ______________________________ CARIMBO/ASSINATURA
  </div>

  <!-- TABELA NOITE -->
  <table style="width: 100%; border-collapse: collapse; border: 1px solid black; font-size: {{TAM_FONTE_TABELA}}px; margin-bottom: 5px; color: #000;">
    <thead>
      <tr style="background-color: {{COR_CAB_NOITE}};">
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: {{W_NUMERO}}px;">Nº</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; text-align: left; width: {{W_NOME}}px;">NOITE - ENFERMEIROS</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: {{W_OCORRENCIA}}px;">TROCAS, BH E REMANEJAMENTOS</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: {{W_ATIVIDADE}}px;">DISTRIBUIÇÃO DAS ATIVIDADES</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: {{W_REDIST}}px;">REDISTRIBUIÇÃO DAS ATIVIDADES</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: 40px;">EXPURGO</th>
        <th colspan="3" style="border: 1px solid black; padding: 2px; text-align: center;">HORÁRIO</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: {{W_ASSINATURA}}px;">ASSINATURA FUNCIONÁRIO</th>
      </tr>
      <tr style="background-color: {{COR_CAB_NOITE}};">
         <th style="border: 1px solid black; padding: 2px; width: {{W_HORARIO}}px;">ENTRADA</th>
         <th style="border: 1px solid black; padding: 2px; width: {{W_HORARIO}}px;">INTERVALO</th>
         <th style="border: 1px solid black; padding: 2px; width: {{W_HORARIO}}px;">SAÍDA</th>
      </tr>
    </thead>
    <tbody>
      {{TABELA_ENFERMEIROS_NOITE}}
      <tr style="background-color: {{COR_CAB_NOITE}};">
        <td style="border: 1px solid black; padding: 2px;">&nbsp;</td>
        <td style="border: 1px solid black; padding: 2px; font-weight: bold;">TÉCNICOS</td>
        <td style="border: 1px solid black; padding: 2px;" colspan="8"></td>
      </tr>
      {{TABELA_TECNICOS_NOITE}}
    </tbody>
  </table>

  <div style="margin-top: 5px; font-size: {{TAM_FONTE_TABELA}}px; font-weight: bold; border-top: 1px solid black; padding-top: 5px; color: #000;">
    ENFERMEIRO RESPONSÁVEL PELA DISTRIBUIÇÃO: ______________________________ CARIMBO/ASSINATURA
  </div>
</div>
`;

// Novo Modelo UCINCA (Cópia do UCINCO, apenas mudando o nome do setor)
const TEMPLATE_UCINCA = `
<div style="font-family: Arial, sans-serif; max-width: 100%; padding: 15px; color: #000; box-sizing: border-box;">
  <div style="text-align: center; margin-bottom: 5px;">
    <h2 style="margin: 0; font-size: {{TAM_FONTE_TITULO}}px; color: #000;">{{TITULO_DOC}}</h2>
  </div>

  <!-- Cabeçalho Tabela -->
  <table style="width: 100%; border-collapse: collapse; border: none; font-size: 11px; font-weight: bold; margin-bottom: 5px; color: #000;">
    <tr>
      <td style="text-align: left; border: none; padding: 0; width: 20%;">SETOR: UCINCA</td>
      <td style="text-align: center; border: none; padding: 0; width: 60%;">DATA: {{DATA_EXTENSO}}</td>
      <td style="text-align: right; border: none; padding: 0; width: 20%; white-space: nowrap;">DIA: {{DIA_SEMANA}}</td>
    </tr>
  </table>

  <!-- TABELA MANHÃ -->
  <table style="width: 100%; border-collapse: collapse; border: 1px solid black; font-size: {{TAM_FONTE_TABELA}}px; margin-bottom: 5px; color: #000;">
    <thead>
      <tr style="background-color: {{COR_CAB_MANHA}};">
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: {{W_NUMERO}}px;">Nº</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; text-align: left; width: {{W_NOME}}px;">MANHÃ - ENFERMEIROS</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: {{W_OCORRENCIA}}px;">TROCAS, BH E REMANEJAMENTOS</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: {{W_ATIVIDADE}}px;">DISTRIBUIÇÃO DAS ATIVIDADES</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: {{W_REDIST}}px;">REDISTRIBUIÇÃO DAS ATIVIDADES</th>
        <th colspan="3" style="border: 1px solid black; padding: 2px; text-align: center;">HORÁRIO</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: {{W_ASSINATURA}}px;">ASSINATURA FUNCIONÁRIO</th>
      </tr>
      <tr style="background-color: {{COR_CAB_MANHA}};">
         <th style="border: 1px solid black; padding: 2px; width: {{W_HORARIO}}px;">ENTRADA</th>
         <th style="border: 1px solid black; padding: 2px; width: {{W_HORARIO}}px;">INTERVALO</th>
         <th style="border: 1px solid black; padding: 2px; width: {{W_HORARIO}}px;">SAÍDA</th>
      </tr>
    </thead>
    <tbody>
      {{TABELA_ENFERMEIROS_MANHA}}
      <tr style="background-color: {{COR_CAB_MANHA}};">
        <td style="border: 1px solid black; padding: 2px;">&nbsp;</td>
        <td style="border: 1px solid black; padding: 2px; font-weight: bold;">TÉCNICOS</td>
        <td style="border: 1px solid black; padding: 2px;" colspan="7"></td>
      </tr>
      {{TABELA_TECNICOS_MANHA}}
    </tbody>
  </table>
  <div style="margin-top: 5px; font-size: {{TAM_FONTE_TABELA}}px; font-weight: bold; padding-top: 2px; color: #000; margin-bottom: 10px;">
    ENFERMEIRO RESPONSÁVEL PELA DISTRIBUIÇÃO: ______________________________ CARIMBO/ASSINATURA
  </div>

  <!-- TABELA TARDE -->
  <table style="width: 100%; border-collapse: collapse; border: 1px solid black; font-size: {{TAM_FONTE_TABELA}}px; margin-bottom: 5px; color: #000;">
    <thead>
      <tr style="background-color: {{COR_CAB_TARDE}};">
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: {{W_NUMERO}}px;">Nº</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; text-align: left; width: {{W_NOME}}px;">TARDE - ENFERMEIROS</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: {{W_OCORRENCIA}}px;">TROCAS, BH E REMANEJAMENTOS</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: {{W_ATIVIDADE}}px;">DISTRIBUIÇÃO DAS ATIVIDADES</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: {{W_REDIST}}px;">REDISTRIBUIÇÃO DAS ATIVIDADES</th>
        <th colspan="3" style="border: 1px solid black; padding: 2px; text-align: center;">HORÁRIO</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: {{W_ASSINATURA}}px;">ASSINATURA FUNCIONÁRIO</th>
      </tr>
      <tr style="background-color: {{COR_CAB_TARDE}};">
         <th style="border: 1px solid black; padding: 2px; width: {{W_HORARIO}}px;">ENTRADA</th>
         <th style="border: 1px solid black; padding: 2px; width: {{W_HORARIO}}px;">INTERVALO</th>
         <th style="border: 1px solid black; padding: 2px; width: {{W_HORARIO}}px;">SAÍDA</th>
      </tr>
    </thead>
    <tbody>
      {{TABELA_ENFERMEIROS_TARDE}}
      <tr style="background-color: {{COR_CAB_TARDE}};">
        <td style="border: 1px solid black; padding: 2px;">&nbsp;</td>
        <td style="border: 1px solid black; padding: 2px; font-weight: bold;">TÉCNICOS</td>
        <td style="border: 1px solid black; padding: 2px;" colspan="7"></td>
      </tr>
      {{TABELA_TECNICOS_TARDE}}
    </tbody>
  </table>
  <div style="margin-top: 5px; font-size: {{TAM_FONTE_TABELA}}px; font-weight: bold; padding-top: 2px; color: #000; margin-bottom: 10px;">
    ENFERMEIRO RESPONSÁVEL PELA DISTRIBUIÇÃO: ______________________________ CARIMBO/ASSINATURA
  </div>

  <!-- TABELA NOITE -->
  <table style="width: 100%; border-collapse: collapse; border: 1px solid black; font-size: {{TAM_FONTE_TABELA}}px; margin-bottom: 5px; color: #000;">
    <thead>
      <tr style="background-color: {{COR_CAB_NOITE}};">
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: {{W_NUMERO}}px;">Nº</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; text-align: left; width: {{W_NOME}}px;">NOITE - ENFERMEIROS</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: {{W_OCORRENCIA}}px;">TROCAS, BH E REMANEJAMENTOS</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: {{W_ATIVIDADE}}px;">DISTRIBUIÇÃO DAS ATIVIDADES</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: {{W_REDIST}}px;">REDISTRIBUIÇÃO DAS ATIVIDADES</th>
        <th colspan="3" style="border: 1px solid black; padding: 2px; text-align: center;">HORÁRIO</th>
        <th rowspan="2" style="border: 1px solid black; padding: 2px; width: {{W_ASSINATURA}}px;">ASSINATURA FUNCIONÁRIO</th>
      </tr>
      <tr style="background-color: {{COR_CAB_NOITE}};">
         <th style="border: 1px solid black; padding: 2px; width: {{W_HORARIO}}px;">ENTRADA</th>
         <th style="border: 1px solid black; padding: 2px; width: {{W_HORARIO}}px;">INTERVALO</th>
         <th style="border: 1px solid black; padding: 2px; width: {{W_HORARIO}}px;">SAÍDA</th>
      </tr>
    </thead>
    <tbody>
      {{TABELA_ENFERMEIROS_NOITE}}
      <tr style="background-color: {{COR_CAB_NOITE}};">
        <td style="border: 1px solid black; padding: 2px;">&nbsp;</td>
        <td style="border: 1px solid black; padding: 2px; font-weight: bold;">TÉCNICOS</td>
        <td style="border: 1px solid black; padding: 2px;" colspan="7"></td>
      </tr>
      {{TABELA_TECNICOS_NOITE}}
    </tbody>
  </table>

  <div style="margin-top: 5px; font-size: {{TAM_FONTE_TABELA}}px; font-weight: bold; border-top: 1px solid black; padding-top: 5px; color: #000;">
    ENFERMEIRO RESPONSÁVEL PELA DISTRIBUIÇÃO: ______________________________ CARIMBO/ASSINATURA
  </div>
</div>
`;

// Exporta os templates disponíveis
export const AVAILABLE_TEMPLATES: Record<string, { name: string, content: string }> = {
  'standard': { name: 'Padrão', content: TEMPLATE_STANDARD },
  'uti_neo': { name: 'UTI NEO', content: TEMPLATE_UTI_NEO },
  'uca': { name: 'UCA', content: TEMPLATE_UCA },
  'ucinco': { name: 'UCINCO', content: TEMPLATE_UCINCO },
  'ucinca': { name: 'UCINCA', content: TEMPLATE_UCINCA }
};

// Mantém o default apontando para o Padrão para novas sessões
export const DEFAULT_BOOK_TEMPLATE = TEMPLATE_STANDARD;
