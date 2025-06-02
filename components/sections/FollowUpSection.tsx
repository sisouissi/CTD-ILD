
import React from 'react';
import SectionWrapper from './SectionWrapper';
import Select from '../ui/Select';
import Alert from '../ui/Alert';
import type { FormData, AnalysisResults, FollowUpPlanResult } from '../../types';

interface FollowUpSectionProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  analysisResults: AnalysisResults;
  setAnalysisResults: React.Dispatch<React.SetStateAction<AnalysisResults>>;
  onNext: () => void;
}

const FollowUpSection: React.FC<FollowUpSectionProps> = ({ formData, updateFormData, analysisResults, setAnalysisResults, onNext }) => {

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFormData({ [e.target.name]: e.target.value });
  };

  const generatePlan = () => {
    const phase = formData.treatmentPhase;
    let plan: FollowUpPlanResult = { schedule: {}, alerts: [], objectives: [] };

    if (phase === 'initiation') {
      plan = {
        schedule: { consultation: "Toutes les 2-4 semaines", biologie: "Toutes les 2 semaines puis mensuelle", efr: "À 1, 3 et 6 mois", hrct: "À 6 mois", echocardiographie: "À 6 mois", biomarqueurs: "KL-6, SP-D à 1, 3, 6 mois" },
        alerts: ["Déclin CVF >10% ou >200mL", "Déclin DLCO >15%", "Progression radiologique", "Aggravation dyspnée (+1 mMRC)", "Infections opportunistes", "Effets secondaires médicamenteux"],
        objectives: ["Stabilisation fonction pulmonaire", "Contrôle inflammation (CRP, VS)", "Amélioration qualité de vie", "Prévention exacerbations"]
      };
    } else if (phase === 'stabilization') {
      plan = {
        schedule: { consultation: "Tous les 2-3 mois", biologie: "Mensuelle puis trimestrielle", efr: "Tous les 3-6 mois", hrct: "Tous les 6-12 mois", echocardiographie: "Annuelle", biomarqueurs: "Tous les 3-6 mois" },
        alerts: ["Déclin CVF >5% entre 2 mesures", "Nouvel épisode de dyspnée", "Infection respiratoire", "Signes d'HTAP (échocardiographie)"],
        objectives: ["Maintien fonction pulmonaire stable", "Sevrage corticoïdes <10mg/j", "Retour activités de la vie quotidienne", "Prévention complications à long terme"]
      };
    } else if (phase === 'maintenance') {
      plan = {
        schedule: { consultation: "Tous les 3-6 mois", biologie: "Tous les 3-6 mois", efr: "Tous les 6 mois", hrct: "Annuelle", echocardiographie: "Annuelle", biomarqueurs: "Tous les 6 mois" },
        alerts: ["Toute détérioration de la fonction pulmonaire", "Récidive de l'activité de la CTD", "Infections récidivantes", "Néoplasies (surveillance accrue)"],
        objectives: ["Prévention de la progression", "Qualité de vie optimale", "Dose minimale efficace d'immunosuppresseurs", "Dépistage complications long terme"]
      };
    } else if (phase === 'progression') {
        plan = {
          schedule: { consultation: "Rapprochée (selon sévérité)", biologie: "Régulière (selon traitement)", efr: "Fréquente (tous les 1-3 mois)", hrct: "Selon besoin clinique", echocardiographie: "Selon besoin clinique", biomarqueurs: "Réguliers (KL-6, SP-D)" },
          alerts: ["Absence d'amélioration malgré adaptation thérapeutique", "Effets secondaires majeurs des traitements de seconde ligne", "Dégradation rapide de l'état général"],
          objectives: ["Réévaluer le diagnostic et les options thérapeutiques", "Discuter greffe pulmonaire si éligible", "Soins palliatifs et de support si indiqué", "Maintenir la meilleure qualité de vie possible"]
        };
    }
    setAnalysisResults(prev => ({ ...prev, followUpPlan: plan }));
  };

  const followUpPlanResult = analysisResults.followUpPlan;

  return (
    <SectionWrapper
      title="📅 Protocole de Surveillance"
      onAnalyze={generatePlan}
      analysisResult={followUpPlanResult && (
        <div className="space-y-4">
          <h4 className="text-md font-semibold text-slate-700">Calendrier de Surveillance Personnalisé :</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-slate-200 rounded-md shadow">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider border-b border-slate-200">Paramètre</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider border-b border-slate-200">Fréquence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {Object.entries(followUpPlanResult.schedule).map(([param, freq]) => (
                  <tr key={param}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-slate-800">{param.charAt(0).toUpperCase() + param.slice(1)}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-slate-600">{freq}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Alert type="warning" title="Critères d'Alerte">
            <ul className="list-disc list-inside pl-4 space-y-0.5">
              {followUpPlanResult.alerts.map((alert, i) => <li key={i}>{alert}</li>)}
            </ul>
          </Alert>
          <Alert type="info" title="Objectifs Thérapeutiques">
            <ul className="list-disc list-inside pl-4 space-y-0.5">
              {followUpPlanResult.objectives.map((goal, i) => <li key={i}>{goal}</li>)}
            </ul>
          </Alert>
        </div>
      )}
      onNext={onNext}
      showNextButton={!!followUpPlanResult}
      nextButtonText="Générer Rapport Final →"
    >
      <div className="form-group">
        <label className="block mb-2 text-md font-medium text-slate-700">Phase Thérapeutique</label>
        <Select name="treatmentPhase" value={formData.treatmentPhase || 'initiation'} onChange={handleChange} options={[
          { value: 'initiation', label: 'Initiation (0-6 mois)' },
          { value: 'stabilization', label: 'Stabilisation (6-18 mois)' },
          { value: 'maintenance', label: 'Maintenance (>18 mois)' },
          { value: 'progression', label: 'Progression malgré traitement' }
        ]} />
      </div>
    </SectionWrapper>
  );
};

export default FollowUpSection;

