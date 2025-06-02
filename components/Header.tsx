
import React from 'react';

const Header: React.FC = () => {
  return (
    <div className="header bg-gradient-to-r from-blue-700 via-blue-800 to-gray-900 text-white p-6 sm:p-8 text-center">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">ConnectiLung : application d'aide à la décision</h1>
      <p className="text-sm sm:text-base opacity-90">Démarche diagnostique et thérapeutique des PID associées aux connectivites</p>
    </div>
  );
};

export default Header;