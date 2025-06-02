import React, { useState, useEffect } from 'react';
import SectionWrapper from './SectionWrapper';
import CheckboxItem from '../ui/CheckboxItem';
import Alert from '../ui/Alert';
import type { AnalysisResults, SelectedDiagnosis, EssentialTestData, EssentialTestEvaluationResult } from '../../types';
import Button from '../ui/Button';
import { CTD_CODES, CTD_NAMES } from '../../types';


interface EssentialTestsSectionProps {
  selectedCandidateDiagnoses: SelectedDiagnosis[];
  analysisResults: AnalysisResults;
  setAnalysisResults: React.Dispatch<React.SetStateAction<AnalysisResults>>;
  onNext: () => void;
}

const EssentialTestsSection: React.FC<EssentialTestsSectionProps> = ({ 
  selectedCandidateDiagnoses,
  analysisResults,
  setAnalysisResults, 
  onNext 
}) => {
  const [essentialTestsData, setEssentialTestsData] = useState<EssentialTestData>({});
  const [testResults, setTestResults] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    const generateData = () => {
      let data: EssentialTestData = {};
      selectedCandidateDiagnoses.forEach(diagnosis => {
        const code = diagnosis.code;
        // Based on 2020 Guide (Sections: 2.1.1.3 for PM/DM, 2.2.3 for SSc, 2.3.3 for RA, 2.4.3 for SS, 2.6.3 for SLE)
        if (code === CTD_CODES.SSc) {
          data[CTD_CODES.SSc] = {
            name: CTD_NAMES.SSc,
            essential: [
                "Capillaroscopie périunguéale (critère diagnostique majeur)", 
                "Anticorps anti-Scl-70 (topoisomerase I)", 
                "Anticorps anti-centromère (ACA)",
                "Anticorps anti-ARN polymérase III",
                "Échocardiographie (dépistage HTAP et atteinte cardiaque)",
                "EFR complètes (CVF, DLCO) si non déjà faites exhaustivement",
                "HRCT thoracique (si non déjà fait pour bilan ILD initial)"
            ],
            optional: [
                "Manométrie oesophagienne / TOGD (atteinte digestive)", 
                "Biopsie cutanée (si doute diagnostique)",
                "Dosage NT-proBNP (suspicion HTAP/cardio)"
            ],
            criteria: 'Critères ACR/EULAR 2013 (score ≥9)'
          };
        } else if (code === CTD_CODES.PMDM) {
           data[CTD_CODES.PMDM] = {
            name: CTD_NAMES.PMDM,
            essential: [
                "Panel complet d'anticorps spécifiques des myosites (MSA) incluant anti-ARS (Jo-1, PL-7, PL-12, EJ, OJ), anti-MDA5, anti-Mi-2, anti-TIF1gamma, anti-NXP2, anti-SAE",
                "Enzymes musculaires (CPK, LDH, aldolase, transaminases)",
                "EMG (tracé myogène, recherche signes de dénervation si overlap)",
                "IRM musculaire (recherche œdème, inflammation, atrophie, évaluation topographique pour biopsie)"
            ],
            optional: [
                "Biopsie musculaire (si diagnostic incertain ou pour recherche phénotypique)", 
                "Bilan de néoplasie (surtout si DM ou âge > 40 ans, TIF1gamma+)",
                "EFR complètes et HRCT thoracique (systématique pour ILD)",
                "ECG, Échocardiographie (atteinte cardiaque possible)"
            ],
            criteria: 'Critères EULAR/ACR 2017 (score ≥5.5 avec biopsie, ≥6.7 sans biopsie pour Myosite définie)'
          };
        } else if (code === CTD_CODES.SLE) {
          data[CTD_CODES.SLE] = {
            name: CTD_NAMES.SLE,
            essential: [
                "Anticorps anti-ADN natif (quantitatif)", 
                "Anticorps anti-Sm",
                "Dosage du complément (C3, C4, CH50)",
                "Anticorps antiphospholipides (Anticoagulant lupique, anti-cardiolipine IgG/IgM, anti-beta2GP1 IgG/IgM)",
                "Protéinurie des 24h / Rapport Protéine/Créatinine urinaire",
                "Sédiment urinaire (recherche cylindres, hématurie)"
            ],
            optional: [
                "Anti-RNP, anti-SSA/Ro, anti-SSB/La (si non déjà faits)",
                "Test de Coombs direct",
                "Biopsie rénale (si protéinurie significative ou syndrome néphrotique/néphritique)",
                "HRCT thoracique et EFR (si suspicion ILD)"
            ],
            criteria: 'Critères EULAR/ACR 2019 (score ≥10 avec au moins 1 critère clinique)'
          };
        } else if (code === CTD_CODES.SS) {
           data[CTD_CODES.SS] = {
            name: CTD_NAMES.SS,
            essential: [
                "Anticorps anti-SSA/Ro (Ro60 et/ou Ro52) et anti-SSB/La",
                "Test de Schirmer et/ou test au Rose Bengale/Vert de Lissamine (sécheresse oculaire objective)",
                "Biopsie des glandes salivaires accessoires (BGSA) - Chisholm score ≥1 (focus score)",
                "Débit salivaire non stimulé (sialométrie)"
            ],
            optional: [
                "Facteur rhumatoïde, ANA (souvent positifs)",
                "Échographie des glandes salivaires",
                "Cryoglobulinémie, Électrophorèse des protéines sériques (hypergammaglobulinémie polyclonale)",
                "HRCT thoracique et EFR (dépistage ILD - LIP, NSIP fréquents)"
            ],
            criteria: 'Critères ACR/EULAR 2016 (score ≥4)'
          };
        } else if (code === CTD_CODES.RA) {
          data[CTD_CODES.RA] = {
            name: CTD_NAMES.RA,
            essential: [
                "Facteur Rhumatoïde (FR) - IgM, IgA", 
                "Anticorps anti-CCP (ACPA)",
                "VS, CRP (marqueurs inflammation)",
                "Radiographies des mains/poignets et pieds (érosions, pincement articulaire)"
            ],
            optional: [
                "Échographie articulaire (synovite, érosions précoces, Doppler puissance)",
                "IRM articulaire (si doute ou suspicion atteinte axiale)",
                "HRCT thoracique et EFR (dépistage ILD - UIP fréquent)",
                "ANA (pour diagnostics différentiels ou overlap)"
            ],
            criteria: 'Critères ACR/EULAR 2010 (score ≥6)'
          };
        } else if (code === CTD_CODES.IPAF) {
            data[CTD_CODES.IPAF] = {
                name: CTD_NAMES.IPAF,
                essential: [
                    "Revue détaillée des 3 domaines IPAF (Clinique, Sérologique, Morphologique)",
                    "Panel ANA complet (incluant patterns spécifiques)",
                    "FR, Anti-CCP",
                    "Enzymes musculaires (CPK)",
                    "HRCT thoracique (relecture multidisciplinaire pour patterns ILD)",
                    "Examen clinique systémique (recherche signes extra-thoraciques subtils de CTD)"
                ],
                optional: [
                    "Anticorps spécifiques des myosites (si signes cliniques évocateurs)",
                    "Capillaroscopie (si phénomène de Raynaud)",
                    "Consultation rhumatologie/médecine interne spécialisée"
                ],
                criteria: "Critères IPAF (ATS/ERS 2015) - Au moins 2 domaines sur 3"
            }
        }
      });
      setEssentialTestsData(data);
      // Do not overwrite existing analysisResults.essentialTests if it's already populated by this effect run
      // This effect should only run once per selectedCandidateDiagnoses change.
      // setAnalysisResults(prev => ({ ...prev, essentialTests: data })); // This might be redundant if already handled
    };

    if (selectedCandidateDiagnoses.length > 0) {
      generateData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCandidateDiagnoses]); // removed setAnalysisResults from dep array to avoid potential loop if it's also updated inside

  const handleTestResultChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTestResults(prev => ({...prev, [e.target.name]: e.target.checked}));
  };

  const evaluateEssentialResults = () => {
    let evaluation: EssentialTestEvaluationResult = {};
    Object.entries(essentialTestsData).forEach(([ctdCode, data]) => {
      const positiveTests = data.essential.filter((_, index) => testResults[`${ctdCode}-essential-${index}`]).length;
      const totalTests = data.essential.length;
      const percentage = totalTests > 0 ? Math.round((positiveTests / totalTests) * 100) : 0;
      let likelihood: 'Forte' | 'Modérée' | 'Faible' = 'Faible';
      if (totalTests > 0) { // Check likelihood only if there are essential tests defined
        // This logic needs to be more nuanced based on actual scoring criteria for each CTD
        // For now, a simple threshold:
        if (percentage >= 60) likelihood = 'Forte'; // e.g. if >60% of key essential tests are positive
        else if (percentage >= 30) likelihood = 'Modérée';
      } else if (ctdCode === CTD_CODES.IPAF && totalTests === 0){ // IPAF has no "essential tests to be positive" but criteria fulfillment
        likelihood = 'Modérée'; // Default for IPAF as it's a descriptive diagnosis
      }


      evaluation[ctdCode] = {
        name: data.name, positiveTests, totalTests, percentage, likelihood
      };
    });
    setAnalysisResults(prev => ({ ...prev, essentialTestEvaluation: evaluation }));
  };
  
  const essentialTestEvaluation = analysisResults.essentialTestEvaluation;

  return (
    <SectionWrapper
      title="🎯 Examens Essentiels pour Confirmation Diagnostique"
      onAnalyze={Object.keys(essentialTestsData).length > 0 && !essentialTestEvaluation ? evaluateEssentialResults : undefined}
      analysisResult={essentialTestEvaluation && (
        <div className="space-y-3">
          {Object.values(essentialTestEvaluation).map(result => (
            <Alert 
              key={result.name}
              type={result.likelihood === 'Forte' ? 'success' : result.likelihood === 'Modérée' ? 'warning' : 'danger'}
              title={result.name}
            >
              <p><strong>Tests/critères en faveur :</strong> {result.positiveTests}/{result.totalTests} ({result.percentage}%)</p>
              <p><strong>Probabilité diagnostique (basée sur ces tests) :</strong> {result.likelihood}</p>
              {result.likelihood === 'Forte' && <p>✅ Critères diagnostiques probablement remplis ou forte suspicion.</p>}
              {result.likelihood === 'Modérée' && <p>⚠️ Critères partiels ou suspicion modérée. Évaluation multidisciplinaire recommandée.</p>}
              {result.likelihood === 'Faible' && <p>❌ Critères diagnostiques non remplis ou faible suspicion pour cette CTD basée sur ces tests.</p>}
            </Alert>
          ))}
        </div>
      )}
      onNext={onNext}
      showNextButton={!!essentialTestEvaluation}
    >
      <Alert type="info" title="Objectif">
        Confirmer/infirmer les diagnostics candidats retenus en vérifiant la présence des éléments clés (cliniques, biologiques, morphologiques) pour chaque pathologie selon les critères de classification (ex: ACR/EULAR) et les recommandations du guide 2020.
      </Alert>
      
      {selectedCandidateDiagnoses.length === 0 && <p className="text-slate-600 mt-4">Aucun diagnostic candidat sélectionné à l'étape précédente.</p>}

      {Object.entries(essentialTestsData).map(([ctdCode, data]) => (
        <div key={ctdCode} className="results-panel bg-slate-50 p-4 rounded-lg my-4 border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-1">{data.name}</h3>
          <p className="text-xs text-slate-500 mb-3">Critères de référence : {data.criteria}</p>
          
          <h4 className="text-md font-medium text-blue-700 mb-1">Éléments Clés à Vérifier/Confirmer :</h4>
          {data.essential.length > 0 ? (
            <div className="checkbox-group grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
              {data.essential.map((exam, index) => (
                <CheckboxItem 
                  key={`${ctdCode}-essential-${index}`}
                  id={`${ctdCode}-essential-${index}`}
                  name={`${ctdCode}-essential-${index}`}
                  label={`${exam} - Positif / Critère rempli`}
                  checked={!!testResults[`${ctdCode}-essential-${index}`]}
                  onChange={handleTestResultChange}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500 italic">Aucun test essentiel spécifique listé pour cette sélection (ex: IPAF repose sur la combinaison de domaines).</p>
          )}

          {data.optional.length > 0 && <>
             <h4 className="text-md font-medium text-blue-600 mb-1 mt-3">Examens Optionnels / Complémentaires :</h4>
             <ul className="list-disc list-inside text-sm text-slate-600 pl-4">
                {data.optional.map(exam => <li key={exam}>{exam}</li>)}
             </ul>
          </>}
        </div>
      ))}
    </SectionWrapper>
  );
};

export default EssentialTestsSection;
