
import React, { useState, useEffect } from 'react';
import SectionWrapper from './SectionWrapper';
import CheckboxItem from '../ui/CheckboxItem';
import Alert from '../ui/Alert';
import type { AnalysisResults, CorrelationAnalysisResult, CTDScores, SelectedDiagnosis } from '../../types';
import { CTD_CODES, CTD_NAMES } from '../../types';
import Button from '../ui/Button';

interface CorrelationSelectionSectionProps {
  analysisResults: AnalysisResults;
  setAnalysisResults: React.Dispatch<React.SetStateAction<AnalysisResults>>;
  setSelectedCandidateDiagnosesExt: React.Dispatch<React.SetStateAction<SelectedDiagnosis[]>>;
  onNext: () => void;
}

const CorrelationSelectionSection: React.FC<CorrelationSelectionSectionProps> = ({ 
  analysisResults, 
  setAnalysisResults, 
  setSelectedCandidateDiagnosesExt,
  onNext 
}) => {
  const [localSelectedCandidates, setLocalSelectedCandidates] = useState<{[key: string]: boolean}>({});

  const runCorrelationAnalysis = () => {
    const clinical = analysisResults.clinical?.ctdSuspicions || {};
    const targetedImmuno = analysisResults.targetedImmuno;
    const selectedPattern = analysisResults.selectedPattern;

    let correlationScores: CTDScores = Object.keys(CTD_CODES).reduce((acc, key) => ({...acc, [key]: 0}), {} as CTDScores);

    Object.keys(clinical).forEach(ctd => {
        if (correlationScores.hasOwnProperty(ctd)) {
            correlationScores[ctd] = (clinical[ctd] || 0);
        }
    });
    
    if (targetedImmuno?.confirmedDiagnoses) {
      targetedImmuno.confirmedDiagnoses.forEach(diagnosis => {
        if (diagnosis.includes('Sclérodermie')) correlationScores.SSc = Math.min((correlationScores.SSc || 0) + 40, 95);
        if (diagnosis.includes('Anti-Jo1') || diagnosis.includes('Anti-synthétase')) correlationScores.PMDM = Math.min((correlationScores.PMDM || 0) + 35, 95);
        if (diagnosis.includes('Anti-MDA5')) correlationScores.PMDM = Math.min((correlationScores.PMDM || 0) + 40, 95);
        if (diagnosis.includes('Lupus')) correlationScores.SLE = Math.min((correlationScores.SLE || 0) + 40, 95);
      });
    }

    if (selectedPattern) {
      if (selectedPattern === 'UIP') { correlationScores.RA = Math.min((correlationScores.RA || 0) + 25, 95); correlationScores.SSc = Math.min((correlationScores.SSc || 0) + 15, 95); }
      else if (selectedPattern === 'fNSIP') { correlationScores.SSc = Math.min((correlationScores.SSc || 0) + 30, 95); correlationScores.PMDM = Math.min((correlationScores.PMDM || 0) + 25, 95); }
      else if (selectedPattern === 'OP') { correlationScores.RA = Math.min((correlationScores.RA || 0) + 20, 95); correlationScores.SLE = Math.min((correlationScores.SLE || 0) + 15, 95); }
      else if (selectedPattern === 'LIP') { correlationScores.SS = Math.min((correlationScores.SS || 0) + 35, 95); }
      else if (selectedPattern === 'FOP') { correlationScores.PMDM = Math.min((correlationScores.PMDM || 0) + 30, 95); }
      else if (selectedPattern === 'DAD') {
        if (analysisResults.targetedImmuno?.confirmedDiagnoses?.some(d => d.includes('Anti-MDA5'))) {
            correlationScores.PMDM = Math.min((correlationScores.PMDM || 0) + 35, 95);
        }
        correlationScores.SLE = Math.min((correlationScores.SLE || 0) + 20, 95);
      }
    }
    
    const significantDiagnoses = Object.entries(correlationScores)
      .filter(([, score]) => score >= 30)
      .sort(([,a], [,b]) => b - a)
      .map(([ctd, score]) => ({ ctd, score, name: CTD_NAMES[ctd] || ctd }));

    setAnalysisResults(prev => ({ ...prev, correlation: { correlationScores, significantDiagnoses } }));
  };

  useEffect(() => {
    // Run analysis once when component mounts if prerequisites are met
    if (analysisResults.clinical && analysisResults.selectedPattern && !analysisResults.correlation) {
      runCorrelationAnalysis();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analysisResults.clinical, analysisResults.selectedPattern]);

  const handleCandidateSelectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSelectedCandidates(prev => ({ ...prev, [e.target.name]: e.target.checked }));
  };

  const confirmSelectedDiagnoses = () => {
    const selected: SelectedDiagnosis[] = [];
    analysisResults.correlation?.significantDiagnoses.forEach(diag => {
      if (localSelectedCandidates[diag.ctd]) {
        selected.push({ code: diag.ctd, name: diag.name, score: diag.score });
      }
    });
    if (localSelectedCandidates[CTD_CODES.IPAF]) {
         selected.push({ code: CTD_CODES.IPAF, name: CTD_NAMES.IPAF, score: 'N/A'});
    }
    setSelectedCandidateDiagnosesExt(selected);
    // Optionally, store this final selection in analysisResults as well
    // setAnalysisResults(prev => ({ ...prev, confirmedCandidateDiagnoses: selected }));
  };
  
  const correlationResult = analysisResults.correlation;
  const hasConfirmedCandidates = Object.values(localSelectedCandidates).some(v => v);

  return (
    <SectionWrapper
      title="🧩 Corrélation Radio-Clinique & Sélection Diagnostique"
      onAnalyze={!correlationResult ? runCorrelationAnalysis : undefined}
      analysisResult={correlationResult && (
        <>
          <div className="ctd-probability grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 my-4">
            {correlationResult.significantDiagnoses.map(({ ctd, score, name }) => (
              <div key={ctd} className={`probability-card p-3 rounded-md text-center
                ${score >= 70 ? 'bg-green-100 border border-green-300' : score >= 50 ? 'bg-yellow-100 border border-yellow-300' : 'bg-red-100 border border-red-300'}`}>
                <div className="font-semibold text-slate-800">{name}</div>
                <div className={`text-2xl font-bold my-1 ${score >= 70 ? 'text-green-600' : score >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>{score}%</div>
                <div className="text-xs text-slate-500">Pattern: {analysisResults.selectedPattern || 'Non déterminé'}</div>
              </div>
            ))}
          </div>
          {correlationResult.significantDiagnoses.length === 0 && (
            <Alert type="warning">Aucun diagnostic avec corrélation significative (&gt;30%). Considérez IPAF.</Alert>
          )}
          <div className="mt-4">
            <h4 className="text-md font-semibold text-slate-700 mb-2">Sélectionner les diagnostics à investiguer :</h4>
            <div className="checkbox-group grid grid-cols-1 sm:grid-cols-2 gap-3">
              {correlationResult.significantDiagnoses.map(({ ctd, name, score }) => (
                <CheckboxItem 
                  key={ctd} 
                  id={`select-${ctd}`} 
                  name={ctd} 
                  label={`${name} (${score}%)`} 
                  checked={!!localSelectedCandidates[ctd]} 
                  onChange={handleCandidateSelectionChange} />
              ))}
              <CheckboxItem 
                id={`select-${CTD_CODES.IPAF}`} 
                name={CTD_CODES.IPAF}
                label={`${CTD_NAMES.IPAF} (si critères CTD non remplis)`} 
                checked={!!localSelectedCandidates[CTD_CODES.IPAF]} 
                onChange={handleCandidateSelectionChange} />
            </div>
          </div>
          {hasConfirmedCandidates && 
            <Button variant="success" onClick={confirmSelectedDiagnoses} className="mt-4">
              Confirmer Sélection
            </Button>
          }
        </>
      )}
      onNext={onNext}
      showNextButton={!!analysisResults.correlation && hasConfirmedCandidates && (setSelectedCandidateDiagnosesExt !== undefined && (Object.keys(localSelectedCandidates).filter(k => localSelectedCandidates[k])).length > 0) }
      isNextDisabled={!(hasConfirmedCandidates && (Object.keys(localSelectedCandidates).filter(k => localSelectedCandidates[k])).length > 0)}
    >
      {!correlationResult && <p className="text-slate-600">Cliquez sur "Analyser" pour voir les corrélations.</p>}
    </SectionWrapper>
  );
};

export default CorrelationSelectionSection;
