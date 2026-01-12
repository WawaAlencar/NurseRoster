import React, { useState, useCallback, useMemo } from 'react';
import { Plus, FileSpreadsheet, Eraser, FileText, LayoutGrid, Users } from 'lucide-react';
import { BarChart, Bar, Tooltip, ResponsiveContainer } from 'recharts';

import RosterTable from './components/RosterTable';
import DocumentGenerator from './components/DocumentGenerator';
import { Employee, ShiftType, EmployeeCategory } from './types';
import { CATEGORIES, CATEGORY_THEMES, SHIFT_COLORS, INITIAL_ROWS_PER_CATEGORY, MONTH_NAMES } from './constants';

// Utility for ID generation
const generateId = () => Math.random().toString(36).substr(2, 9);

// Helper to create empty rows
const createEmptyRows = (category: EmployeeCategory, count: number): Employee[] => {
  return Array.from({ length: count }).map(() => ({
    id: generateId(),
    name: '',
    category,
    schedule: {}
  }));
};

const CODE_LEGEND: Record<string, string> = {
  'N8': 'Noturno',
  'D6': 'Diurno',
  'PR2': '24Hrs',
  'M15': 'Manhã',
  'T15': 'Tarde',
  'DSR': 'Folga',
  'FE': 'Férias',
  'L': 'Licença'
};

