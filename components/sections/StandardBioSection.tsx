
import React from 'react';
import SectionWrapper from './SectionWrapper';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Alert from '../ui/Alert';
import type { FormData, StandardBioAnalysisResult, AnalysisResults } from '../../types';

interface StandardBioSectionProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  analysisResult?: StandardBioAnalysisResult;
  setAnalysisResults: React.Dispatch<React.SetStateAction<AnalysisResults>>;
  onNext: () => void;
}

const StandardBioSection: React.FC<StandardBioSectionProps> = ({ formData, updateFormData, analysisResult, setAnalysisResults, onNext }) => {
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    updateFormData({ [e.target.name]: e.target.value });
  };

  const runStandardBioAnalysis = () => {
    const { anaTiter, anaPattern, rf, antiCcp, cpk, ancaMpo } = formData;
    let orientations: string[] = [];
    let nextTests: string[] = [];

    if (anaTiter && anaTiter !== 'negative') {
      if (anaPattern === 'homogeneous') { orientations.push("ANA homogène → Rechercher Anti-ADN natif, Anti-histones (SLE)"); nextTests.push("Anti-ADN natif, Anti-Sm, Anti-SSA/SSB"); }
      else if (anaPattern === 'speckled') { orientations.push("ANA moucheté → Rechercher Anti-Sm, RNP, SSA/SSB"); nextTests.push("Anti-Sm, Anti-RNP, Anti-SSA/SSB"); }
      else if (anaPattern === 'nucleolar') { orientations.push("ANA nucléolaire → Suspecter SSc, rechercher Anti-Scl70"); nextTests.push("Anti-Scl70, Anti-PM-Scl, Anti-Th/To"); }
      else if (anaPattern === 'centromere') { orientations.push("ANA centromère → SSc limitée probable"); nextTests.push("Anticentromère (confirmation), Capillaroscopie"); }
      else if (anaPattern === 'cytoplasmic') { orientations.push("ANA cytoplasmique → Suspecter myosite"); nextTests.push("Anti-Jo1, Anti-PL7/PL12, Anti-MDA5"); }
    }
    if (parseFloat(rf) > 20 || parseFloat(antiCcp) > 17) { orientations.push("FR+ et/ou Anti-CCP+ → Polyarthrite rhumatoïde probable"); nextTests.push("Bilan PR complet, Recherche RA-ILD");}
    if (parseFloat(cpk) > 200) { orientations.push("CPK élevées → Suspecter myosite"); nextTests.push("Anti-Jo1, Anti-MDA5, Anti-Mi2, EMG, Biopsie musculaire");}
    if (ancaMpo === 'positive') { orientations.push("MPO-ANCA+ → Vascularite ou ILD-ANCA+"); nextTests.push("Bilan vascularite, Recherche atteinte rénale");}

    setAnalysisResults(prev => ({ ...prev, standardBio: { orientations, nextTests, anaTiter, anaPattern } }));
  };
  
  return (
    <SectionWrapper
      title="🧪 Exploration Biologique Standard"
      onAnalyze={runStandardBioAnalysis}
      analysisResult={analysisResult && (
        <Alert type="success" title="Orientations Biologiques">
          {analysisResult.orientations.length > 0 && <>{analysisResult.orientations.join('<br />')}<br /><br /></>}
          <strong>Tests de 2ème intention recommandés :</strong><br />
          {analysisResult.nextTests.join('<br />')}
        </Alert>
      )}
      onNext={onNext}
      showNextButton={!!analysisResult}
    >
      <Alert type="info" title="Bilan de Débrouillage">
        Explorations systématiques avant immunologie spécialisée
      </Alert>
      <div className="form-group space-y-4 mt-4">
        <div>
          <label className="block mb-2 text-md font-medium text-slate-700">Bilan Inflammatoire</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input label="VS (mm/h)" type="number" name="vs" value={formData.vs || ''} onChange={handleChange} placeholder="Normal < 20" />
            <Input label="CRP (mg/L)" type="number" name="crp" value={formData.crp || ''} onChange={handleChange} placeholder="Normal < 5" />
            <Input label="Ferritine (ng/mL)" type="number" name="ferritin" value={formData.ferritin || ''} onChange={handleChange} placeholder="Normal 15-300" />
          </div>
        </div>
        <div>
          <label className="block mb-2 text-md font-medium text-slate-700">Enzymes Musculaires</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input label="CPK (UI/L)" type="number" name="cpk" value={formData.cpk || ''} onChange={handleChange} placeholder="Normal < 200" />
            <Input label="LDH (UI/L)" type="number" name="ldh" value={formData.ldh || ''} onChange={handleChange} placeholder="Normal < 250" />
            <Input label="Aldolase (UI/L)" type="number" name="aldolase" value={formData.aldolase || ''} onChange={handleChange} placeholder="Normal < 8" />
          </div>
        </div>
        <div>
          <label className="block mb-2 text-md font-medium text-slate-700">Anticorps Antinucléaires (ANA)</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select label="Titre ANA" name="anaTiter" value={formData.anaTiter || ''} onChange={handleChange} options={[
              { value: '', label: 'Titre ANA' }, { value: 'negative', label: 'Négatif' }, { value: '1-80', label: '1/80' },
              { value: '1-160', label: '1/160' }, { value: '1-320', label: '1/320' }, { value: '1-640', label: '1/640' },
              { value: '1-1280', label: '≥1/1280' }
            ]} />
            <Select label="Pattern ANA" name="anaPattern" value={formData.anaPattern || ''} onChange={handleChange} options={[
              { value: '', label: 'Pattern ANA' }, { value: 'homogeneous', label: 'Homogène' }, { value: 'speckled', label: 'Moucheté' },
              { value: 'nucleolar', label: 'Nucléolaire' }, { value: 'centromere', label: 'Centromère' }, { value: 'cytoplasmic', label: 'Cytoplasmique' }
            ]} />
          </div>
        </div>
        <div>
          <label className="block mb-2 text-md font-medium text-slate-700">Facteur Rhumatoïde & Anti-CCP</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="FR (UI/mL)" type="number" name="rf" value={formData.rf || ''} onChange={handleChange} placeholder="Normal < 20" />
            <Input label="Anti-CCP (U/mL)" type="number" name="antiCcp" value={formData.antiCcp || ''} onChange={handleChange} placeholder="Normal < 17" />
          </div>
        </div>
        <div>
          <label className="block mb-2 text-md font-medium text-slate-700">ANCA</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select label="MPO-ANCA" name="ancaMpo" value={formData.ancaMpo || ''} onChange={handleChange} options={[
              { value: '', label: 'MPO-ANCA' }, { value: 'negative', label: 'Négatif' }, { value: 'positive', label: 'Positif' }
            ]} />
            <Select label="PR3-ANCA" name="ancaPr3" value={formData.ancaPr3 || ''} onChange={handleChange} options={[
              { value: '', label: 'PR3-ANCA' }, { value: 'negative', label: 'Négatif' }, { value: 'positive', label: 'Positif' }
            ]} />
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default StandardBioSection;
