
import React from 'react';
import type { Step } from '../types';

interface ProgressTrackerProps {
  steps: Step[];
  currentPhase: number;
  unlockedPhases: Set<number>;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ steps, currentPhase, unlockedPhases }) => {
  return (
    <div className="progress-tracker bg-slate-100 p-3 sm:p-4 border-b border-slate-300 flex flex-wrap justify-around gap-1">
      {steps.map((step) => {
        const isCompleted = step.id < currentPhase && unlockedPhases.has(step.id);
        const isActive = step.id === currentPhase && unlockedPhases.has(step.id);
        const isLocked = !unlockedPhases.has(step.id);

        let stepClasses = "flex-1 text-center p-2 rounded-lg cursor-pointer transition-all duration-300 border-2 border-transparent min-w-[100px] sm:min-w-[120px] text-xs sm:text-sm";
        if (isCompleted) {
          stepClasses += " bg-green-600 text-white";
        } else if (isActive) {
          stepClasses += " bg-blue-600 text-white border-blue-700 shadow-md";
        } else if (isLocked) {
          stepClasses += " bg-slate-200 text-slate-500 cursor-not-allowed";
        } else {
          stepClasses += " bg-white text-slate-700 hover:bg-slate-50";
        }
        
        // No click functionality for now, handled by main app logic

        return (
          <div key={step.id} className={stepClasses} data-step={step.id}>
            <div className="font-bold mb-1">{step.phase}</div>
            <div className="text-xs">{step.title}</div>
          </div>
        );
      })}
    </div>
  );
};

export default ProgressTracker;
