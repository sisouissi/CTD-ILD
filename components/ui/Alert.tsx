
import React from 'react';

interface AlertProps {
  type: 'info' | 'success' | 'warning' | 'danger';
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const Alert: React.FC<AlertProps> = ({ type, title, children, className }) => {
  let bgClass = '';
  let borderClass = '';
  let textClass = '';
  let titleClass = '';

  switch (type) {
    case 'info':
      bgClass = 'bg-blue-50';
      borderClass = 'border-blue-500';
      textClass = 'text-blue-700';
      titleClass = 'text-blue-800';
      break;
    case 'success':
      bgClass = 'bg-green-50';
      borderClass = 'border-green-500';
      textClass = 'text-green-700';
      titleClass = 'text-green-800';
      break;
    case 'warning':
      bgClass = 'bg-yellow-50';
      borderClass = 'border-yellow-500';
      textClass = 'text-yellow-700';
      titleClass = 'text-yellow-800';
      break;
    case 'danger':
      bgClass = 'bg-red-50';
      borderClass = 'border-red-500';
      textClass = 'text-red-700';
      titleClass = 'text-red-800';
      break;
  }

  return (
    <div className={`alert p-4 my-3 rounded-lg border-l-4 ${bgClass} ${borderClass} ${textClass} ${className}`} role="alert">
      {title && <h4 className={`font-bold mb-1 ${titleClass}`}>{title}</h4>}
      <div className="text-sm">{children}</div>
    </div>
  );
};

export default Alert;
