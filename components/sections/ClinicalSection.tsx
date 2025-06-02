
import React from 'react';
import SectionWrapper from './SectionWrapper';
import CheckboxItem from '../ui/CheckboxItem';
import Select from '../ui/Select';
import Alert from '../ui/Alert';
import type { FormData, ClinicalAnalysisResult, AnalysisResults, CTDScores } from '../../types';
import { CTD_NAMES } from '../../types';


interface ClinicalSectionProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  analysisResult?: ClinicalAnalysisResult;
  setAnalysisResults: React.Dispatch<React.SetStateAction<AnalysisResults>>;
  onNext: () => void;
}

const ClinicalSection: React.FC<ClinicalSectionProps> = ({ formData, updateFormData, analysisResult, setAnalysisResults, onNext }) => {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    updateFormData({ [name]: type === 'checkbox' ? checked : value });
  };
  
  const runClinicalAnalysis = () => {
    let ctdSuspicions: CTDScores = { RA: 0, SSc: 0, PMDM: 0, SLE: 0, SS: 0, MCTD: 0 };
    if (formData.arthritis) { ctdSuspicions.RA += 25; ctdSuspicions.SLE += 15; }
    if (formData.morningStiffness) { ctdSuspicions.RA += 20; }
    if (formData.raynaudPresent === 'oui') { ctdSuspicions.SSc += 30; ctdSuspicions.MCTD += 25; ctdSuspicions.PMDM += 10;}
    if (formData.sclerodactyly) { ctdSuspicions.SSc += 25; }
    if (formData.heliotrope || formData.gottron) { ctdSuspicions.PMDM += 35; }
    if (formData.muscleWeakness) { ctdSuspicions.PMDM += 20; }
    if (formData.malarRash || formData.photosensitivity) { ctdSuspicions.SLE += 25; }
    if (formData.dryEyes || formData.dryMouth) { ctdSuspicions.SS += 30; }
    
    setAnalysisResults(prev => ({ ...prev, clinical: { ctdSuspicions } }));
  };

  const articularSigns = [
    { id: 'arthritis', label: 'Arthrites périphériques' }, { id: 'morningStiffness', label: 'Raideur matinale > 1h' },
    { id: 'deformities', label: 'Déformations articulaires' }, { id: 'muscleWeakness', label: 'Faiblesse musculaire proximale' },
    { id: 'myalgia', label: 'Myalgies' },
  ];
  const skinSigns = [
    { id: 'malarRash', label: 'Érythème malaire' }, { id: 'heliotrope', label: 'Éruption héliotrope' },
    { id: 'gottron', label: 'Papules de Gottron' }, { id: 'sclerodactyly', label: 'Sclérodactylie' },
    { id: 'telangiectasia', label: 'Télangiectasies' }, { id: 'digitalUlcers', label: 'Ulcérations digitales' },
    { id: 'oralUlcers', label: 'Ulcérations buccales' }, { id: 'photosensitivity', label: 'Photosensibilité' },
  ];
  const respiratorySigns = [
    { id: 'dyspnea', label: "Dyspnée d'effort" }, { id: 'dryCough', label: 'Toux sèche' },
    { id: 'crackles', label: 'Crépitants basaux' }, { id: 'clubbing', label: 'Hippocratisme digital' },
    { id: 'cyanosis', label: 'Cyanose' },
  ];
  const systemicSigns = [
    { id: 'dryEyes', label: 'Sécheresse oculaire' }, { id: 'dryMouth', label: 'Sécheresse buccale' },
    { id: 'fever', label: 'Fièvre' }, { id: 'weightLoss', label: 'Amaigrissement' },
    { id: 'lymphNodes', label: 'Adénopathies' },
  ];

  return (
    <SectionWrapper
      title="🔍 Examen Clinique Systématique"
      onAnalyze={runClinicalAnalysis}
      analysisResult={analysisResult && (
        <div className="presumption-box bg-gradient-to-r from-blue-600 to-blue-700 text-white p-5 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <span className="text-2xl mr-2">🎯</span> Présomptions Cliniques
          </h3>
          <div className="ctd-probability grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Object.entries(analysisResult.ctdSuspicions).map(([ctd, score]) => (
              <div key={ctd} className="probability-card bg-white/20 p-3 rounded-md text-center">
                <div className="text-sm font-medium">{CTD_NAMES[ctd] || ctd}</div>
                <div className="text-2xl font-bold my-1">{score}%</div>
              </div>
            )).filter(Boolean)} {/* Filter out undefined if CTD_NAMES misses one */}
          </div>
        </div>
      )}
      onNext={onNext}
      showNextButton={!!analysisResult}
    >
      <div className="form-group space-y-4">
        <div>
          <label className="block mb-2 text-md font-medium text-slate-700">Signes Articulaires</label>
          <div className="checkbox-group grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {articularSigns.map(item => (
              <CheckboxItem key={item.id} id={item.id} label={item.label} checked={!!formData[item.id]} onChange={handleChange} />
            ))}
          </div>
        </div>
        <div>
          <label className="block mb-2 text-md font-medium text-slate-700">Signes Cutanéo-Muqueux</label>
          <div className="checkbox-group grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {skinSigns.map(item => (
              <CheckboxItem key={item.id} id={item.id} label={item.label} checked={!!formData[item.id]} onChange={handleChange} />
            ))}
          </div>
        </div>
        <div>
          <label className="block mb-2 text-md font-medium text-slate-700">Phénomène de Raynaud</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select label="Phénomène de Raynaud" name="raynaudPresent" value={formData.raynaudPresent || ''} onChange={handleChange} options={[
              { value: '', label: 'Phénomène de Raynaud' }, { value: 'oui', label: 'Présent' }, { value: 'non', label: 'Absent' }
            ]} />
            <Select label="Séquence" name="raynaudSequence" value={formData.raynaudSequence || ''} onChange={handleChange} options={[
              { value: '', label: 'Séquence' },{ value: 'triphasique', label: 'Triphasique (Blanc-Bleu-Rouge)' },{ value: 'biphasique', label: 'Biphasique' }
            ]} />
            <Select label="Sévérité" name="raynaudSeverity" value={formData.raynaudSeverity || ''} onChange={handleChange} options={[
              { value: '', label: 'Sévérité' },{ value: 'leger', label: 'Léger' },{ value: 'modere', label: 'Modéré' },{ value: 'severe', label: 'Sévère (complications)' }
            ]} />
          </div>
        </div>
        <div>
          <label className="block mb-2 text-md font-medium text-slate-700">Signes Respiratoires (Examen Physique)</label>
          <div className="checkbox-group grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {respiratorySigns.map(item => (
              <CheckboxItem key={item.id} id={item.id} label={item.label} checked={!!formData[item.id]} onChange={handleChange} />
            ))}
          </div>
        </div>
        <div>
          <label className="block mb-2 text-md font-medium text-slate-700">Autres Signes Systémiques</label>
          <div className="checkbox-group grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {systemicSigns.map(item => (
              <CheckboxItem key={item.id} id={item.id} label={item.label} checked={!!formData[item.id]} onChange={handleChange} />
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default ClinicalSection;
