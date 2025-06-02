
import React from 'react';
import SectionWrapper from './SectionWrapper';
import CheckboxItem from '../ui/CheckboxItem';
import Alert from '../ui/Alert';
import type { FormData, TargetedImmunoAnalysisResult, AnalysisResults, StandardBioAnalysisResult } from '../../types';

interface TargetedImmunoSectionProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  analysisResult?: TargetedImmunoAnalysisResult;
  setAnalysisResults: React.Dispatch<React.SetStateAction<AnalysisResults>>;
  standardBioAnalysis?: StandardBioAnalysisResult;
  onNext: () => void;
}

const TargetedImmunoSection: React.FC<TargetedImmunoSectionProps> = ({ formData, updateFormData, analysisResult, setAnalysisResults, standardBioAnalysis, onNext }) => {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({ [e.target.name]: e.target.checked });
  };

  const runTargetedImmunoAnalysis = () => {
    let confirmedDiagnoses: string[] = [];
    let specificities: string[] = [];

    if (formData.antiScl70) { confirmedDiagnoses.push("Sclérodermie systémique diffuse"); specificities.push("Anti-Scl70+ : Risque élevé d'ILD extensive et évolutive"); }
    if (formData.antiCentromere) { confirmedDiagnoses.push("Sclérodermie systémique limitée"); specificities.push("Anticentromère+ : Risque d'HTAP plutôt qu'ILD sévère"); }
    if (formData.antiJo1) { confirmedDiagnoses.push("Syndrome anti-synthétase (Anti-Jo1+)"); specificities.push("Anti-Jo1+ : ILD chronique, réponse habituelle au traitement"); }
    if (formData.antiMda5) { confirmedDiagnoses.push("Dermatomyosite Anti-MDA5+"); specificities.push("Anti-MDA5+ : ATTENTION - Risque d'ILD rapidement progressive, pronostic sombre"); }
    if (formData.antiDna || formData.antiSm) { confirmedDiagnoses.push("Lupus érythémateux systémique"); specificities.push("Critères SLE remplis - Rechercher pneumopathie lupique"); }
    
    setAnalysisResults(prev => ({ ...prev, targetedImmuno: { confirmedDiagnoses, specificities } }));
  };

  const sleAntibodies = [
    { id: 'antiDna', label: 'Anti-ADN natif +' }, { id: 'antiSm', label: 'Anti-Sm +' },
    { id: 'antiRnp', label: 'Anti-RNP +' }, { id: 'antiSsa', label: 'Anti-SSA/Ro +' }, { id: 'antiSsb', label: 'Anti-SSB/La +' },
  ];
  const sscAntibodies = [
    { id: 'antiScl70', label: 'Anti-Scl70 +' }, { id: 'antiCentromere', label: 'Anticentromère +' },
    { id: 'antiRnaPol', label: 'Anti-RNA pol III +' }, { id: 'antiPmScl', label: 'Anti-PM-Scl +' },
  ];
  const myositisAntibodies = [
    { id: 'antiJo1', label: 'Anti-Jo1 +' }, { id: 'antiPl7', label: 'Anti-PL7 +' },
    { id: 'antiPl12', label: 'Anti-PL12 +' }, { id: 'antiMda5', label: 'Anti-MDA5 +' }, { id: 'antiMi2', label: 'Anti-Mi2 +' },
  ];
  
  return (
    <SectionWrapper
      title="🎯 Exploration Immunologique Ciblée"
      onAnalyze={runTargetedImmunoAnalysis}
      analysisResult={analysisResult && (
        <Alert type="success">
          {analysisResult.confirmedDiagnoses.length > 0 && <>
            <h4 className="font-bold">Diagnostic(s) Confirmé(s)/Suspecté(s) :</h4>
            {analysisResult.confirmedDiagnoses.join('<br />')} <br /><br />
          </>}
          {analysisResult.specificities.length > 0 && <>
            <h4 className="font-bold">Spécificités Pronostiques :</h4>
            {analysisResult.specificities.join('<br />')}
          </>}
        </Alert>
      )}
      onNext={onNext}
      showNextButton={!!analysisResult}
    >
      <Alert type="info" title="Orientation basée sur l'analyse précédente">
         {standardBioAnalysis?.orientations?.join('<br />') || "Prescription ciblée selon les résultats cliniques et biologiques"}
      </Alert>
      <div className="form-group space-y-4 mt-4">
        <div>
          <label className="block mb-2 text-md font-medium text-slate-700">Anticorps Spécifiques SLE (si orienté)</label>
          <div className="checkbox-group grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {sleAntibodies.map(item => (
              <CheckboxItem key={item.id} id={item.id} label={item.label} checked={!!formData[item.id]} onChange={handleChange} />
            ))}
          </div>
        </div>
        <div>
          <label className="block mb-2 text-md font-medium text-slate-700">Anticorps Spécifiques SSc (si orienté)</label>
          <div className="checkbox-group grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {sscAntibodies.map(item => (
              <CheckboxItem key={item.id} id={item.id} label={item.label} checked={!!formData[item.id]} onChange={handleChange} />
            ))}
          </div>
        </div>
        <div>
          <label className="block mb-2 text-md font-medium text-slate-700">Anticorps Myosite-Spécifiques (si orienté)</label>
          <div className="checkbox-group grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {myositisAntibodies.map(item => (
              <CheckboxItem key={item.id} id={item.id} label={item.label} checked={!!formData[item.id]} onChange={handleChange} />
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default TargetedImmunoSection;
