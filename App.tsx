
import React, { useState, useCallback, useEffect } from 'react';
import { APP_STEPS, NAV_ITEMS, INITIAL_FORM_DATA, HRCT_PATTERNS_DETAILS } from './constants';
import { 
  Step, NavItem as NavItemType, FormData, AnalysisResults, SelectedDiagnosis, HRCTPattern, 
  AnamnesisAnalysisResult, ClinicalAnalysisResult, StandardBioAnalysisResult, TargetedImmunoAnalysisResult, 
  RespiratoryAnalysisResult, ImagingAnalysisResult, CorrelationAnalysisResult, EssentialTestData, 
  EssentialTestEvaluationResult, FinalDiagnosisResult, TreatmentPlanResult, FollowUpPlanResult, 
  CTDScores, CTD_CODES, CTD_NAMES 
} from './types';

import Header from './components/Header';
import ProgressTracker from './components/ProgressTracker';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer'; // Import the new Footer component
import AnamnesisSection from './components/sections/AnamnesisSection';
import ClinicalSection from './components/sections/ClinicalSection';
import StandardBioSection from './components/sections/StandardBioSection';
import TargetedImmunoSection from './components/sections/TargetedImmunoSection';
import RespiratorySection from './components/sections/RespiratorySection';
import ImagingSection from './components/sections/ImagingSection';
import PatternsSection from './components/sections/PatternsSection';
import CorrelationSelectionSection from './components/sections/CorrelationSelectionSection';
import EssentialTestsSection from './components/sections/EssentialTestsSection';
import FinalDiagnosisSection from './components/sections/FinalDiagnosisSection';
import TreatmentPlanSection from './components/sections/TreatmentPlanSection';
import FollowUpSection from './components/sections/FollowUpSection';
import ReportSection from './components/sections/ReportSection';

