
import React from 'react';

interface CheckboxItemProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  name?: string; // Added name prop
}

const CheckboxItem: React.FC<CheckboxItemProps> = ({ id, label, checked, onChange, className, name }) => { // Destructured name
  return (
    <div 
      className={`checkbox-item flex items-center p-2.5 bg-slate-50 rounded-md cursor-pointer 
                  transition-all duration-200 border border-transparent hover:border-blue-500 hover:bg-slate-100
                  ${checked ? 'bg-blue-100 border-blue-600 ring-1 ring-blue-600' : ''} ${className}`}
      onClick={() => onChange({ target: { id, checked: !checked, name: name || id, value: String(!checked) } } as unknown as React.ChangeEvent<HTMLInputElement>)} // Simulate event for parent handler, use name prop
    >
      <input
        type="checkbox"
        id={id}
        name={name || id} // Use name prop here, fallback to id
        checked={checked}
        onChange={onChange}
        className="mr-2.5 h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 transform scale-110"
      />
      <label htmlFor={id} className="text-sm text-slate-700 cursor-pointer select-none">
        {label}
      </label>
    </div>
  );
};

export default CheckboxItem;