const App: React.FC = () => {
  // -- State --
  const [activeTab, setActiveTab] = useState<'roster' | 'generator'>('roster');
  
  // Persist selected template key so it doesn't reset when switching tabs
  const [currentTemplateKey, setCurrentTemplateKey] = useState<string>('uti_neo');
  
  // Date Selection State
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Calculate Days in Month dynamically
  const daysInMonth = useMemo(() => {
    return new Date(selectedYear, selectedMonth + 1, 0).getDate();
  }, [selectedYear, selectedMonth]);

  // Initialize with empty rows for each category
  const [employees, setEmployees] = useState<Employee[]>(() => {
    let initial: Employee[] = [];
    CATEGORIES.forEach(cat => {
      initial = [...initial, ...createEmptyRows(cat, INITIAL_ROWS_PER_CATEGORY)];
    });
    return initial;
  });
  
  const [error, setError] = useState<string | null>(null);

  // -- Handlers --

  const handleAddEmptyRow = (e: React.MouseEvent, category: EmployeeCategory) => {
    e.preventDefault(); 
    const newRow: Employee = {
      id: generateId(),
      name: '',
      category: category,
      schedule: {}
    };
    setEmployees(prev => {
        const categoryIndices = prev.map((emp, idx) => emp.category === category ? idx : -1).filter(i => i !== -1);
        const lastIndex = categoryIndices.length > 0 ? Math.max(...categoryIndices) : prev.length - 1;
        
        const newEmpList = [...prev];
        newEmpList.splice(lastIndex + 1, 0, newRow);
        return newEmpList;
    });
  };

  const handleUpdateName = useCallback((id: string, newName: string) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, name: newName } : e));
  }, []);

  const handleRemoveEmployee = (id: string) => {
    setEmployees(prev => prev.filter(e => e.id !== id));
  };
  
  const handleClearCategory = (e: React.MouseEvent, category: EmployeeCategory) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Reset category to initial empty state without confirmation to ensure immediate feedback
    setEmployees(prev => {
        const otherCategories = prev.filter(e => e.category !== category);
        const newEmpties = createEmptyRows(category, INITIAL_ROWS_PER_CATEGORY);
        return [...otherCategories, ...newEmpties];
    });
  };

  const handleUpdateShift = useCallback((employeeId: string, day: number, code: ShiftType) => {
    setEmployees(prev => prev.map(emp => {
      if (emp.id === employeeId) {
        const newSchedule = { ...emp.schedule };
        if (code === ShiftType.OFF || code.trim() === '') {
          delete newSchedule[day];
        } else {
          newSchedule[day] = code;
        }
        return { ...emp, schedule: newSchedule };
      }
      return emp;
    }));
  }, []);

  const handleMoveRow = useCallback((category: EmployeeCategory, fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;

    setEmployees(prev => {
      // 1. Extract employees of the target category and others
      const categoryEmployees = prev.filter(e => e.category === category);
      const otherEmployees = prev.filter(e => e.category !== category);

      // 2. Validate indices
      if (fromIndex < 0 || fromIndex >= categoryEmployees.length || toIndex < 0 || toIndex >= categoryEmployees.length) {
        return prev;
      }

      // 3. Reorder within the category
      const updatedCategoryEmployees = [...categoryEmployees];
      const [movedItem] = updatedCategoryEmployees.splice(fromIndex, 1);
      updatedCategoryEmployees.splice(toIndex, 0, movedItem);

      // 4. Recombine. Note: This simply appends the reordered category to others. 
      // Since the App renders based on the CATEGORIES constant loop, the strict order in the 'employees' array 
      // relative to other categories doesn't matter for display, only the order *within* the category matters.
      return [...otherEmployees, ...updatedCategoryEmployees];
    });
  }, []);

  const handleSmartPaste = useCallback((
    text: string, 
    category: EmployeeCategory, 
    startRowIndex: number, // Index relative to the category list
    type: 'NAME' | 'SHIFT', 
    startDay: number
  ) => {
    const rows = text.split(/\r?\n/).filter(r => r.trim() !== '');
    if (rows.length === 0) return;

    setEmployees(prev => {
        // 1. Get employees for this category and others
        const categoryEmployees = prev.filter(e => e.category === category);
        const otherEmployees = prev.filter(e => e.category !== category);
        
        let updatedCategoryEmployees = [...categoryEmployees];

        // 2. Iterate through pasted rows and update existing or create new
        rows.forEach((rowText, i) => {
            const targetIndex = startRowIndex + i;
            
            // If we run out of rows, create a new one
            if (targetIndex >= updatedCategoryEmployees.length) {
                updatedCategoryEmployees.push({
                    id: generateId(),
                    name: '',
                    category: category,
                    schedule: {}
                });
            }

            const currentEmployee = updatedCategoryEmployees[targetIndex];

            if (type === 'NAME') {
                // Simple Name Paste (Column 0)
                // Remove tabs if they exist, take first part
                const cleanName = rowText.split('\t')[0].trim();
                if (cleanName) {
                    updatedCategoryEmployees[targetIndex] = {
                        ...currentEmployee,
                        name: cleanName
                    };
                }
            } else {
                // Shift Paste (Matrix)
                const cells = rowText.split('\t');
                const newSchedule = { ...currentEmployee.schedule };
                
                cells.forEach((cellValue, colIndex) => {
                    const dayToUpdate = startDay + colIndex;
                    // Stop if we go beyond valid days (simple check, though logic handles any key)
                    // We allow up to 31 even if month has fewer, cleaned up later if needed
                    if (dayToUpdate > 31) return;

                    const rawCode = cellValue.trim().toUpperCase();
                    if (rawCode) {
                        newSchedule[dayToUpdate] = rawCode as ShiftType;
                    } else {
                        // Optional: Clear cell if empty string pasted? 
                        // Let's assume empty string means delete if it was explicit
                        // delete newSchedule[dayToUpdate];
                    }
                });

                updatedCategoryEmployees[targetIndex] = {
                    ...currentEmployee,
                    schedule: newSchedule
                };
            }
        });

        return [...otherEmployees, ...updatedCategoryEmployees];
    });
    setError(null);
  }, []);

  // -- Stats Calculation --
  const statsData = React.useMemo(() => {
    const counts: Record<string, number> = { N8: 0, D6: 0, DSR: 0, FE: 0 };
    employees.forEach(emp => {
      if (!emp.name) return; 
      Object.values(emp.schedule).forEach(code => {
        const key = code as string;
        if (counts[key] !== undefined) {
          counts[key]++;
        }
      });
    });
    
    return [
      { name: 'Noturno (N8)', count: counts.N8, fill: '#bfdbfe' },
      { name: 'Diurno (D6)', count: counts.D6, fill: '#bae6fd' },
      { name: 'DSR', count: counts.DSR, fill: '#ffedd5' },
      { name: 'Férias (FE)', count: counts.FE, fill: '#bbf7d0' },
    ];
  }, [employees]);

  const activeEmployeeCount = employees.filter(e => e.name.trim() !== '').length;

  // Generate simple year options (current -1 to current +5)
  const yearOptions = Array.from({ length: 7 }, (_, i) => new Date().getFullYear() - 1 + i);

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-slate-800 flex flex-col">
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 sticky top-0 z-50 flex flex-col xl:flex-row items-center justify-between gap-4 shadow-sm">
        
        {/* Logo Section */}
        <div className="flex items-center gap-3 min-w-fit">
          <div className="bg-lime-600 p-2 rounded-lg shadow-md">
            <FileSpreadsheet className="text-white" size={24} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-gray-900 leading-none">NurseRoster</h1>
            <p className="text-xs text-gray-500 mt-1">Gestão de Plantões Hospitalares</p>
          </div>
        </div>

        {/* Center Controls: Navigation Tabs */}
        <div className="flex-1 flex justify-center w-full">
            <div className="flex bg-gray-100 p-1 rounded-lg shadow-inner">
               <button 
                 onClick={() => setActiveTab('roster')}
                 className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${activeTab === 'roster' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
               >
                 <LayoutGrid size={16} />
                 Edição da Escala
               </button>
               <button 
                 onClick={() => setActiveTab('generator')}
                 className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${activeTab === 'generator' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
               >
                 <FileText size={16} />
                 Gerador de Livro
               </button>
            </div>
        </div>

        {/* Right Actions: Month/Year Selectors */}
        <div className="flex gap-3 min-w-fit justify-end">
            <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-lg border border-gray-200 shadow-sm">
                <select 
                    value={selectedMonth} 
                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                    className="bg-white border border-gray-300 text-gray-700 text-sm rounded focus:ring-indigo-500 focus:border-indigo-500 block p-1.5 outline-none font-medium cursor-pointer hover:bg-gray-50"
                >
                    {MONTH_NAMES.map((month, index) => (
                        <option key={month} value={index}>{month}</option>
                    ))}
                </select>
                <select 
                    value={selectedYear} 
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    className="bg-white border border-gray-300 text-gray-700 text-sm rounded focus:ring-indigo-500 focus:border-indigo-500 block p-1.5 outline-none font-medium cursor-pointer hover:bg-gray-50"
                >
                    {yearOptions.map(year => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
            </div>
        </div>
      </header>

      <main className="p-6 max-w-[1800px] mx-auto w-full flex-1">

        {/* Error Banner */}
        {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative animate-pulse mb-6" role="alert">
                <span className="block sm:inline">{error}</span>
                <span className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer" onClick={() => setError(null)}>
                    ✕
                </span>
            </div>
        )}

        {activeTab === 'roster' ? (
            <>
              {/* Top Overview: Legend and Stats */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                <div className="lg:col-span-3 bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-center">
                      <div className="flex justify-between items-center mb-3">
                          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Legenda de Códigos</h4>
                      </div>
                      <div className="flex flex-wrap gap-4">
                          {Object.entries(SHIFT_COLORS).map(([code, classes]) => {
                              if (code === ShiftType.OFF) return null;
                              return (
                                  <div key={code} className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded border border-gray-100">
                                      <div className={`w-4 h-4 rounded shadow-sm ${classes.split(' ')[0]} border ${classes.split(' ')[2]}`}></div>
                                      <span className="text-sm font-bold text-gray-700">{code}</span>
                                      <span className="text-xs text-gray-400 hidden sm:inline">
                                        {CODE_LEGEND[code] || code}
                                      </span>
                                  </div>
                              )
                          })}
                      </div>
                </div>
                
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 h-32 flex items-center gap-4">
                      <div className="h-full w-1/2">
                          <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={statsData}>
                                <Bar dataKey="count" fill="#8884d8" radius={[4, 4, 0, 0]} />
                                <Tooltip cursor={{fill: 'transparent'}} />
                              </BarChart>
                          </ResponsiveContainer>
                      </div>
                      <div className="flex flex-col justify-center text-sm text-gray-500">
                          <span className="font-bold text-2xl text-gray-800">{activeEmployeeCount}</span>
                          <span>Profissionais</span>
                      </div>
                </div>
              </div>

              {/* Main Categories Loop */}
              <div className="space-y-12">
                  {CATEGORIES.map((category) => {
                      const theme = CATEGORY_THEMES[category];
                      const categoryEmployees = employees.filter(e => e.category === category);
                      const filledCount = categoryEmployees.filter(e => e.name !== '').length;

                      return (
                          <section key={category} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                              {/* Category Header */}
                              <div className="px-6 py-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/50">
                                  <div className="flex items-center gap-3">
                                      <div className={`p-2 rounded-lg ${theme.iconBg} ${theme.iconColor}`}>
                                          <Users size={20} />
                                      </div>
                                      <h2 className="text-lg font-bold text-gray-800">{category}</h2>
                                      <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full font-medium">
                                          {filledCount} Ativos
                                      </span>
                                  </div>

                                  {/* Actions for this Category */}
                                  <div className="flex items-center gap-3">
                                      <button 
                                          type="button"
                                          onClick={(e) => handleClearCategory(e, category)}
                                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded border border-transparent hover:border-red-100 transition-colors"
                                          title="Limpar nomes e plantões deste setor"
                                      >
                                          <Eraser size={14} />
                                          Limpar Setor
                                      </button>
                                      <button 
                                          type="button"
                                          onClick={(e) => handleAddEmptyRow(e, category)}
                                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded transition-colors"
                                      >
                                          <Plus size={14} />
                                          Add Linha
                                      </button>
                                  </div>
                              </div>

                              {/* Table */}
                              <RosterTable 
                                  employees={categoryEmployees}
                                  headerColorClass={theme.headerBg}
                                  iconBgClass={theme.iconBg}
                                  iconColorClass={theme.iconColor}
                                  daysInMonth={daysInMonth}
                                  onUpdateName={handleUpdateName}
                                  onUpdateShift={handleUpdateShift}
                                  onRemoveEmployee={handleRemoveEmployee}
                                  onSmartPaste={(rowIndex, type, day, text) => handleSmartPaste(text, category, rowIndex, type, day)}
                                  onMoveRow={(fromIndex, toIndex) => handleMoveRow(category, fromIndex, toIndex)}
                              />
                          </section>
                      );
                  })}
              </div>
            </>
        ) : (
            <DocumentGenerator 
                employees={employees} 
                month={selectedMonth}
                year={selectedYear}
                selectedTemplateKey={currentTemplateKey}
                onTemplateChange={setCurrentTemplateKey}
            />
        )}

      </main>
    </div>
  );
};

export default App;