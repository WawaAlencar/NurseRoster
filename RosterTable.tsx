import React, { useMemo, useRef, useState } from 'react';
import { Employee, ShiftType } from '../types';
import ShiftCell from './ShiftCell';
import { Trash2, User, GripVertical } from 'lucide-react';

interface RosterTableProps {
  employees: Employee[];
  headerColorClass: string;
  iconBgClass: string;
  iconColorClass: string;
  daysInMonth: number;
  onUpdateName: (employeeId: string, newName: string) => void;
  onUpdateShift: (employeeId: string, day: number, code: ShiftType) => void;
  onRemoveEmployee: (employeeId: string) => void;
  onSmartPaste: (rowIndex: number, colType: 'NAME' | 'SHIFT', startDay: number, text: string) => void;
  onMoveRow?: (fromIndex: number, toIndex: number) => void;
}

const RosterTable: React.FC<RosterTableProps> = ({ 
  employees, 
  headerColorClass,
  iconBgClass,
  iconColorClass,
  daysInMonth,
  onUpdateName,
  onUpdateShift, 
  onRemoveEmployee, 
  onSmartPaste,
  onMoveRow
}) => {
  
  // Drag and Drop refs
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // State to track which row is currently allowed to be dragged (hovering over handle)
  const [dragAllowedIndex, setDragAllowedIndex] = useState<number | null>(null);

  // Generate days array dynamically based on prop
  const daysArray = useMemo(() => Array.from({ length: daysInMonth }, (_, i) => i + 1), [daysInMonth]);

  const handlePaste = (e: React.ClipboardEvent, rowIndex: number, type: 'NAME' | 'SHIFT', day: number = 0) => {
    // Stop propagation to prevent any wrapper listeners from firing
    e.stopPropagation();
    
    const text = e.clipboardData.getData('text');
    if (!text) return;

    // If it contains newlines or tabs, treat as bulk paste
    if (text.includes('\t') || text.includes('\n')) {
      e.preventDefault();
      onSmartPaste(rowIndex, type, day, text);
    }
  };

  // --- DnD Handlers ---
  const handleDragStart = (e: React.DragEvent<HTMLTableRowElement>, index: number) => {
    dragItem.current = index;
    setIsDragging(true);
    // Visual effect for the drag image
    e.dataTransfer.effectAllowed = "move";
    // If we wanted to set a custom drag image, we could do it here
  };

  const handleDragEnter = (e: React.DragEvent<HTMLTableRowElement>, index: number) => {
    dragOverItem.current = index;
  };

  const handleDragEnd = () => {
    if (onMoveRow && dragItem.current !== null && dragOverItem.current !== null) {
        onMoveRow(dragItem.current, dragOverItem.current);
    }
    dragItem.current = null;
    dragOverItem.current = null;
    setIsDragging(false);
    setDragAllowedIndex(null); // Reset draggable state
  };

  const handleDragOver = (e: React.DragEvent<HTMLTableRowElement>) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  return (
    <div 
      className="overflow-x-auto border border-gray-300 rounded-lg shadow-sm bg-white outline-none"
    >
      <table className="w-full border-collapse min-w-max">
        <thead className="sticky top-0 z-20">
          <tr>
            {/* Sticky Name Column Header */}
            <th className={`sticky left-0 z-30 ${headerColorClass} text-white font-bold text-sm uppercase p-3 min-w-[300px] text-left shadow-[2px_0_5px_-2px_rgba(0,0,0,0.2)]`}>
              Nome Profissional
            </th>
            {/* Day Columns */}
            {daysArray.map((day) => (
              <th
                key={day}
                className={`${headerColorClass} text-white font-bold text-xs border-l border-white/20 w-10 p-1 text-center`}
              >
                {day}
              </th>
            ))}
            <th className={`${headerColorClass} text-white w-10`}></th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee, index) => {
            const isAPH = employee.category.includes('APH');

            return (
            <tr 
                key={employee.id} 
                // Only allow dragging if onMoveRow is present AND the user is hovering the handle
                draggable={!!onMoveRow && dragAllowedIndex === index}
                onDragStart={(e) => handleDragStart(e, index)}
                onDragEnter={(e) => handleDragEnter(e, index)}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                className={`
                    hover:bg-gray-50 transition-colors group 
                    ${isDragging && dragItem.current === index ? 'opacity-40 bg-gray-100' : ''}
                `}
            >
              {/* Sticky Name Cell (Editable) */}
              <td className="sticky left-0 z-10 bg-white border-b border-r border-gray-300 p-0 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] min-w-[300px]">
                <div className="flex items-center w-full h-10 pl-1 pr-2">
                   {/* Drag Handle - Hovering here enables dragging for the row */}
                   <div 
                        className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 p-1 mr-1 flex-shrink-0" 
                        title="Arrastar para reordenar"
                        onMouseEnter={() => setDragAllowedIndex(index)}
                        onMouseLeave={() => setDragAllowedIndex(null)}
                   >
                       <GripVertical size={16} />
                   </div>

                   {/* Role Icon */}
                   <div className={`w-6 h-6 flex-shrink-0 rounded-full ${iconBgClass} flex items-center justify-center ${iconColorClass} mr-2`}>
                      <User size={14} />
                   </div>

                   {/* Name Input */}
                   <div className="flex-1 flex items-center min-w-0 relative">
                     <input 
                        type="text" 
                        value={employee.name}
                        onChange={(e) => onUpdateName(employee.id, e.target.value.toUpperCase())}
                        onPaste={(e) => handlePaste(e, index, 'NAME')}
                        placeholder="Cole nomes aqui..."
                        className="w-full h-full outline-none bg-transparent text-sm text-gray-700 font-medium placeholder-gray-300 uppercase"
                     />
                     {/* Visual APH Badge next to input */}
                     {isAPH && (
                       <span className="ml-1 text-[10px] font-extrabold text-gray-400 bg-gray-100 px-1 rounded border border-gray-200 select-none whitespace-nowrap shrink-0">
                         (APH)
                       </span>
                     )}
                   </div>
                </div>
              </td>
              
              {/* Shift Cells */}
              {daysArray.map((day) => (
                <ShiftCell
                  key={`${employee.id}-${day}`}
                  day={day}
                  value={employee.schedule[day] || ShiftType.OFF}
                  onChange={(d, code) => onUpdateShift(employee.id, d, code)}
                  onPaste={(e) => handlePaste(e, index, 'SHIFT', day)}
                />
              ))}

              {/* Action Column */}
              <td className="border-b border-gray-300 p-1 text-center bg-gray-50">
                  <button 
                    onClick={() => onRemoveEmployee(employee.id)}
                    className="text-gray-300 hover:text-red-500 transition-colors p-1 opacity-0 group-hover:opacity-100"
                    title="Remover linha"
                  >
                    <Trash2 size={14} />
                  </button>
              </td>
            </tr>
          )})}
        </tbody>
      </table>
    </div>
  );
};

export default RosterTable;