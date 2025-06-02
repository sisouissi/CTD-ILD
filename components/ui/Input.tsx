
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input: React.FC<InputProps> = ({ label, id, className, ...props }) => {
  return (
    <div className="w-full">
      {label && <label htmlFor={id} className="block mb-1.5 text-sm font-medium text-slate-700">{label}</label>}
      <input
        id={id}
        className={`form-control w-full px-3 py-2 border-2 border-slate-300 rounded-md text-sm
                    focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${className}`}
        {...props}
      />
    </div>
  );
};

export default Input;
