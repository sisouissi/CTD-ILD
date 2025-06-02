
import React from 'react';
import SectionWrapper from './SectionWrapper';
import Input from '../ui/Input';
import CheckboxItem from '../ui/CheckboxItem';
import Alert from '../ui/Alert';
import type { FormData, ImagingAnalysisResult, AnalysisResults } from '../../types';

interface ImagingSectionProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  analysisResult?: ImagingAnalysisResult;
  setAnalysisResults: React.Dispatch<React.SetStateAction<AnalysisResults>>;
  onNext: () => void;
}

const ImagingSection: React.FC<ImagingSectionProps> = ({ formData, updateFormData, analysisResult, setAnalysisResults, onNext }) => {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    updateFormData({ [name]: type === 'checkbox' ? checked : value });
  };
  
  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({ extensionRange: e.target.value });
  };

  const runImagingAnalysis = () => {
    const { fvc, dlco, extensionRange, kl6, groundGlass, honeycombing, subpleuralDist, subpleuralSparing, consolidations, cysts } = formData;
    let severity: string[] = [];
    let biomarkersResult: {label: string; class: string}[] = [];
    let patternSuggestion = "";

    if (parseFloat(fvc) < 50) severity.push("ILD sévère (CVF < 50%)");
    else if (parseFloat(fvc) < 70) severity.push("ILD étendue (CVF < 70%)");
    if (parseFloat(dlco) < 40) severity.push("Atteinte sévère des échanges gazeux (DLCO < 40%)");
    if (parseInt(extensionRange) > 20) severity.push("ILD étendue sur HRCT (> 20%)");
    if (parseFloat(kl6) > 1000) { biomarkersResult.push({label: `KL-6: ${kl6} U/mL`, class: 'high'}); }
    else if (parseFloat(kl6) > 500) { biomarkersResult.push({label: `KL-6: ${kl6} U/mL`, class: 'elevated'}); }

    if (honeycombing && subpleuralDist) patternSuggestion = "UIP (rayon de miel + distribution sous-pleurale)";
    else if (groundGlass && subpleuralSparing) patternSuggestion = "f-NSIP (verre dépoli + épargne sous-pleurale)";
    else if (consolidations) patternSuggestion = "OP (condensations multiples)";
    else if (cysts) patternSuggestion = "LIP (kystes pathognomoniques)";

    setAnalysisResults(prev => ({ ...prev, imaging: { severity, biomarkers: biomarkersResult, patternSuggestion, fvc, dlco, extension: extensionRange } }));
  };
  
  const hrctAnomalies = [
    { id: 'groundGlass', label: 'Verre dépoli' }, { id: 'reticulations', label: 'Réticulations' },
    { id: 'honeycombing', label: 'Rayon de miel' }, { id: 'tractionBe', label: 'Bronchectasies de traction' },
    { id: 'consolidations', label: 'Condensations' }, { id: 'cysts', label: 'Kystes' },
  ];
  const lesionDistribution = [
    { id: 'lowerPredominant', label: 'Prédominance basale' }, { id: 'subpleuralDist', label: 'Distribution sous-pleurale' },
    { id: 'peribronchovascular', label: 'Péribroncho-vasculaire' }, { id: 'subpleuralSparing', label: 'Épargne sous-pleurale' },
  ];

  return (
    <SectionWrapper
      title="🖼️ Imagerie & Épreuves Fonctionnelles"
      onAnalyze={runImagingAnalysis}
      analysisResult={analysisResult && (
        <>
          {analysisResult.severity.length > 0 && <Alert type="warning" title="Sévérité">{analysisResult.severity.join('<br />')}</Alert>}
          {analysisResult.biomarkers.length > 0 && 
            <div className="biomarker-grid grid grid-cols-1 sm:grid-cols-2 gap-2 my-3">
              {analysisResult.biomarkers.map(bm => (
                <div key={bm.label} className={`biomarker-item p-2 rounded border-l-4 text-sm text-center
                  ${bm.class === 'high' ? 'border-red-500 bg-red-100' : 
                    bm.class === 'elevated' ? 'border-yellow-500 bg-yellow-100' : 
                    'border-green-500 bg-green-100'}`}>
                  {bm.label}
                </div>
              ))}
            </div>
          }
          {analysisResult.patternSuggestion && <Alert type="info" title="Pattern suggéré">{analysisResult.patternSuggestion}</Alert>}
        </>
      )}
      onNext={onNext}
      showNextButton={!!analysisResult}
    >
      <div className="form-group space-y-4">
        <div>
          <label className="block mb-2 text-md font-medium text-slate-700">Épreuves Fonctionnelles Respiratoires</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input label="CVF (% théorique)" type="number" name="fvc" value={formData.fvc || ''} onChange={handleChange} placeholder="Normal > 80%" min="0" max="150" />
            <Input label="DLCO (% théorique)" type="number" name="dlco" value={formData.dlco || ''} onChange={handleChange} placeholder="Normal > 75%" min="0" max="150" />
            <Input label="SpO2 repos (%)" type="number" name="spo2" value={formData.spo2 || ''} onChange={handleChange} placeholder="Normal > 95%" min="50" max="100" />
          </div>
        </div>
        <div>
          <label className="block mb-2 text-md font-medium text-slate-700">Biomarqueurs Pulmonaires</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="KL-6 (U/mL)" type="number" name="kl6" value={formData.kl6 || ''} onChange={handleChange} placeholder="Normal < 500" min="0" />
            <Input label="SP-D (ng/mL)" type="number" name="spd" value={formData.spd || ''} onChange={handleChange} placeholder="Normal < 110" min="0" />
          </div>
        </div>
        <div>
          <label className="block mb-2 text-md font-medium text-slate-700">HRCT Thoracique - Anomalies Principales</label>
          <div className="checkbox-group grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {hrctAnomalies.map(item => (
              <CheckboxItem key={item.id} id={item.id} label={item.label} checked={!!formData[item.id]} onChange={handleChange} />
            ))}
          </div>
        </div>
        <div>
          <label className="block mb-2 text-md font-medium text-slate-700">Distribution des Lésions</label>
          <div className="checkbox-group grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {lesionDistribution.map(item => (
              <CheckboxItem key={item.id} id={item.id} label={item.label} checked={!!formData[item.id]} onChange={handleChange} />
            ))}
          </div>
        </div>
        <div>
          <label className="block mb-2 text-md font-medium text-slate-700">Extension des Lésions</label>
          <div>
            <label htmlFor="extensionRange" className="block mb-1 text-sm text-slate-600">Pourcentage d'atteinte pulmonaire : <span className="font-bold text-blue-600">{formData.extensionRange || 0}%</span></label>
            <input type="range" id="extensionRange" name="extensionRange" className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" 
                   min="0" max="100" step="5" value={formData.extensionRange || '0'} onChange={handleRangeChange} />
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default ImagingSection;
