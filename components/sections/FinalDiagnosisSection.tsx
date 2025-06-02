
import React from 'react';
import SectionWrapper from './SectionWrapper';
import Alert from '../ui/Alert';
import type { AnalysisResults, FinalDiagnosisResult } from '../../types';
import { CTD_CODES, CTD_NAMES } from '../../types';
import Button from '../ui/Button';

interface FinalDiagnosisSectionProps {
  analysisResults: AnalysisResults;
  setAnalysisResults: React.Dispatch<React.SetStateAction<AnalysisResults>>;
  onNext: () => void;
}

const FinalDiagnosisSection: React.FC<FinalDiagnosisSectionProps> = ({ analysisResults, setAnalysisResults, onNext }) => {
  
  const establishFinalDiagnosis = () => {
    const essentialEval = analysisResults.essentialTestEvaluation;
    const selectedPattern = analysisResults.selectedPattern || null;
    const imaging = analysisResults.imaging;

    let finalDiag: { code: string, name: string, score: number, likelihood: 'Forte' | 'Modérée' | 'Faible'} | null = null;
    let maxLikelihoodScore = 0;

    if (essentialEval) {
      Object.entries(essentialEval).forEach(([code, evalData]) => {
        // Simple logic: highest percentage with at least 'Modérée' likelihood
        let currentScore = evalData.percentage;
        if (evalData.likelihood === 'Forte') currentScore += 100; // Prioritize Forte
        else if (evalData.likelihood === 'Modérée') currentScore += 50;

        if (currentScore > maxLikelihoodScore && evalData.likelihood !== 'Faible') {
          maxLikelihoodScore = currentScore;
          finalDiag = { code, name: evalData.name, score: evalData.percentage, likelihood: evalData.likelihood };
        }
      });
    }

    if (!finalDiag) { // Default to IPAF or most likely from correlation if no strong essential test confirmation
      const correlationDiags = analysisResults.correlation?.significantDiagnoses;
      if (correlationDiags && correlationDiags.length > 0) {
        const mostLikelyCorrelated = correlationDiags[0];
        finalDiag = { code: mostLikelyCorrelated.ctd, name: mostLikelyCorrelated.name, score: mostLikelyCorrelated.score, likelihood: 'Modérée' };
      } else {
        finalDiag = { code: CTD_CODES.IPAF, name: CTD_NAMES.IPAF, score: 0, likelihood: 'Modérée' };
      }
    }
    
    const fvcNum = imaging?.fvc ? parseFloat(imaging.fvc) : undefined;
    const extensionNum = imaging?.extension ? parseInt(imaging.extension) : undefined;
    let severity = 'Non évaluée';
    let prognosis = 'À déterminer';

    if (fvcNum !== undefined && extensionNum !== undefined) {
        if (fvcNum < 50 || extensionNum > 50) { severity = 'Sévère'; prognosis = 'Réservé'; }
        else if (fvcNum < 70 || extensionNum > 20) { severity = 'Étendue'; prognosis = 'Intermédiaire'; }
        else { severity = 'Limitée'; prognosis = 'Favorable'; }
    }
    if (selectedPattern === 'UIP') prognosis = 'Sombre (pattern UIP)';
    else if (finalDiag.code === CTD_CODES.PMDM && analysisResults.targetedImmuno?.confirmedDiagnoses?.some(d => d.includes('Anti-MDA5'))) {
      prognosis = 'Réservé (Anti-MDA5+)';
    }

    const result: FinalDiagnosisResult = {
      ctdCode: finalDiag.code,
      ctdName: finalDiag.name,
      pattern: selectedPattern,
      confidence: finalDiag.likelihood,
      arguments: [
        ...(analysisResults.clinical ? ['Signes cliniques compatibles'] : []),
        ...(analysisResults.targetedImmuno?.confirmedDiagnoses?.length ? ['Anticorps spécifiques positifs'] : []),
        ...(selectedPattern ? [`Pattern HRCT : ${selectedPattern}`] : []),
        ...(imaging?.fvc || imaging?.dlco ? ['Atteinte fonctionnelle respiratoire documentée'] : [])
      ],
      classificationPrognosis: {
        severity, prognosis,
        extension: imaging?.extension, fvc: imaging?.fvc, dlco: imaging?.dlco
      }
    };
    setAnalysisResults(prev => ({ ...prev, finalDiagnosis: result }));
  };

  const finalDiagnosis = analysisResults.finalDiagnosis;

  return (
    <SectionWrapper
      title="✅ Diagnostic Final"
      onAnalyze={!finalDiagnosis && analysisResults.essentialTestEvaluation ? establishFinalDiagnosis : undefined}
      analysisResult={finalDiagnosis && (
        <div className="space-y-4">
          <Alert type={finalDiagnosis.confidence === 'Forte' ? 'success' : finalDiagnosis.confidence === 'Modérée' ? 'warning' : 'danger'} title="Diagnostic Final Retenu">
            <p className="text-lg font-bold">{finalDiagnosis.ctdName}-ILD</p>
            <p>Pattern HRCT : {finalDiagnosis.pattern || 'Non déterminé'}</p>
            <p>Niveau de certitude : {finalDiagnosis.confidence} {finalDiagnosis.ctdCode !== CTD_CODES.IPAF && analysisResults.essentialTestEvaluation?.[finalDiagnosis.ctdCode] ? `(${(analysisResults.essentialTestEvaluation?.[finalDiagnosis.ctdCode].percentage || 0)}% des critères)` : ''}</p>
          </Alert>
          
          <div className="bg-slate-100 p-3 rounded">
            <h4 className="font-semibold text-slate-700 mb-1">Arguments Diagnostiques :</h4>
            <ul className="list-disc list-inside text-sm text-slate-600 pl-4">
              {finalDiagnosis.arguments.map((arg, i) => <li key={i}>{arg}</li>)}
            </ul>
          </div>

          <div className="bg-slate-100 p-3 rounded">
            <h4 className="font-semibold text-slate-700 mb-1">Classification & Pronostic :</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 text-sm text-slate-600">
              <p><strong>Sévérité ILD :</strong> {finalDiagnosis.classificationPrognosis.severity}</p>
              <p><strong>Pronostic global :</strong> {finalDiagnosis.classificationPrognosis.prognosis}</p>
              <p><strong>Extension :</strong> {finalDiagnosis.classificationPrognosis.extension || 'NR'}%</p>
              <p><strong>CVF :</strong> {finalDiagnosis.classificationPrognosis.fvc || 'NR'}%</p>
              <p><strong>DLCO :</strong> {finalDiagnosis.classificationPrognosis.dlco || 'NR'}%</p>
            </div>
          </div>
        </div>
      )}
      onNext={onNext}
      showNextButton={!!finalDiagnosis}
    >
      {!finalDiagnosis && analysisResults.essentialTestEvaluation && <p className="text-slate-600">Cliquez sur "Analyser" pour établir le diagnostic final.</p>}
      {!analysisResults.essentialTestEvaluation && <p className="text-slate-600">Veuillez compléter l'évaluation des tests essentiels à l'étape précédente.</p>}
    </SectionWrapper>
  );
};

export default FinalDiagnosisSection;
