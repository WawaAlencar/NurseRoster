
import React, { useState, useEffect } from 'react';
import { Employee, ShiftType, EmployeeCategory } from './types';
import { AVAILABLE_TEMPLATES, DEFAULT_LAYOUT_CONFIG } from './constants';
import { Printer, RotateCcw, Save, FileText, Download, FileType, Settings, PenTool, LayoutTemplate, ChevronDown, ChevronUp, Type, Palette, Ruler } from 'lucide-react';
import { generateDocx } from './utils/docxGenerator';

interface DocumentGeneratorProps {
  employees: Employee[];
  month: number;
  year: number;
  selectedTemplateKey: string;
  onTemplateChange: (key: string) => void;
}

interface LayoutConfig {
    // Textos
    titleReport: string;
    col6Name: string;
    col7Name: string;
    
    // Dimensões
    numberWidth: number;
    nameWidth: number;
    occurrencesWidth: number;
    activitiesWidth: number;
    redistWidth: number;
    timeWidth: number;
    signatureWidth: number;
    
    // Fontes
    fontSizeTitle: number;
    fontSizeTable: number;
    
    // Cores
    colorMorningHeader: string;
    colorMorningRow: string;
    colorAfternoonHeader: string;
    colorAfternoonRow: string;
    colorNightHeader: string;
    colorNightRow: string;
}

