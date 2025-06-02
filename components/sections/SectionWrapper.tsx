
import React from 'react';
import Button from '../ui/Button';

interface SectionWrapperProps {
  title: string;
  children: React.ReactNode;
  onAnalyze?: () => void;
  analysisResult?: React.ReactNode;
  onNext?: () => void;
  nextButtonText?: string;
  showNextButton?: boolean;
  isNextDisabled?: boolean;
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({
  title,
  children,
  onAnalyze,
  analysisResult,
  onNext,
  nextButtonText = "Suivant →",
  showNextButton = true,
  isNextDisabled = false,
}) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-xl sm:text-2xl font-semibold text-slate-800 border-b-2 border-slate-200 pb-2">{title}</h2>
      
      {children}

      {onAnalyze && (
        <Button variant="primary" onClick={onAnalyze} className="mt-4">
          Analyser
        </Button>
      )}

      {analysisResult && (
        <div className="results-panel bg-slate-50 p-4 rounded-lg mt-4 border border-slate-200 shadow-sm">
          {analysisResult}
        </div>
      )}
      
      {showNextButton && onNext && (
        <div className="mt-6 text-right">
          <Button variant="next" onClick={onNext} disabled={isNextDisabled}>
            {nextButtonText}
          </Button>
        </div>
      )}
    </div>
  );
};

export default SectionWrapper;
