
import React from 'react';
import SectionWrapper from './SectionWrapper';
import Select from '../ui/Select';
import CheckboxItem from '../ui/CheckboxItem';
import Alert from '../ui/Alert';
import type { FormData, RespiratoryAnalysisResult, AnalysisResults } from '../../types';

interface RespiratorySectionProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  analysisResult?: RespiratoryAnalysisResult;
  setAnalysisResults: React.Dispatch<React.SetStateAction<AnalysisResults>>;
  onNext: () => void;
}

const RespiratorySection: React.FC<RespiratorySectionProps> = ({ formData, updateFormData, analysisResult, setAnalysisResults, onNext }) => {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    updateFormData({ [name]: type === 'checkbox' ? checked : value });
  };

  const runRespiratoryAnalysis = () => {
    const { mmrcDyspnea, respiratoryOnset, respiratoryEvolution, mtxExposure } = formData;
    let severity: string[] = [];
    let urgency: string[] = [];

    if (mmrcDyspnea && parseInt(mmrcDyspnea) >= 3) { severity.push("Dyspnée sévère (mMRC ≥3) - ILD symptomatique");}
    if (respiratoryOnset === 'recent' && respiratoryEvolution === 'rapidly-progressive') { urgency.push("⚠️ ÉVOLUTION RAPIDEMENT PROGRESSIVE - Bilan urgent, traitement d'exception à discuter");}
    if (mtxExposure) { urgency.push("Exposition MTX récente - Éliminer pneumopathie médicamenteuse");}
    
    setAnalysisResults(prev => ({ ...prev, respiratory: { severity, urgency, mmrcStage: mmrcDyspnea, onsetType: respiratoryOnset, evolution: respiratoryEvolution } }));
  };

  const exposures = [
    { id: 'mtxExposure', label: 'Méthotrexate récent' }, { id: 'infectionRecent', label: 'Infection récente' },
    { id: 'drugInduced', label: 'Pneumopathie médicamenteuse suspectée' },
  ];

  return (
    <SectionWrapper
      title="🫁 Évaluation de l'Atteinte Pulmonaire"
      onAnalyze={runRespiratoryAnalysis}
      analysisResult={analysisResult && (
        <>
          {analysisResult.urgency.length > 0 && <Alert type="danger">{analysisResult.urgency.join('<br />')}</Alert>}
          {analysisResult.severity.length > 0 && <Alert type="warning">{analysisResult.severity.join('<br />')}</Alert>}
          <Alert type="info">
            <strong>Indication imagerie thoracique HRCT :</strong> Systématique pour caractériser l'ILD
          </Alert>
        </>
      )}
      onNext={onNext}
      showNextButton={!!analysisResult}
    >
      <div className="form-group space-y-4">
        <div>
          <label className="block mb-2 text-md font-medium text-slate-700">Symptômes Respiratoires Détaillés</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select label="Stade mMRC dyspnée" name="mmrcDyspnea" value={formData.mmrcDyspnea || ''} onChange={handleChange} options={[
              { value: '', label: 'Stade mMRC dyspnée' }, { value: '0', label: '0 - Pas de dyspnée sauf effort intense' },
              { value: '1', label: '1 - Dyspnée en montant une côte' }, { value: '2', label: '2 - Dyspnée en marchant sur terrain plat' },
              { value: '3', label: "3 - S'arrête après 100m de marche" }, { value: '4', label: '4 - Dyspnée au repos' }
            ]} />
            <Select label="Type de toux" name="coughType" value={formData.coughType || ''} onChange={handleChange} options={[
              { value: '', label: 'Type de toux' }, { value: 'none', label: 'Pas de toux' }, { value: 'dry', label: 'Toux sèche' },
              { value: 'productive', label: 'Toux productive' }, { value: 'hemoptysis', label: 'Hémoptysies' }
            ]} />
          </div>
        </div>
        <div>
          <label className="block mb-2 text-md font-medium text-slate-700">Chronologie Respiratoire</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select label="Début des symptômes respiratoires" name="respiratoryOnset" value={formData.respiratoryOnset || ''} onChange={handleChange} options={[
              { value: '', label: 'Début des symptômes respiratoires' }, { value: 'recent', label: 'Récent (< 3 mois)' },
              { value: 'subacute', label: 'Subaigu (3-12 mois)' }, { value: 'chronic', label: 'Chronique (> 12 mois)' }
            ]} />
            <Select label="Évolution respiratoire" name="respiratoryEvolution" value={formData.respiratoryEvolution || ''} onChange={handleChange} options={[
              { value: '', label: 'Évolution respiratoire' }, { value: 'stable', label: 'Stable' },
              { value: 'slowly-progressive', label: 'Lentement progressive' }, { value: 'rapidly-progressive', label: 'Rapidement progressive' },
              { value: 'fluctuating', label: 'Fluctuante' }
            ]} />
          </div>
        </div>
        <div>
          <label className="block mb-2 text-md font-medium text-slate-700">Expositions/Facteurs Déclenchants</label>
          <div className="checkbox-group grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {exposures.map(item => (
              <CheckboxItem key={item.id} id={item.id} label={item.label} checked={!!formData[item.id]} onChange={handleChange} />
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default RespiratorySection;
