
import React, { useMemo } from 'react';
import SectionWrapper from './SectionWrapper';
import Select from '../ui/Select';
import CheckboxItem from '../ui/CheckboxItem';
import Alert from '../ui/Alert';
import type { FormData, AnalysisResults, TreatmentPlanResult, FinalDiagnosisResult } from '../../types';
import { CTD_CODES } from '../../types'; // Corrected import path
import { TREATMENT_PROGNOSTIC_FACTORS_INPUTS, ILD_SEVERITY_OPTIONS, DISEASE_PROGRESSION_OPTIONS } from '../../constants';

interface TreatmentPlanSectionProps {
  formData: FormData; // Contains treatmentPlanInputs
  updateFormData: (data: Partial<FormData>) => void; // To update treatmentPlanInputs
  analysisResults: AnalysisResults;
  setAnalysisResults: React.Dispatch<React.SetStateAction<AnalysisResults>>;
  onNext: () => void;
}

const TreatmentPlanSection: React.FC<TreatmentPlanSectionProps> = ({ formData: allFormData, updateFormData: updateAllFormData, analysisResults, setAnalysisResults, onNext }) => {
  const treatmentPlanInputs = allFormData.treatmentPlanInputs || {};

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    const newTreatmentInputs = {
      ...treatmentPlanInputs,
      [name]: type === 'checkbox' ? checked : value
    };
    updateAllFormData({ treatmentPlanInputs: newTreatmentInputs });
  };

  const finalDiagnosis = analysisResults.finalDiagnosis;
  const targetedImmuno = analysisResults.targetedImmuno;
  const selectedPattern = analysisResults.selectedPattern; // HRCT Pattern

  const currentPrognosticFactors = useMemo(() => {
    let factors = [...TREATMENT_PROGNOSTIC_FACTORS_INPUTS.common];
    if (finalDiagnosis?.ctdCode === CTD_CODES.PMDM) {
      factors = [...factors, ...TREATMENT_PROGNOSTIC_FACTORS_INPUTS.pmdm];
    } else if (finalDiagnosis?.ctdCode === CTD_CODES.SSc) {
      factors = [...factors, ...TREATMENT_PROGNOSTIC_FACTORS_INPUTS.ssc];
    } else if (finalDiagnosis?.ctdCode === CTD_CODES.RA) {
      factors = [...factors, ...TREATMENT_PROGNOSTIC_FACTORS_INPUTS.ra];
    }
    return factors;
  }, [finalDiagnosis?.ctdCode]);


  const generatePlan = () => {
    if (!finalDiagnosis) return;

    const { ildSeverity, diseaseProgression } = treatmentPlanInputs;
    // Specific prognostic flags from form:
    const isAntiMDA5Positive = treatmentPlanInputs.antiMda5Positive || treatmentPlanInputs.antiMda5Risk; // from new constant or old form
    const isAntiARSPositive = treatmentPlanInputs.antiARSPositive;
    const isUIPPattern = treatmentPlanInputs.uipPatternHRCT || treatmentPlanInputs.uipPattern || selectedPattern === 'UIP'; // from new constant or old form or selectedPattern
    const isRPIld = ildSeverity === 'rp-ild' || diseaseProgression === 'rapidly_progressive' || treatmentPlanInputs.rpILD;
    const isExtensiveSScILD = ildSeverity === 'moderate' || ildSeverity === 'severe'; // Based on SSc FIG 2 definition (CVF<70% or HRCT >20%)
    const isEndStageSScILD = ildSeverity === 'end-stage'; // %FVC <50% or O2 therapy

    let plan: TreatmentPlanResult = { urgency: 'Standard', firstLine: '', medications: [], monitoring: [], notes: [] };
    
    // PM/DM-ILD Treatment (Ref: Fig 1, p.718)
    if (finalDiagnosis.ctdCode === CTD_CODES.PMDM) {
      plan.notes = plan.notes || []; // Ensure notes array exists
      plan.notes.push("PM/DM-ILD: Algorithme basé sur Fig.1 du guide 2020.");
      if (isRPIld && isAntiMDA5Positive) { // Acute/Subacute, MDA5+, poor prognosis expected
        plan = {
          urgency: '🚨 URGENCE VITALE', firstLine: 'RP-ILD Anti-MDA5 (+) sospetta: TRIPLE THERAPIE IMMEDIATE (PSL forte dose + CNI + IVCY)',
          medications: [
            'Méthylprednisolone (mPSL) pulse 500-1000mg/j IV x3j, puis Prednisolone (PSL) 1mg/kg/j',
            'Tacrolimus (TAC) C0: 10-15 ng/mL OU Cyclosporine (CsA) C0: 150-200 ng/mL (ou C2: 1000-1500 ng/mL)',
            'Cyclophosphamide (IVCY) 500-1000mg/m²/mois (adapter à fonction rénale/âge)',
            'Hospitalisation (soins intensifs si SpO2 <90% ou détresse respiratoire)'
          ],
          monitoring: ['Clinique rapprochée (SpO2, FR, dyspnée)', 'Bilan biologique fréquent (NFS, rein, foie, CPK, LDH, Ferritine, KL-6)', 'HRCT contrôle précoce (J7-J14)'],
          secondLine: 'Si inefficace J10-14: discuter échanges plasmatiques, IgIV, Rituximab. Orientation centre expert.',
          notes: ["Anti-MDA5(+) RP-ILD: pronostic sombre, traitement agressif d'emblée.", "CNI: adapter posologie selon fonction rénale et interactions."]
        };
      } else if (diseaseProgression === 'rapidly_progressive' || ildSeverity === 'rp-ild' || ildSeverity === 'severe' ) { // Acute/Subacute, other forms or MDA5- without immediate RP-ILD markers
         plan = {
          urgency: 'Traitement urgent', firstLine: 'ILD Aiguë/Subaiguë Sévère (non-MDA5+ RP-ILD typique): PSL forte dose + Immunosuppresseur (IS)',
          medications: [
            'mPSL pulse 500-1000mg/j IV x3j (si hypoxémie/atteinte étendue), puis PSL 0.5-1mg/kg/j',
            'CNI: TAC C0: 5-10 ng/mL OU CsA C0: 100-150 ng/mL (ou C2: 600-800 ng/mL) - Souvent préféré',
            'Alternative IS: IVCY (si CNI insuffisant/contre-indiqué)'
          ],
          monitoring: ['Évaluation réponse à S2-S4', 'Bilan biologique régulier'],
          secondLine: 'Si CNI seul insuffisant, considérer ajout IVCY. Si progression rapide, réévaluer pour triple thérapie.',
          notes: ["Si multiples facteurs de mauvais pronostic (âge, SpO2, CRP, Ferritine, KL-6), traitement plus agressif peut être requis."]
        };
      } else if (diseaseProgression === 'slowly_progressive') { // Chronic - Progressive
        plan.firstLine = 'ILD Chronique Progressive: PSL ± Immunosuppresseur(s)';
        plan.medications = ['PSL 0.5-1mg/kg/j (réduire progressivement)', 'IS: TAC, CsA, IVCY, ou MMF selon profil patient et réponse.'];
        plan.notes = plan.notes || [];
        if (isAntiARSPositive) plan.notes.push("Syndrome Anti-Synthétase: ILD chronique fréquente, bonne réponse initiale mais rechutes possibles. MMF ou AZA en maintenance.");
        plan.monitoring = ['EFR/HRCT tous les 3-6 mois pour évaluer progression.'];
      } else { // Chronic - Non-progressive
        plan.firstLine = 'ILD Chronique Non Progressive: Surveillance ou PSL faible dose';
        plan.notes = plan.notes || [];
        if (isAntiMDA5Positive || isAntiARSPositive) {
            plan.medications = ['PSL faible dose (ex: 5-10mg/j) et/ou IS de maintenance (AZA, MMF) si antécédent d\'activité.'];
            plan.notes.push("Même si non-progressif actuellement, Ac spécifiques peuvent indiquer risque de réactivation.");
        } else {
            plan.medications = ['Surveillance rapprochée sans traitement ou PSL faible dose si symptomatique.'];
        }
        plan.monitoring = ['EFR/HRCT tous les 6-12 mois.'];
      }
    }
    // SSc-ILD Treatment (Ref: Fig 2, p.721 & text)
    else if (finalDiagnosis.ctdCode === CTD_CODES.SSc) {
      plan.notes = plan.notes || [];
      plan.notes.push("SSc-ILD: Algorithme basé sur Fig.2 du guide 2020.");
      if (isEndStageSScILD) {
        plan.urgency = "Soins palliatifs / Transplantation";
        plan.firstLine = "Maladie terminale (O2-dépendance ou CVF <50%)";
        plan.medications = ["Oxygénothérapie", "Réhabilitation respiratoire", "Soins de support"];
        if (!treatmentPlanInputs.ageOver60) { // Assuming ageOver60 refers to >60, so <60 is !ageOver60
          plan.medications.push("CONSIDÉRER INSCRIPTION SUR LISTE DE TRANSPLANTATION PULMONAIRE.");
        } else {
          plan.medications.push("Discuter Nintédanib ou IS avec prudence (données limitées pour ce stade).");
        }
      } else if (isExtensiveSScILD || (treatmentPlanInputs.extensiveFibrosisHRCT || treatmentPlanInputs.lowDLCO)) { // Extensive disease OR Limited with risk factors (simplified for now)
        plan.firstLine = "SSc-ILD extensive OU limitée avec facteurs de risque de progression";
        plan.medications = [
          "Option 1: Cyclophosphamide (POCY ou IVCY) pour 6-12 mois, PUIS relais par Azathioprine (AZA) ou Mycophenolate Mofetil (MMF). (Dose totale CYC < 36g)",
          "Option 2: Mycophenolate Mofetil (MMF) 2-3g/j d'emblée.",
          "Option 3: Nintédanib 150mg x2/j (seul ou en association avec MMF ou CYC - éviter CYC+MMF).",
          "Tocilizumab (TCZ) peut être une option, surtout si SSc cutanée diffuse précoce et progressive."
        ];
        plan.monitoring = ["EFR et HRCT tous les 6-12 mois pour évaluer la réponse/progression."];
        plan.secondLine = "Si progression: Changer/associer les options de 1ère ligne, Rituximab (RTX), Transplantation de cellules souches hématopoïétiques (HSCT) dans centres experts.";
        plan.notes = plan.notes || [];
        plan.notes.push("PSL faible dose (<10-15mg/j) si inflammation active, mais prudence (risque crise rénale sclérodermique).");
      } else { // Limited disease without clear risk factors for progression
        plan.firstLine = "SSc-ILD limitée sans facteurs de risque clairs de progression";
        plan.medications = ["Surveillance active avec EFR et HRCT tous les 6-12 mois."];
        plan.monitoring = ["Si progression documentée, traiter comme 'limitée avec facteurs de risque'."];
        plan.notes = plan.notes || [];
        plan.notes.push("Discuter Nintédanib même en l'absence de progression si fibrose >10% sur HRCT (SENSCIS).");
      }
    }
    // RA-ILD Treatment (Ref: p.723-724)
    else if (finalDiagnosis.ctdCode === CTD_CODES.RA) {
      plan.notes = plan.notes || [];
      plan.notes.push("PR-ILD: Recommandations basées sur le pattern HRCT et l'activité de la PR.");
      if (isUIPPattern) {
        plan.urgency = "⚠️ Pattern UIP - Prudence";
        plan.firstLine = "PR-UIP: Approche similaire à FPI, IS controversés.";
        plan.medications = [
          "Optimiser traitement de la PR (DMARDs, Biothérapies). Éviter MTX si ILD active/sévère ou facteurs de risque.",
          "Nintédanib ou Pirfénidone (comme pour FPI) à discuter, surtout si progression.",
          "PSL faible dose (<10-15mg/j) si inflammation active ou exacerbation. Éviter fortes doses prolongées."
        ];
        plan.monitoring = ["EFR/DLCO/Test de marche tous les 3-6 mois.", "HRCT tous les 6-12 mois.", "Surveillance exacerbations aiguës."];
        plan.secondLine = "Orientation précoce vers transplantation pulmonaire si progression et éligibilité.";
        plan.notes = plan.notes || [];
        plan.notes.push("Le rôle des IS dans PR-UIP reste débattu. Rituximab ou Abatacept peuvent être plus sûrs pour la PR avec ILD que anti-TNF.");
      } else if (selectedPattern === 'fNSIP' || selectedPattern === 'OP' || selectedPattern === 'FOP' ) { // NSIP/OP
        plan.firstLine = `PR-ILD (Pattern ${selectedPattern || 'NSIP/OP'}): Traitement anti-inflammatoire/immunosuppresseur.`;
        plan.medications = [
          "PSL 0.5-1mg/kg/j initialement, puis dégression lente.",
          "Concomitant: MMF, AZA, ou Cyclosporine/Tacrolimus.",
          "Optimiser traitement PR (DMARDs, Biothérapies - prudence avec MTX, anti-TNF)."
        ];
        plan.monitoring = ["EFR/DLCO tous les 3-6 mois.", "HRCT à 6 mois, puis selon évolution."];
        plan.secondLine = "Si résistance/rechute: Rituximab, IVCY."
      } else if (selectedPattern === 'DAD' || diseaseProgression === 'acute_exacerbation') {
        plan.urgency = "🚨 URGENCE";
        plan.firstLine = "PR-ILD - Exacerbation Aiguë / DAD: Exclure infection. Traitement agressif.";
        plan.medications = ["mPSL pulse IV 500-1000mg/j x3j", "IVCY à discuter", "Support ventilatoire si besoin."];
        plan.monitoring = ["Réévaluation très rapprochée."];
      } else {
        plan.firstLine = "PR-ILD (Pattern indéterminé ou autre): Approche individualisée.";
        plan.medications = ["Surveillance si stable et peu symptomatique.", "Traitement similaire à NSIP/OP si inflammation/progression."];
      }
    }
    // SLE-ILD (Ref: p.726-727)
    else if (finalDiagnosis.ctdCode === CTD_CODES.SLE) {
      plan.notes = plan.notes || [];
      plan.notes.push("LED-ILD: Distinguer pneumopathie lupique aiguë (PLA) et ILD chronique.");
      if (diseaseProgression === 'acute_exacerbation' || ildSeverity === 'rp-ild' || ildSeverity === 'severe') { // Acute Lupus Pneumonitis / Severe ILD
        plan.urgency = "🚨 URGENCE";
        plan.firstLine = "Pneumopathie Lupique Aiguë / ILD Sévère-Aiguë: Traitement immunosuppresseur majeur.";
        plan.medications = [
          "mPSL pulse IV 1g/j x3-5j, puis PSL 1-1.5mg/kg/j.",
          "IVCY (schéma Euro-Lupus ou NIH) OU MMF forte dose (2-3g/j).",
          "Si réfractaire/très sévère: Rituximab, échanges plasmatiques, IgIV."
        ];
        plan.monitoring = ["Réponse clinique et radiologique à J7-J14."];
        plan.notes = plan.notes || [];
        plan.notes.push("HCQ peut être poursuivi/ajouté. Exclure infection!");
      } else { // Chronic ILD
        plan.firstLine = "LED-ILD Chronique: Corticoïdes ± Immunosuppresseur.";
        plan.medications = ["PSL 0.5-1mg/kg/j initialement, dégression selon réponse.", "MMF (1-2g/j) ou AZA (1-2mg/kg/j) en épargne cortisonique ou si réfractaire.", "Rituximab en cas d'échec."];
        plan.monitoring = ["EFR/HRCT tous les 3-6 mois initialement."];
      }
    }
    // SS-ILD (Ref: p.725-726)
    else if (finalDiagnosis.ctdCode === CTD_CODES.SS) {
        plan.notes = plan.notes || [];
        plan.notes.push("Sjögren-ILD: Souvent NSIP ou LIP. Traitement si symptomatique ou progressif.");
        plan.firstLine = "Sjögren-ILD: Corticoïdes ± Immunosuppresseur.";
        plan.medications = [
            "PSL 0.5-1mg/kg/j si ILD active/progressive, puis dégression.",
            "MMF ou AZA en épargne cortisonique ou si insuffisant.",
            "Rituximab rapporté comme efficace dans des cas réfractaires."
        ];
        plan.monitoring = ["EFR/HRCT tous les 6-12 mois. Attention aux complications infectieuses (kystes)."];
    }
     // MCTD-ILD (Ref: p.726)
    else if (finalDiagnosis.ctdCode === CTD_CODES.MCTD) {
        plan.notes = plan.notes || [];
        plan.notes.push("MCTD-ILD: Traiter selon le phénotype dominant (SSc-like, PM-like, SLE-like).");
        plan.firstLine = "MCTD-ILD: Approche basée sur le phénotype ILD prédominant.";
        plan.medications = [
            "Si pattern/évolution SSc-like: cf. algorithme SSc-ILD.",
            "Si pattern/évolution PM-like: cf. algorithme PM-ILD.",
            "Généralement: PSL ± IS (MMF, AZA, CYC si sévère)."
        ];
        plan.monitoring = ["Surveillance EFR/HRCT et recherche PH."];
    }
    // IPAF or other CTDs not specifically detailed
    else {
      plan.firstLine = `Traitement pour ${finalDiagnosis.ctdName}-ILD`;
      plan.medications = ["Prednisolone 0.5-1mg/kg/j (selon sévérité/activité)", "Immunosuppresseur adapté (MMF, AZA, Tacrolimus) si besoin d'épargne cortisonique ou si maladie progressive/sévère.", "Nintédanib ou Pirfénidone à discuter si phénotype fibrosant progressif (PF-ILD) malgré traitement IS."];
      plan.monitoring = ["EFR tous les 3-6 mois", "HRCT tous les 6-12 mois"];
      plan.secondLine = "Adapter selon réponse et tolérance. Discuter biothérapies ou antifibrotiques si progression.";
      plan.notes = plan.notes || [];
      if (finalDiagnosis.ctdCode === CTD_CODES.IPAF) {
        plan.notes.push("IPAF: Traitement guidé par le pattern HRCT et la sévérité. Si NSIP/OP-like -> CS/IS. Si UIP-like et progressif -> antifibrotiques peuvent être envisagés (PF-ILD).");
      }
    }
    setAnalysisResults(prev => ({ ...prev, treatmentPlan: plan }));
  };
  
  const treatmentPlanResult = analysisResults.treatmentPlan;

  return (
    <SectionWrapper
      title="💊 Plan Thérapeutique (Basé sur le Guide 2020)"
      onAnalyze={analysisResults.finalDiagnosis ? generatePlan : undefined}
      analysisResult={treatmentPlanResult && (
        <Alert 
            type={treatmentPlanResult.urgency.includes('URGENCE') ? 'danger' : treatmentPlanResult.urgency.includes('⚠️') ? 'warning' : 'success'} 
            title={`Protocole Thérapeutique Recommandé (${treatmentPlanResult.urgency})`}
        >
          <p className="font-semibold">{treatmentPlanResult.firstLine}</p>
          {treatmentPlanResult.medications.length > 0 && <>
            <h5 className="font-medium mt-2 mb-1">💊 Protocole Médicamenteux Suggéré :</h5>
            <ul className="list-disc list-inside text-sm pl-4 space-y-0.5">
              {treatmentPlanResult.medications.map((med, i) => <li key={i} dangerouslySetInnerHTML={{ __html: med }}></li>)}
            </ul>
          </>}
          {treatmentPlanResult.monitoring.length > 0 && <>
            <h5 className="font-medium mt-2 mb-1">📊 Surveillance Proposée :</h5>
            <ul className="list-disc list-inside text-sm pl-4 space-y-0.5">
              {treatmentPlanResult.monitoring.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </>}
          {treatmentPlanResult.secondLine && <>
            <h5 className="font-medium mt-2 mb-1">🔄 Deuxième ligne / Options si échec :</h5>
            <p className="text-sm">{treatmentPlanResult.secondLine}</p>
          </>}
           {treatmentPlanResult.notes && treatmentPlanResult.notes.length > 0 && <>
            <h5 className="font-medium mt-2 mb-1">📝 Notes importantes :</h5>
            <ul className="list-disc list-inside text-sm pl-4 space-y-0.5">
              {treatmentPlanResult.notes.map((note, i) => <li key={i}>{note}</li>)}
            </ul>
          </>}
        </Alert>
      )}
      onNext={onNext}
      showNextButton={!!treatmentPlanResult}
    >
      {!analysisResults.finalDiagnosis && <Alert type="warning">Veuillez d'abord finaliser le diagnostic à l'étape précédente.</Alert>}
      {analysisResults.finalDiagnosis && <div className="form-group space-y-4">
        <div>
          <label className="block mb-2 text-md font-medium text-slate-700">Sévérité de l'ILD (Clinique/EFR/HRCT)</label>
          <Select name="ildSeverity" value={treatmentPlanInputs.ildSeverity || ''} onChange={handleChange} options={ILD_SEVERITY_OPTIONS} />
        </div>
        <div>
          <label className="block mb-2 text-md font-medium text-slate-700">Profil Évolutif Récent de l'ILD</label>
          <Select name="diseaseProgression" value={treatmentPlanInputs.diseaseProgression || ''} onChange={handleChange} options={DISEASE_PROGRESSION_OPTIONS} />
        </div>
        <div>
          <label className="block mb-2 text-md font-medium text-slate-700">Facteurs Pronostiques / Spécificités :</label>
          <div className="checkbox-group grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentPrognosticFactors.map(item => (
              <CheckboxItem 
                key={item.id} 
                id={item.id} 
                name={item.id} 
                label={item.label} 
                checked={!!treatmentPlanInputs[item.id]} 
                onChange={handleChange} />
            ))}
          </div>
        </div>
      </div>}
    </SectionWrapper>
  );
};

export default TreatmentPlanSection;
