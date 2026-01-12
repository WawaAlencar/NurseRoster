import React from 'react';
import { ShiftType } from './types';
import { SHIFT_COLORS } from './constants';

interface ShiftCellProps {
  day: number;
  value: ShiftType | string;
  onChange: (day: number, newValue: ShiftType) => void;
  onPaste?: (e: React.ClipboardEvent) => void;
}

const ShiftCell: React.FC<ShiftCellProps> = ({ day, value, onChange, onPaste }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Force uppercase for consistency with codes like N8, D6
    onChange(day, e.target.value.toUpperCase() as ShiftType);
  };

  // Determine basic styling based on value. Fallback to OFF style if code is unknown/custom.
  const colorClass = SHIFT_COLORS[value] || (value ? 'bg-gray-50 text-gray-800 border-gray-200' : SHIFT_COLORS[ShiftType.OFF]);

  return (
    <td className={`p-0 border border-gray-300 min-w-[40px] h-10 relative group ${value !== ShiftType.OFF ? colorClass : 'bg-white'}`}>
      <div className="w-full h-full flex items-center justify-center">
        <input
          type="text"
          value={value === ShiftType.OFF ? '' : value}
          onChange={handleChange}
          onPaste={onPaste}
          maxLength={4}
          className={`
            w-full h-full text-center bg-transparent text-xs font-bold focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 p-0 m-0 border-none
            ${value === ShiftType.OFF ? 'placeholder-transparent' : ''}
          `}
          // Allow standard focus but style cleanly
        />
      </div>
    </td>
  );
};

export default React.memo(ShiftCell);