const App: React.FC = () => {
  const [currentPhase, setCurrentPhase] = useState<number>(1);
  const [activeSectionId, setActiveSectionId] = useState<string>(NAV_ITEMS[0].sectionId);
  const [unlockedPhases, setUnlockedPhases] = useState<Set<number>>(new Set([1]));
  
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults>({});
  const [selectedCandidateDiagnoses, setSelectedCandidateDiagnoses] = useState<SelectedDiagnosis[]>([]);


  const updateFormData = useCallback((sectionId: string, data: any) => {
    setFormData(prev => ({ ...prev, [sectionId]: { ...prev[sectionId], ...data } }));
  }, []);

  const handleSectionChange = useCallback((sectionId: string, phaseId: number) => {
    if (unlockedPhases.has(phaseId)) {
      setActiveSectionId(sectionId);
      setCurrentPhase(phaseId); // Ensure currentPhase also updates
    }
  }, [unlockedPhases]);

  const unlockNextPhaseAndShowSection = useCallback((nextSectionId: string, nextPhaseId: number) => {
    setUnlockedPhases(prev => new Set(prev).add(nextPhaseId));
    setActiveSectionId(nextSectionId);
    setCurrentPhase(nextPhaseId);
  }, []);

  const getNextSectionInfo = (currentSectionId: string): { id: string, phaseId: number } | null => {
    const currentIndex = NAV_ITEMS.findIndex(item => item.sectionId === currentSectionId);
    if (currentIndex !== -1 && currentIndex < NAV_ITEMS.length - 1) {
      const nextItem = NAV_ITEMS[currentIndex + 1];
      // Skip to next phase if section is in same phase or handle specific logic
      return { id: nextItem.sectionId, phaseId: nextItem.stepId };
    }
    // If it's the last section of a phase, find the first section of the next phase
    const currentPhaseId = NAV_ITEMS[currentIndex].stepId;
    const nextPhaseFirstSection = NAV_ITEMS.find(item => item.stepId === currentPhaseId + 1);
    if (nextPhaseFirstSection) {
      return { id: nextPhaseFirstSection.sectionId, phaseId: nextPhaseFirstSection.stepId };
    }
    return null;
  };
  
  const handleNext = useCallback((currentSectionId: string) => {
    const currentNavItem = NAV_ITEMS.find(item => item.sectionId === currentSectionId);
    if (!currentNavItem) return;

    const currentNavIndex = NAV_ITEMS.indexOf(currentNavItem);
    let nextNavIndex = currentNavIndex + 1;

    if (nextNavIndex < NAV_ITEMS.length) {
        const nextNavItem = NAV_ITEMS[nextNavIndex];
        unlockNextPhaseAndShowSection(nextNavItem.sectionId, nextNavItem.stepId);
    }
  }, [unlockNextPhaseAndShowSection]);


  // --- Analysis Logic Placeholder ---
  // Each section will call its specific analysis function, 
  // which updates analysisResults state.
  // Example for Anamnesis:
  const runAnamnesisAnalysis = useCallback(() => {
    const data = formData.anamnese || {};
    const age = parseInt(data.age, 10);
    let riskFactors: string[] = [];
    let suspicions: string[] = [];

    if (age > 60) riskFactors.push("Âge > 60 ans (facteur de risque CTD-ILD)");
    if (data.sexe === 'M') riskFactors.push("Sexe masculin (risque accru RA-ILD, SSc-ILD)");
    if (data.delaiEvolution === 'aigu') suspicions.push("Évolution aiguë : suspecter Anti-MDA5+ DM, Lupus pneumonitis");
    if (data.delaiEvolution === 'chronique') suspicions.push("Évolution chronique : orienter vers SSc-ILD, syndrome anti-synthétase");
    
    const result: AnamnesisAnalysisResult = { riskFactors, suspicions };
    setAnalysisResults(prev => ({ ...prev, anamnesis: result }));
  }, [formData.anamnese]);

  // Other analysis functions (clinical, bio, etc.) would follow a similar pattern...
  // For brevity, they are not fully implemented here but would be needed for full functionality.

  useEffect(() => {
    // Automatically unlock sections within the current or already unlocked phases
    const newUnlocked = new Set(unlockedPhases);
    NAV_ITEMS.forEach(item => {
      if (unlockedPhases.has(item.stepId)) {
        newUnlocked.add(item.stepId); // ensure phase itself is marked
      }
    });
    // This logic might need refinement if sections within a phase should unlock sequentially
  }, [unlockedPhases]);


  const renderActiveSection = () => {
    switch (activeSectionId) {
      case 'anamnese':
        return <AnamnesisSection
                  formData={formData.anamnese || INITIAL_FORM_DATA.anamnese}
                  updateFormData={(data) => updateFormData('anamnese', data)}
                  onAnalyze={runAnamnesisAnalysis}
                  analysisResult={analysisResults.anamnesis}
                  onNext={() => handleNext('anamnese')} />;
      case 'clinical':
        return <ClinicalSection 
                  formData={formData.clinical || INITIAL_FORM_DATA.clinical}
                  updateFormData={(data) => updateFormData('clinical', data)}
                  analysisResult={analysisResults.clinical}
                  setAnalysisResults={setAnalysisResults}
                  onNext={() => handleNext('clinical')} />;
      case 'standard-bio':
        return <StandardBioSection
                  formData={formData.standardBio || INITIAL_FORM_DATA.standardBio}
                  updateFormData={(data) => updateFormData('standardBio', data)}
                  analysisResult={analysisResults.standardBio}
                  setAnalysisResults={setAnalysisResults}
                  onNext={() => handleNext('standard-bio')} />;
      case 'targeted-immuno':
        return <TargetedImmunoSection
                  formData={formData.targetedImmuno || INITIAL_FORM_DATA.targetedImmuno}
                  updateFormData={(data) => updateFormData('targetedImmuno', data)}
                  analysisResult={analysisResults.targetedImmuno}
                  setAnalysisResults={setAnalysisResults}
                  standardBioAnalysis={analysisResults.standardBio}
                  onNext={() => handleNext('targeted-immuno')} />;
      case 'respiratory':
        return <RespiratorySection
                  formData={formData.respiratory || INITIAL_FORM_DATA.respiratory}
                  updateFormData={(data) => updateFormData('respiratory', data)}
                  analysisResult={analysisResults.respiratory}
                  setAnalysisResults={setAnalysisResults}
                  onNext={() => handleNext('respiratory')} />;
      case 'imaging':
        return <ImagingSection
                  formData={formData.imaging || INITIAL_FORM_DATA.imaging}
                  updateFormData={(data) => updateFormData('imaging', data)}
                  analysisResult={analysisResults.imaging}
                  setAnalysisResults={setAnalysisResults}
                  onNext={() => handleNext('imaging')} />;
      case 'patterns':
        return <PatternsSection
                  selectedPattern={analysisResults.selectedPattern || null}
                  setAnalysisResults={setAnalysisResults}
                  imagingAnalysis={analysisResults.imaging}
                  onNext={() => handleNext('patterns')} />;
      case 'correlation':
        return <CorrelationSelectionSection
                  analysisResults={analysisResults}
                  setAnalysisResults={setAnalysisResults}
                  onNext={() => handleNext('correlation')}
                  setSelectedCandidateDiagnosesExt={setSelectedCandidateDiagnoses}
                   />;
      case 'essential-tests':
        return <EssentialTestsSection
                  selectedCandidateDiagnoses={selectedCandidateDiagnoses}
                  analysisResults={analysisResults}
                  setAnalysisResults={setAnalysisResults}
                  onNext={() => handleNext('essential-tests')} />;
      case 'final-diagnosis':
        return <FinalDiagnosisSection
                  analysisResults={analysisResults}
                  setAnalysisResults={setAnalysisResults}
                  onNext={() => handleNext('final-diagnosis')} />;
      case 'treatment-plan':
        return <TreatmentPlanSection
                  formData={formData.treatmentPlanInputs || INITIAL_FORM_DATA.treatmentPlanInputs}
                  updateFormData={(data) => updateFormData('treatmentPlanInputs', data)}
                  analysisResults={analysisResults}
                  setAnalysisResults={setAnalysisResults}
                  onNext={() => handleNext('treatment-plan')} />;
      case 'follow-up':
        return <FollowUpSection
                  formData={formData.followUpInputs || INITIAL_FORM_DATA.followUpInputs}
                  updateFormData={(data) => updateFormData('followUpInputs', data)}
                  analysisResults={analysisResults}
                  setAnalysisResults={setAnalysisResults}
                  onNext={() => {
                     const reportNavItem = NAV_ITEMS.find(item => item.sectionId === 'report');
                     if (reportNavItem) {
                       unlockNextPhaseAndShowSection(reportNavItem.sectionId, reportNavItem.stepId);
                     } else { 
                        setActiveSectionId('report'); 
                     }
                  }} />;
      case 'report':
          return <ReportSection analysisResults={analysisResults} formData={formData} />;
      default:
        return <div className="p-5 text-slate-700">Sélectionnez une section</div>;
    }
  };

  return (
    <div className="w-screen h-screen bg-white flex flex-col overflow-hidden">
      <Header />
      <ProgressTracker steps={APP_STEPS} currentPhase={currentPhase} unlockedPhases={unlockedPhases} />
      <div className="main-content md:grid md:grid-cols-[250px_1fr] flex-1 overflow-hidden">
        <Sidebar
          navItems={NAV_ITEMS}
          activeSectionId={activeSectionId}
          unlockedPhases={unlockedPhases}
          onSelectSection={handleSectionChange}
        />
        <div className="content-area p-4 sm:p-6 md:p-8 bg-slate-50 overflow-y-auto h-full">
          {renderActiveSection()}
        </div>
      </div>
      <Footer /> {/* Add the Footer component here */}
    </div>
  );
};

export default App;
