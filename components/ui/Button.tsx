
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'next' | 'default';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ variant = 'default', children, className, ...props }) => {
  let baseClasses = "px-4 py-2 sm:px-6 sm:py-2.5 rounded-lg font-semibold transition-all duration-300 shadow hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-sm";
  
  switch (variant) {
    case 'primary':
      baseClasses += " bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-400";
      break;
    case 'success':
      baseClasses += " bg-green-600 text-white hover:bg-green-700 focus:ring-2 focus:ring-green-400";
      break;
    case 'warning':
      baseClasses += " bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-2 focus:ring-yellow-300";
      break;
    case 'danger':
       baseClasses += " bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-400";
      break;
    case 'next':
      baseClasses += " bg-red-500 text-white hover:bg-red-600 focus:ring-2 focus:ring-red-300 float-right";
      break;
    default:
      baseClasses += " bg-slate-200 text-slate-700 hover:bg-slate-300 focus:ring-2 focus:ring-slate-400";
      break;
  }

  return (
    <button className={`${baseClasses} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
