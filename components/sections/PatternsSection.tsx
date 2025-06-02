
import React from 'react';
import SectionWrapper from './SectionWrapper';
import Alert from '../ui/Alert';
import type { HRCTPattern, AnalysisResults, ImagingAnalysisResult } from '../../types';
import { HRCT_PATTERNS_DETAILS } from '../../constants';

interface PatternsSectionProps {
  selectedPattern: HRCTPattern | null;
  setAnalysisResults: React.Dispatch<React.SetStateAction<AnalysisResults>>;
  imagingAnalysis?: ImagingAnalysisResult;
  onNext: () => void;
}

const PatternCard: React.FC<{
  patternKey: HRCTPattern;
  patternDetails: typeof HRCT_PATTERNS_DETAILS[HRCTPattern];
  isSelected: boolean;
  onSelect: (pattern: HRCTPattern) => void;
}> = ({ patternKey, patternDetails, isSelected, onSelect }) => (
  <div 
    className={`pattern-card bg-white p-4 rounded-lg shadow-md border-2 cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-blue-400
                ${isSelected ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-500' : 'border-slate-200'}`}
    onClick={() => onSelect(patternKey)}
  >
    <h4 className="text-md font-semibold text-slate-800 mb-2 flex items-center">
      <span className="mr-2 text-lg">🔬</span>{patternDetails.name}
    </h4>
    <ul className="criteria-list list-none p-0 text-xs space-y-1 text-slate-600">
      {patternDetails.description.split('. ')[0].split(', ').slice(0,3).map((crit, idx) => ( // Simplified criteria list for card
        <li key={idx} className="pb-1 border-b border-slate-100 last:border-b-0">
          <span className="text-green-600 font-semibold mr-1">✓</span>{crit}
        </li>
      ))}
    </ul>
    <div className="mt-2 text-xs text-slate-500">
      Associé à : {patternDetails.associations.slice(0,2).join(', ')}
    </div>
  </div>
);

const PatternsSection: React.FC<PatternsSectionProps> = ({ selectedPattern, setAnalysisResults, imagingAnalysis, onNext }) => {
  
  const handleSelectPattern = (pattern: HRCTPattern) => {
    setAnalysisResults(prev => ({ ...prev, selectedPattern: pattern }));
  };

  return (
    <SectionWrapper
      title="🔬 Analyse des Signes Élémentaires (Pattern HRCT)"
      onNext={onNext}
      showNextButton={!!selectedPattern}
      isNextDisabled={!selectedPattern}
    >
      <Alert type="info" title="Corrélation Radio-Clinique">
        Identification du pattern HRCT et corrélation avec la CTD suspectée
      </Alert>

      {imagingAnalysis?.patternSuggestion && (
        <Alert type="warning" title="Pattern Suggéré (basé sur l'imagerie)">
          {imagingAnalysis.patternSuggestion}
        </Alert>
      )}

      <div className="pattern-analysis grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {Object.entries(HRCT_PATTERNS_DETAILS).map(([key, details]) => (
          <PatternCard
            key={key}
            patternKey={key as HRCTPattern}
            patternDetails={details}
            isSelected={selectedPattern === key}
            onSelect={handleSelectPattern}
          />
        ))}
      </div>

      {selectedPattern && HRCT_PATTERNS_DETAILS[selectedPattern] && (
        <div className="results-panel bg-slate-50 p-4 rounded-lg mt-5 border border-slate-200 shadow">
          <h3 className="text-lg font-semibold text-blue-700 mb-2">Pattern Sélectionné : {HRCT_PATTERNS_DETAILS[selectedPattern].name}</h3>
          <p className="text-sm text-slate-600 mb-1"><strong>Description :</strong> {HRCT_PATTERNS_DETAILS[selectedPattern].description}</p>
          <p className="text-sm text-slate-600"><strong>Associations typiques :</strong></p>
          <ul className="list-disc list-inside text-sm text-slate-600 pl-4">
            {HRCT_PATTERNS_DETAILS[selectedPattern].associations.map(assoc => <li key={assoc}>{assoc}</li>)}
          </ul>
        </div>
      )}
    </SectionWrapper>
  );
};

export default PatternsSection;
