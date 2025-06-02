
import React from 'react';
import type { NavItem as NavItemType } from '../types';

interface SidebarProps {
  navItems: NavItemType[];
  activeSectionId: string;
  unlockedPhases: Set<number>;
  onSelectSection: (sectionId: string, phaseId: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ navItems, activeSectionId, unlockedPhases, onSelectSection }) => {
  return (
    <div className="sidebar bg-slate-100 p-3 sm:p-5 border-r border-slate-300 flex flex-col space-y-1">
      {navItems.map((item) => {
        const isLocked = !unlockedPhases.has(item.stepId);
        const isActive = item.sectionId === activeSectionId;

        let itemClasses = "nav-item block w-full text-left p-3 rounded-md cursor-pointer transition-all duration-200 text-sm font-medium shadow-sm";
        
        if (isLocked) {
          itemClasses += " bg-slate-200 text-slate-400 cursor-not-allowed";
        } else if (isActive) {
          itemClasses += " bg-blue-600 text-white transform -translate-y-0.5 shadow-lg";
        } else {
          itemClasses += " bg-white text-slate-700 hover:bg-blue-500 hover:text-white hover:shadow-md";
        }

        return (
          <button
            key={item.id}
            className={itemClasses}
            onClick={() => !isLocked && onSelectSection(item.sectionId, item.stepId)}
            disabled={isLocked}
          >
            <span className="mr-2">{item.icon}</span>
            {item.label}
          </button>
        );
      })}
    </div>
  );
};

export default Sidebar;