const DocumentGenerator: React.FC<DocumentGeneratorProps> = ({ employees, month, year, selectedTemplateKey, onTemplateChange }) => {
  
  // Initialize template based on the selected key from props
  // CHANGED: Added 'v7' to key for new customizable Standard template
  const [template, setTemplate] = useState<string>(() => {
    const saved = localStorage.getItem(`nurse_roster_template_v7_${selectedTemplateKey}`);
    return saved || AVAILABLE_TEMPLATES[selectedTemplateKey].content;
  });
  
  const [previewDay, setPreviewDay] = useState<number>(1);
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [isGeneratingDocx, setIsGeneratingDocx] = useState(false);
  
  // Layout Config State
  const [layoutConfig, setLayoutConfig] = useState<LayoutConfig>(DEFAULT_LAYOUT_CONFIG);

  // Accordion state for settings
  const [expandedSection, setExpandedSection] = useState<string | null>('dimensions');

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // Update template content state whenever the selected key changes
  useEffect(() => {
    const saved = localStorage.getItem(`nurse_roster_template_v7_${selectedTemplateKey}`);
    setTemplate(saved || AVAILABLE_TEMPLATES[selectedTemplateKey].content);
  }, [selectedTemplateKey]);

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onTemplateChange(e.target.value);
  };

  // Save template to local storage
  const handleSaveTemplate = () => {
    localStorage.setItem(`nurse_roster_template_v7_${selectedTemplateKey}`, template);
    alert(`Modelo ${AVAILABLE_TEMPLATES[selectedTemplateKey].name} salvo com sucesso!`);
  };

  const handleResetTemplate = () => {
    if (confirm(`Deseja restaurar o modelo padrão de ${AVAILABLE_TEMPLATES[selectedTemplateKey].name} e limpar as personalizações?`)) {
      const defaultContent = AVAILABLE_TEMPLATES[selectedTemplateKey].content;
      setTemplate(defaultContent);
      setLayoutConfig(DEFAULT_LAYOUT_CONFIG); // Reset config too
      localStorage.removeItem(`nurse_roster_template_v7_${selectedTemplateKey}`);
    }
  };

  // --- Mail Merge Logic for HTML Preview ---

  const isMorning = (code: string) => ['D6', 'M15', 'PR2'].includes(code);
  const isAfternoon = (code: string) => ['D6', 'T15', 'PR2'].includes(code);
  const isNight = (code: string) => ['N8', 'PR2'].includes(code);

  const generateRowHtml = (index: number, name: string) => {
    return `
      <tr>
        <td style="border: 1px solid black; padding: 4px; text-align: center; color: #000;">${index}</td>
        <td style="border: 1px solid black; padding: 4px; color: #000;">${name}</td>
        <td style="border: 1px solid black; padding: 4px;"></td>
        <td style="border: 1px solid black; padding: 4px;"></td>
        <td style="border: 1px solid black; padding: 4px;"></td>
        <td style="border: 1px solid black; padding: 4px;"></td>
        <td style="border: 1px solid black; padding: 4px;"></td>
        <td style="border: 1px solid black; padding: 4px;"></td>
        <td style="border: 1px solid black; padding: 4px;"></td>
      </tr>
    `;
  };

  const generateUtiNeoRowHtml = (index: number, name: string) => {
    return `
      <tr>
        <td style="border: 1px solid black; padding: 4px; text-align: center; color: #000;">${index}</td>
        <td style="border: 1px solid black; padding: 4px; color: #000;">${name}</td>
        <td style="border: 1px solid black; padding: 4px;"></td>
        <td style="border: 1px solid black; padding: 4px;"></td>
        <td style="border: 1px solid black; padding: 4px;"></td>
        <td style="border: 1px solid black; padding: 4px;"></td>
        <td style="border: 1px solid black; padding: 4px;"></td>
        <td style="border: 1px solid black; padding: 4px;"></td>
        <td style="border: 1px solid black; padding: 4px;"></td>
        <td style="border: 1px solid black; padding: 4px;"></td>
        <td style="border: 1px solid black; padding: 4px;"></td>
      </tr>
    `;
  };

  const generateUcincoRowHtml = (index: number, name: string) => {
    return `
      <tr>
        <td style="border: 1px solid black; padding: 4px; text-align: center; color: #000;">${index}</td>
        <td style="border: 1px solid black; padding: 4px; color: #000;">${name}</td>
        <td style="border: 1px solid black; padding: 4px;"></td>
        <td style="border: 1px solid black; padding: 4px;"></td>
        <td style="border: 1px solid black; padding: 4px;"></td>
        <td style="border: 1px solid black; padding: 4px;"></td>
        <td style="border: 1px solid black; padding: 4px;"></td>
        <td style="border: 1px solid black; padding: 4px;"></td>
        <td style="border: 1px solid black; padding: 4px;"></td>
        <td style="border: 1px solid black; padding: 4px;"></td>
      </tr>
    `;
  };

  const generateUcaRowHtml = (index: number, name: string) => {
    return `
      <tr>
        <td style="border: 1px solid black; padding: 4px; color: #000;">${index}. ${name}</td>
        <td style="border: 1px solid black; padding: 4px;"></td>
        <td style="border: 1px solid black; padding: 4px;"></td>
        <td style="border: 1px solid black; padding: 4px;"></td>
        <td style="border: 1px solid black; padding: 4px;"></td>
        <td style="border: 1px solid black; padding: 4px;"></td>
        <td style="border: 1px solid black; padding: 4px;"></td>
        <td style="border: 1px solid black; padding: 4px;"></td>
        <td style="border: 1px solid black; padding: 4px;"></td>
      </tr>
    `;
  };

  const padRows = (currentRows: string, count: number, minRows: number, rowGen: (index: number, name: string) => string) => {
    let rows = currentRows;
    for (let i = count + 1; i <= minRows; i++) {
        if (rowGen === generateUcaRowHtml) {
             rows += `<tr><td style="border: 1px solid black; padding: 4px; color: #000;">${i}.</td><td style="border: 1px solid black; padding: 4px;"></td><td style="border: 1px solid black; padding: 4px;"></td><td style="border: 1px solid black; padding: 4px;"></td><td style="border: 1px solid black; padding: 4px;"></td><td style="border: 1px solid black; padding: 4px;"></td><td style="border: 1px solid black; padding: 4px;"></td><td style="border: 1px solid black; padding: 4px;"></td><td style="border: 1px solid black; padding: 4px;"></td></tr>`;
        } else {
             rows += rowGen(i, "");
        }
    }
    return rows;
  };

  const formatName = (emp: Employee) => {
    let name = emp.name.toUpperCase();
    if (emp.category.includes('APH')) name += ' (APH)';
    return name;
  };

  const processTemplateForDay = (day: number): string => {
    let content = template;
    
    // Replace Variables
    content = content.replace(/{{W_NUMERO}}/g, layoutConfig.numberWidth.toString());
    content = content.replace(/{{W_NOME}}/g, layoutConfig.nameWidth.toString());
    content = content.replace(/{{W_OCORRENCIA}}/g, layoutConfig.occurrencesWidth.toString());
    content = content.replace(/{{W_ATIVIDADE}}/g, layoutConfig.activitiesWidth.toString());
    content = content.replace(/{{W_REDIST}}/g, layoutConfig.redistWidth.toString());
    content = content.replace(/{{W_HORARIO}}/g, layoutConfig.timeWidth.toString());
    content = content.replace(/{{W_ASSINATURA}}/g, layoutConfig.signatureWidth.toString());
    content = content.replace(/{{TITULO_DOC}}/g, layoutConfig.titleReport);
    content = content.replace(/{{NOME_COLUNA_6}}/g, layoutConfig.col6Name);
    content = content.replace(/{{NOME_COLUNA_7}}/g, layoutConfig.col7Name);
    content = content.replace(/{{NOME_SETOR}}/g, AVAILABLE_TEMPLATES[selectedTemplateKey].name);
    content = content.replace(/{{TAM_FONTE_TITULO}}/g, layoutConfig.fontSizeTitle.toString());
    content = content.replace(/{{TAM_FONTE_TABELA}}/g, layoutConfig.fontSizeTable.toString());
    content = content.replace(/{{COR_CAB_MANHA}}/g, layoutConfig.colorMorningHeader);
    content = content.replace(/{{COR_LIN_MANHA}}/g, layoutConfig.colorMorningRow);
    content = content.replace(/{{COR_CAB_TARDE}}/g, layoutConfig.colorAfternoonHeader);
    content = content.replace(/{{COR_LIN_TARDE}}/g, layoutConfig.colorAfternoonRow);
    content = content.replace(/{{COR_CAB_NOITE}}/g, layoutConfig.colorNightHeader);
    content = content.replace(/{{COR_LIN_NOITE}}/g, layoutConfig.colorNightRow);

    const date = new Date(year, month, day); 
    const dayOfWeek = date.toLocaleDateString('pt-BR', { weekday: 'long' });
    const fullDate = date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
    content = content.replace(/{{DATA_EXTENSO}}/g, fullDate.toUpperCase());
    content = content.replace(/{{DIA_SEMANA}}/g, dayOfWeek.toUpperCase());

    const isCompact = ['ucinco', 'ucinca'].includes(selectedTemplateKey);
    const isUCA = ['uca'].includes(selectedTemplateKey);
    const isMultiPageNovo = ['standard', 'uti_neo'].includes(selectedTemplateKey);
    
    const minNurseRows = (isCompact || isUCA || isMultiPageNovo) ? 2 : 3;
    const minTechRows = isUCA ? 5 : (isCompact ? 4 : 8);

    let rowGen = generateRowHtml;
    if (isUCA) rowGen = generateUcaRowHtml;
    else if (selectedTemplateKey === 'uti_neo' || selectedTemplateKey === 'standard') rowGen = generateUtiNeoRowHtml;
    else if (selectedTemplateKey === 'ucinco') rowGen = generateUcincoRowHtml;

    const getEmployeesByShift = (categories: EmployeeCategory[], checkFn: (code: string) => boolean) => {
      return employees.filter(emp => {
        if (!categories.includes(emp.category)) return false;
        const code = emp.schedule[day];
        return code && checkFn(code as string);
      }).sort((a, b) => {
        const aIsAPH = a.category.includes('APH');
        const bIsAPH = b.category.includes('APH');
        if (aIsAPH !== bIsAPH) return aIsAPH ? 1 : -1;
        return 0;
      });
    };

    // Table Generation
    const shifts = [
        { key: 'MANHÃ', replace: 'MANHA' },
        { key: 'TARDE', replace: 'TARDE' },
        { key: 'NOITE', replace: 'NOITE' }
    ];

    shifts.forEach(s => {
        const isShift = s.key === 'MANHÃ' ? isMorning : (s.key === 'TARDE' ? isAfternoon : isNight);
        const nurses = getEmployeesByShift(['Enfermeiras', 'Enfermeiras - APH'], isShift);
        const techs = getEmployeesByShift(['Técnicas de Enfermagem', 'Técnicas de Enfermagem - APH'], isShift);

        content = content.replace(new RegExp(`{{TABELA_ENFERMEIROS_${s.replace}}}`, 'g'), padRows(nurses.map((e, i) => rowGen(i + 1, formatName(e))).join(''), nurses.length, minNurseRows, rowGen));
        content = content.replace(new RegExp(`{{TABELA_TECNICOS_${s.replace}}}`, 'g'), padRows(techs.map((e, i) => rowGen(i + 1, formatName(e))).join(''), techs.length, minTechRows, rowGen));
    });

    return content;
  };

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  useEffect(() => {
    setPreviewHtml(processTemplateForDay(previewDay));
  }, [previewDay, template, employees, layoutConfig, month, year, selectedTemplateKey]);

  useEffect(() => {
      if (previewDay > daysInMonth) setPreviewDay(1);
  }, [daysInMonth, previewDay]);

  const handleDownloadDocx = async () => {
    setIsGeneratingDocx(true);
    try {
      const sectorName = AVAILABLE_TEMPLATES[selectedTemplateKey].name;
      await generateDocx(employees, month, year, sectorName, layoutConfig);
    } catch (error) {
      console.error(error);
      alert("Erro ao gerar arquivo Word.");
    } finally {
      setIsGeneratingDocx(false);
    }
  };

  const pages = previewHtml.split('{{QUEBRA_DE_PAGINA}}');

  return (
    <div className="flex flex-col gap-6 w-full pb-12">
      
      <div className="w-full bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
             <div className="bg-indigo-100 p-2 rounded-lg text-indigo-700">
                <LayoutTemplate size={20} />
             </div>
             <div className="flex flex-col">
               <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Modelo de Impressão</label>
               <select value={selectedTemplateKey} onChange={handleTemplateChange} className="text-lg font-bold text-gray-800 bg-transparent outline-none cursor-pointer hover:text-indigo-600 transition-colors">
                  {Object.entries(AVAILABLE_TEMPLATES).map(([key, tmpl]) => (<option key={key} value={key}>{tmpl.name}</option>))}
               </select>
             </div>
          </div>
          <div className="flex gap-3">
               <button onClick={handleDownloadDocx} disabled={isGeneratingDocx} className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 transition-colors font-bold disabled:opacity-50">
                 {isGeneratingDocx ? <span className="animate-spin">⌛</span> : <FileType size={20} />}
                 Baixar Livro {AVAILABLE_TEMPLATES[selectedTemplateKey].name} (.docx)
               </button>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        <div className="lg:col-span-9 order-2 lg:order-1 w-full bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex flex-wrap justify-between items-center mb-4 border-b border-gray-100 pb-4 gap-4">
               <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2">
                   <label className="text-sm font-bold text-gray-700">Dia:</label>
                   <input type="number" min={1} max={daysInMonth} value={previewDay} onChange={(e) => setPreviewDay(Number(e.target.value))} className="w-16 border border-gray-300 bg-white text-gray-900 shadow-none rounded p-1 text-center font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                   <span className="text-sm text-gray-500">/ {daysInMonth}</span>
                 </div>
                 <span className="text-xs text-gray-500 hidden sm:inline">Visualização de impressão A4 (Paisagem).</span>
               </div>
            </div>
            <div className="w-full overflow-x-auto bg-gray-100 p-8 rounded border border-gray-200 flex flex-col items-center gap-8">
               {pages.map((pageContent, index) => (
                  <div key={index} className="bg-white shadow-lg flex-shrink-0 relative" style={{ width: '297mm', minHeight: '210mm', transform: 'scale(0.9)', transformOrigin: 'top center', padding: 0, boxSizing: 'border-box' }}>
                    <div className="absolute -right-12 top-0 text-gray-400 font-bold text-xl">#{index + 1}</div>
                    <div dangerouslySetInnerHTML={{ __html: pageContent }} />
                  </div>
               ))}
            </div>
        </div>

        <div className="lg:col-span-3 order-1 lg:order-2 w-full flex flex-col gap-4 sticky top-24">
             <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2 text-sm"><Settings size={18} className="text-orange-600" />Editor de Layout</h3>
                </div>

                {/* Group 1: Dimensions */}
                <div className="border rounded-lg mb-3 overflow-hidden">
                   <button onClick={() => toggleSection('dimensions')} className="w-full flex justify-between items-center p-2 bg-gray-50 hover:bg-gray-100 transition-colors">
                      <span className="font-bold text-xs text-gray-700 flex items-center gap-2"><Ruler size={14} /> Dimensões (px)</span>
                      {expandedSection === 'dimensions' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                   </button>
                   {expandedSection === 'dimensions' && (
                     <div className="p-3 bg-white space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar">
                        <div className="grid grid-cols-2 gap-2">
                            <div><label className="block text-[10px] font-bold text-gray-500 mb-1">Nº</label><input type="number" value={layoutConfig.numberWidth} onChange={(e) => setLayoutConfig(prev => ({...prev, numberWidth: Number(e.target.value)}))} className="w-full border border-gray-300 rounded p-1.5 text-xs focus:ring-1 focus:ring-orange-500 outline-none bg-white text-gray-900" /></div>
                            <div><label className="block text-[10px] font-bold text-gray-500 mb-1">Horários</label><input type="number" value={layoutConfig.timeWidth} onChange={(e) => setLayoutConfig(prev => ({...prev, timeWidth: Number(e.target.value)}))} className="w-full border border-gray-300 rounded p-1.5 text-xs focus:ring-1 focus:ring-orange-500 outline-none bg-white text-gray-900" /></div>
                        </div>
                        <div><label className="block text-[10px] font-bold text-gray-500 mb-1">Nome Profissionais</label><input type="number" value={layoutConfig.nameWidth} onChange={(e) => setLayoutConfig(prev => ({...prev, nameWidth: Number(e.target.value)}))} className="w-full border border-gray-300 rounded p-1.5 text-xs focus:ring-1 focus:ring-orange-500 outline-none bg-white text-gray-900" /></div>
                        <div><label className="block text-[10px] font-bold text-gray-500 mb-1">Ocorrências/Trocas</label><input type="number" value={layoutConfig.occurrencesWidth} onChange={(e) => setLayoutConfig(prev => ({...prev, occurrencesWidth: Number(e.target.value)}))} className="w-full border border-gray-300 rounded p-1.5 text-xs focus:ring-1 focus:ring-orange-500 outline-none bg-white text-gray-900" /></div>
                        <div><label className="block text-[10px] font-bold text-gray-500 mb-1">Atividades</label><input type="number" value={layoutConfig.activitiesWidth} onChange={(e) => setLayoutConfig(prev => ({...prev, activitiesWidth: Number(e.target.value)}))} className="w-full border border-gray-300 rounded p-1.5 text-xs focus:ring-1 focus:ring-orange-500 outline-none bg-white text-gray-900" /></div>
                        <div><label className="block text-[10px] font-bold text-gray-500 mb-1">Redistribuição</label><input type="number" value={layoutConfig.redistWidth} onChange={(e) => setLayoutConfig(prev => ({...prev, redistWidth: Number(e.target.value)}))} className="w-full border border-gray-300 rounded p-1.5 text-xs focus:ring-1 focus:ring-orange-500 outline-none bg-white text-gray-900" /></div>
                        <div><label className="block text-[10px] font-bold text-gray-500 mb-1">Assinatura</label><input type="number" value={layoutConfig.signatureWidth} onChange={(e) => setLayoutConfig(prev => ({...prev, signatureWidth: Number(e.target.value)}))} className="w-full border border-gray-300 rounded p-1.5 text-xs focus:ring-1 focus:ring-orange-500 outline-none bg-white text-gray-900" /></div>
                     </div>
                   )}
                </div>

                {/* Group 2: Colors */}
                <div className="border rounded-lg mb-3 overflow-hidden">
                   <button onClick={() => toggleSection('colors')} className="w-full flex justify-between items-center p-2 bg-gray-50 hover:bg-gray-100 transition-colors">
                      <span className="font-bold text-xs text-gray-700 flex items-center gap-2"><Palette size={14} /> Cores</span>
                      {expandedSection === 'colors' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                   </button>
                   {expandedSection === 'colors' && (
                     <div className="p-3 bg-white space-y-3">
                        <div className="space-y-3">
                           <div><div className="font-bold text-[10px] text-gray-400 border-b pb-1 mb-1">MANHÃ</div><div className="flex justify-between items-center"><div className="flex flex-col items-center"><label className="text-[10px] text-gray-500 mb-1">Cab.</label><input type="color" value={layoutConfig.colorMorningHeader} onChange={(e) => setLayoutConfig(prev => ({...prev, colorMorningHeader: e.target.value}))} className="w-6 h-6 p-0 border-0 rounded cursor-pointer bg-white" /></div><div className="flex flex-col items-center"><label className="text-[10px] text-gray-500 mb-1">Lin.</label><input type="color" value={layoutConfig.colorMorningRow} onChange={(e) => setLayoutConfig(prev => ({...prev, colorMorningRow: e.target.value}))} className="w-6 h-6 p-0 border-0 rounded cursor-pointer bg-white" /></div></div></div>
                           <div><div className="font-bold text-[10px] text-gray-400 border-b pb-1 mb-1">TARDE</div><div className="flex justify-between items-center"><div className="flex flex-col items-center"><label className="text-[10px] text-gray-500 mb-1">Cab.</label><input type="color" value={layoutConfig.colorAfternoonHeader} onChange={(e) => setLayoutConfig(prev => ({...prev, colorAfternoonHeader: e.target.value}))} className="w-6 h-6 p-0 border-0 rounded cursor-pointer bg-white" /></div><div className="flex flex-col items-center"><label className="text-[10px] text-gray-500 mb-1">Lin.</label><input type="color" value={layoutConfig.colorAfternoonRow} onChange={(e) => setLayoutConfig(prev => ({...prev, colorAfternoonRow: e.target.value}))} className="w-6 h-6 p-0 border-0 rounded cursor-pointer bg-white" /></div></div></div>
                           <div><div className="font-bold text-[10px] text-gray-400 border-b pb-1 mb-1">NOITE</div><div className="flex justify-between items-center"><div className="flex flex-col items-center"><label className="text-[10px] text-gray-500 mb-1">Cab.</label><input type="color" value={layoutConfig.colorNightHeader} onChange={(e) => setLayoutConfig(prev => ({...prev, colorNightHeader: e.target.value}))} className="w-6 h-6 p-0 border-0 rounded cursor-pointer bg-white" /></div><div className="flex flex-col items-center"><label className="text-[10px] text-gray-500 mb-1">Lin.</label><input type="color" value={layoutConfig.colorNightRow} onChange={(e) => setLayoutConfig(prev => ({...prev, colorNightRow: e.target.value}))} className="w-6 h-6 p-0 border-0 rounded cursor-pointer bg-white" /></div></div></div>
                        </div>
                     </div>
                   )}
                </div>

                {/* Group 3: Typography & Text */}
                <div className="border rounded-lg mb-3 overflow-hidden">
                   <button onClick={() => toggleSection('typography')} className="w-full flex justify-between items-center p-2 bg-gray-50 hover:bg-gray-100 transition-colors">
                      <span className="font-bold text-xs text-gray-700 flex items-center gap-2"><Type size={14} /> Textos</span>
                      {expandedSection === 'typography' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                   </button>
                   {expandedSection === 'typography' && (
                     <div className="p-3 bg-white space-y-3">
                        <div><label className="block text-[10px] font-bold text-gray-500 mb-1">Título do Relatório</label><textarea value={layoutConfig.titleReport} onChange={(e) => setLayoutConfig(prev => ({...prev, titleReport: e.target.value}))} className="w-full border border-gray-300 rounded p-1.5 text-xs focus:ring-1 focus:ring-orange-500 outline-none bg-white text-gray-900 resize-none h-16" /></div>
                        
                        {selectedTemplateKey === 'standard' && (
                          <div className="space-y-2 pt-2 border-t border-gray-100">
                             <div><label className="block text-[10px] font-bold text-indigo-600 mb-1">Nome Coluna 6</label><input value={layoutConfig.col6Name} onChange={(e) => setLayoutConfig(prev => ({...prev, col6Name: e.target.value.toUpperCase()}))} className="w-full border border-gray-300 rounded p-1.5 text-xs outline-none bg-white text-gray-900" /></div>
                             <div><label className="block text-[10px] font-bold text-indigo-600 mb-1">Nome Coluna 7</label><input value={layoutConfig.col7Name} onChange={(e) => setLayoutConfig(prev => ({...prev, col7Name: e.target.value.toUpperCase()}))} className="w-full border border-gray-300 rounded p-1.5 text-xs outline-none bg-white text-gray-900" /></div>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-2">
                            <div><label className="block text-[10px] font-bold text-gray-500 mb-1">Fonte Título</label><input type="number" value={layoutConfig.fontSizeTitle} onChange={(e) => setLayoutConfig(prev => ({...prev, fontSizeTitle: Number(e.target.value)}))} className="w-full border border-gray-300 rounded p-1.5 text-xs focus:ring-1 focus:ring-orange-500 outline-none bg-white text-gray-900" /></div>
                             <div><label className="block text-[10px] font-bold text-gray-500 mb-1">Fonte Tabela</label><input type="number" value={layoutConfig.fontSizeTable} onChange={(e) => setLayoutConfig(prev => ({...prev, fontSizeTable: Number(e.target.value)}))} className="w-full border border-gray-300 rounded p-1.5 text-xs focus:ring-1 focus:ring-orange-500 outline-none bg-white text-gray-900" /></div>
                        </div>
                     </div>
                   )}
                </div>

             </div>
        </div>

      </div>

      <div className="w-full bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800 flex items-center gap-2"><FileText size={20} className="text-indigo-600" />Editor HTML (Avançado)</h3>
                <div className="flex gap-2">
                    <button onClick={handleResetTemplate} className="p-2 text-gray-500 hover:text-red-500 rounded hover:bg-gray-100" title="Restaurar Padrão"><RotateCcw size={18} /></button>
                    <button onClick={handleSaveTemplate} className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700"><Save size={16} /> Salvar para {AVAILABLE_TEMPLATES[selectedTemplateKey].name}</button>
                </div>
            </div>
            <textarea className="w-full h-64 font-mono text-xs border border-gray-300 bg-white text-gray-900 shadow-none rounded p-4 focus:outline-none focus:ring-2 focus:ring-indigo-500" value={template} onChange={(e) => setTemplate(e.target.value)} spellCheck={false} />
        </div>
    </div>
  );
};

export default DocumentGenerator;
