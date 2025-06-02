
export interface Step {
  id: number;
  phase: string;
  title: string;
}

export interface NavItem {
  id: string;
  label: string;
  icon: string;
  stepId: number; // Corresponds to the phase number it belongs to
  sectionId: string; // Unique ID for the section content
}

export interface FormData {
  [key: string]: any;
}

export interface AnalysisResults {
  anamnesis?: AnamnesisAnalysisResult;
  clinical?: ClinicalAnalysisResult;
  standardBio?: StandardBioAnalysisResult;
  targetedImmuno?: TargetedImmunoAnalysisResult;
  respiratory?: RespiratoryAnalysisResult;
  imaging?: ImagingAnalysisResult;
  selectedPattern?: HRCTPattern | null; // Changed from string | null
  correlation?: CorrelationAnalysisResult;
  essentialTests?: EssentialTestData; // Changed from EssentialTestsData
  essentialTestEvaluation?: EssentialTestEvaluationResult;
  finalDiagnosis?: FinalDiagnosisResult;
  treatmentPlan?: TreatmentPlanResult;
  followUpPlan?: FollowUpPlanResult;
}

export interface AnamnesisAnalysisResult {
  riskFactors: string[];
  suspicions: string[];
}

export interface CTDScores {
  RA: number;
  SSc: number;
  PMDM: number;
  SLE: number;
  SS: number;
  MCTD: number;
  [key: string]: number; 
}

export interface ClinicalAnalysisResult {
  ctdSuspicions: CTDScores;
}

export interface StandardBioAnalysisResult {
  orientations: string[];
  nextTests: string[];
  anaTiter?: string;
  anaPattern?: string;
}

export interface TargetedImmunoAnalysisResult {
  confirmedDiagnoses: string[];
  specificities: string[];
}

export interface RespiratoryAnalysisResult {
  severity: string[];
  urgency: string[];
  mmrcStage?: string;
  onsetType?: string;
  evolution?: string;
}

export interface ImagingAnalysisResult {
  severity: string[];
  biomarkers: { label: string; class: string }[];
  patternSuggestion: string;
  fvc?: string;
  dlco?: string;
  extension?: string;
}

export interface CorrelationAnalysisResult {
  correlationScores: CTDScores;
  significantDiagnoses: { ctd: string; score: number; name: string }[];
}

export interface SelectedDiagnosis {
  code: string;
  name: string;
  score: string | number;
}

export interface EssentialTestData {
  [ctdCode: string]: {
    name: string;
    essential: string[];
    optional: string[];
    criteria: string;
    results?: { [testIndex: number]: boolean };
  };
}

export interface EssentialTestEvaluationResult {
  [ctdCode: string]: {
    name: string;
    positiveTests: number;
    totalTests: number;
    percentage: number;
    likelihood: 'Forte' | 'Modérée' | 'Faible';
  };
}

export interface FinalDiagnosisResult {
  ctdCode: string;
  ctdName: string;
  pattern: HRCTPattern | null;
  confidence: string;
  arguments: string[];
  classificationPrognosis: {
    severity: string;
    prognosis: string;
    extension?: string;
    fvc?: string;
    dlco?: string;
  };
}

export interface TreatmentPlanResult {
  urgency: string;
  firstLine: string;
  medications: string[];
  monitoring: string[];
  secondLine?: string;
  notes?: string[]; // Added optional notes property
}

export interface FollowUpPlanResult {
  schedule: { [key: string]: string };
  alerts: string[];
  objectives: string[];
}

// Enum for HRCT patterns
export enum HRCTPattern {
  UIP = "UIP",
  FNSIP = "fNSIP",
  OP = "OP",
  LIP = "LIP",
  FOP = "FOP", // NSIP+OP
  DAD = "DAD",
}

// Constants for CTD names
export const CTD_CODES = {
  RA: "RA",
  SSc: "SSc",
  PMDM: "PMDM",
  SLE: "SLE",
  SS: "SS",
  MCTD: "MCTD",
  IPAF: "IPAF"
};

export const CTD_NAMES: { [key: string]: string } = {
  [CTD_CODES.RA]: "Polyarthrite Rhumatoïde",
  [CTD_CODES.SSc]: "Sclérodermie Systémique",
  [CTD_CODES.PMDM]: "Polymyosite/Dermatomyosite",
  [CTD_CODES.SLE]: "Lupus Érythémateux Systémique",
  [CTD_CODES.SS]: "Syndrome de Sjögren",
  [CTD_CODES.MCTD]: "Connectivite Mixte",
  [CTD_CODES.IPAF]: "IPAF (Interstitial Pneumonia with Autoimmune Features)"
};

export type CheckboxItemType = { id: string; label: string; checked?: boolean };
