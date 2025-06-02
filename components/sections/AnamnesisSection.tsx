
import React from 'react';
import SectionWrapper from './SectionWrapper';
import Input from '../ui/Input';
import Select from '../ui/Select';
import CheckboxItem from '../ui/CheckboxItem';
import Alert from '../ui/Alert';
import type { FormData, AnamnesisAnalysisResult } from '../../types';

interface AnamnesisSectionProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  onAnalyze: () => void;
  analysisResult?: AnamnesisAnalysisResult;
  onNext: () => void;
}

const AnamnesisSection: React.FC<AnamnesisSectionProps> = ({ formData, updateFormData, onAnalyze, analysisResult, onNext }) => {
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    updateFormData({ [name]: type === 'checkbox' ? checked : value });
  };

  const exposures = [
    { id: 'silice', label: 'Silice' }, { id: 'amiante', label: 'Amiante' },
    { id: 'metaux', label: 'Métaux lourds' }, { id: 'oiseaux', label: 'Oiseaux' },
    { id: 'moisissures', label: 'Moisissures' }, { id: 'foin', label: 'Foin/poussières organiques' },
  ];

  const familyHistory = [
    { id: 'atcdCtd', label: 'Connectivites familiales' }, { id: 'atcdRaynaud', label: 'Phénomène de Raynaud familial' },
    { id: 'atcdIld', label: 'Pneumopathies interstitielles' }, { id: 'atcdAutoimmun', label: 'Maladies auto-immunes' },
  ];

  return (
    <SectionWrapper
      title="📋 Anamnèse & Facteurs de Risque"
      onAnalyze={onAnalyze}
      analysisResult={analysisResult && (
        <Alert type="info" title="Orientation Initiale">
          {analysisResult.riskFactors.length > 0 && (
            <><strong>Facteurs de risque :</strong><br />{analysisResult.riskFactors.join('<br />')}<br /><br /></>
          )}
          {analysisResult.suspicions.length > 0 && (
            <><strong>Suspicions cliniques :</strong><br />{analysisResult.suspicions.join('<br />')}</>
          )}
        </Alert>
      )}
      onNext={onNext}
      showNextButton={!!analysisResult}
    >
      <div className="form-group space-y-4">
        <div>
          <label className="block mb-2 text-md font-medium text-slate-700">Données Démographiques</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input label="Âge" type="number" name="age" value={formData.age || ''} onChange={handleChange} placeholder="Âge" min="1" max="120" />
            <Select label="Sexe" name="sexe" value={formData.sexe || ''} onChange={handleChange} options={[
              { value: '', label: 'Sexe' }, { value: 'M', label: 'Masculin' }, { value: 'F', label: 'Féminin' }
            ]} />
            <Select label="Origine ethnique" name="origine" value={formData.origine || ''} onChange={handleChange} options={[
              { value: '', label: 'Origine ethnique' }, { value: 'caucasien', label: 'Caucasienne' },
              { value: 'africain', label: 'Africaine' }, { value: 'asiatique', label: 'Asiatique' }, { value: 'autre', label: 'Autre' }
            ]} />
          </div>
        </div>

        <div>
          <label className="block mb-2 text-md font-medium text-slate-700">Facteurs de Risque</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select label="Statut tabagique" name="tabac" value={formData.tabac || ''} onChange={handleChange} options={[
              { value: '', label: 'Statut tabagique' }, { value: 'never', label: 'Jamais fumé' },
              { value: 'current', label: 'Fumeur actuel' }, { value: 'former', label: 'Sevré' }
            ]} />
            <Input label="Paquets-années" type="number" name="pa" value={formData.pa || ''} onChange={handleChange} placeholder="Paquets-années" min="0" />
            <Input label="Profession" type="text" name="profession" value={formData.profession || ''} onChange={handleChange} placeholder="Profession" />
          </div>
        </div>
        
        <div>
          <label className="block mb-2 text-md font-medium text-slate-700">Expositions Professionnelles/Environnementales</label>
          <div className="checkbox-group grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {exposures.map(item => (
              <CheckboxItem key={item.id} id={item.id} label={item.label} checked={!!formData[item.id]} onChange={handleChange} />
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-2 text-md font-medium text-slate-700">Antécédents Familiaux</label>
          <div className="checkbox-group grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {familyHistory.map(item => (
              <CheckboxItem key={item.id} id={item.id} label={item.label} checked={!!formData[item.id]} onChange={handleChange} />
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-2 text-md font-medium text-slate-700">Chronologie des Symptômes</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select label="Délai d'évolution" name="delaiEvolution" value={formData.delaiEvolution || ''} onChange={handleChange} options={[
              { value: '', label: "Délai d'évolution" }, { value: 'aigu', label: '< 3 mois (aigu)' },
              { value: 'subaigu', label: '3-12 mois (subaigu)' }, { value: 'chronique', label: '> 12 mois (chronique)' }
            ]} />
            <Select label="Mode d'installation" name="modeInstallation" value={formData.modeInstallation || ''} onChange={handleChange} options={[
              { value: '', label: "Mode d'installation" }, { value: 'brutal', label: 'Brutal' },
              { value: 'progressif', label: 'Progressif' }, { value: 'insidieux', label: 'Insidieux' }
            ]} />
            <Select label="Type d'évolution" name="evolution" value={formData.evolution || ''} onChange={handleChange} options={[
              { value: '', label: "Type d'évolution" }, { value: 'stable', label: 'Stable' },
              { value: 'progressive', label: 'Progressive' }, { value: 'fluctuante', label: 'Fluctuante' },
              { value: 'poussees', label: 'Poussées-rémissions' }
            ]} />
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default AnamnesisSection;
