
import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

const Select: React.FC<SelectProps> = ({ label, id, options, className, ...props }) => {
  return (
    <div className="w-full">
      {label && <label htmlFor={id} className="block mb-1.5 text-sm font-medium text-slate-700">{label}</label>}
      <select
        id={id}
        className={`form-control w-full px-3 py-2.5 border-2 border-slate-300 rounded-md text-sm bg-white
                    focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${className}`}
        {...props}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  );
};

export default Select;
