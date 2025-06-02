import { Step, NavItem } from './types';

export const APP_STEPS: Step[] = [
  { id: 1, phase: "PHASE 1", title: "Présomption Clinique" },
  { id: 2, phase: "PHASE 2", title: "Biologie Standard" },
  { id: 3, phase: "PHASE 3", title: "Immuno Ciblée" },
  { id: 4, phase: "PHASE 4", title: "Atteinte Pulmonaire" },
  { id: 5, phase: "PHASE 5", title: "Imagerie & EFR" },
  { id: 6, phase: "PHASE 6", title: "Signes Élémentaires" },
  { id: 7, phase: "PHASE 7", title: "Corrélation & Sélection Diag." },
  { id: 8, phase: "PHASE 8", title: "Examens Essentiels" },
  { id: 9, phase: "PHASE 9", title: "Diagnostic Final" },
  { id: 10, phase: "PHASE 10", title: "Traitement & Suivi" },
];

export const NAV_ITEMS: NavItem[] = [
  { id: "anamnese", label: "Anamnèse & Facteurs", icon: "📋", stepId: 1, sectionId: "anamnese" },
  { id: "clinical", label: "Signes Cliniques", icon: "🔍", stepId: 1, sectionId: "clinical" },
  { id: "standard-bio", label: "Biologie Standard", icon: "🧪", stepId: 2, sectionId: "standard-bio" },
  { id: "targeted-immuno", label: "Immunologie Ciblée", icon: "🎯", stepId: 3, sectionId: "targeted-immuno" },
  { id: "respiratory", label: "Évaluation Respiratoire", icon: "🫁", stepId: 4, sectionId: "respiratory" },
  { id: "imaging", label: "Imagerie & EFR", icon: "🖼️", stepId: 5, sectionId: "imaging" },
  { id: "patterns", label: "Signes Élémentaires (Pattern HRCT)", icon: "🔬", stepId: 6, sectionId: "patterns" },
  { id: "correlation", label: "Corrélation & Sélection Diag.", icon: "🧩", stepId: 7, sectionId: "correlation" },
  { id: "essential-tests", label: "Examens Essentiels", icon: "🎯", stepId: 8, sectionId: "essential-tests" },
  { id: "final-diagnosis", label: "Diagnostic Final", icon: "✅", stepId: 9, sectionId: "final-diagnosis" },
  { id: "treatment-plan", label: "Plan Thérapeutique", icon: "💊", stepId: 10, sectionId: "treatment-plan" },
  { id: "follow-up", label: "Protocole de Suivi", icon: "📅", stepId: 10, sectionId: "follow-up" },
  { id: "report", label: "Rapport de Synthèse", icon: "📄", stepId: 10, sectionId: "report" },
];

export const HRCT_PATTERNS_DETAILS: { [key: string]: { name: string; description: string; criteria: string[]; associations: string[] } } = {
  UIP: {
    name: 'UIP (Usual Interstitial Pneumonia)',
    description: 'Pattern de mauvais pronostic, souvent associé à la PR et à la SSc avancée. Caractérisé par des réticulations sous-pleurales et basales, rayon de miel, et bronchectasies de traction. Hétérogène.',
    criteria: [
        "Rayon de miel sous-pleural obligatoire (peut être absent si autres signes typiques)",
        "Réticulations irrégulières prédominantes",
        "Distribution hétérogène, souvent basale et périphérique",
        "Bronchectasies/bronchiolectasies de traction"
    ],
    associations: ['PR-ILD (souvent UIP)', 'SSc-ILD (formes avancées)', 'IPF-like', 'Pronostic plus réservé']
  },
  fNSIP: {
    name: 'fNSIP (Fibrosing Nonspecific Interstitial Pneumonia)',
    description: 'Pattern le plus fréquent dans les CTD-ILD, notamment SSc et Myosites. Verre dépoli prédominant avec réticulations fines. Distribution souvent symétrique, épargne sous-pleurale relative.',
    criteria: [
        "Verre dépoli prédominant, souvent bilatéral et symétrique",
        "Réticulations fines associées",
        "Épargne sous-pleurale relative fréquente",
        "Bronchectasies de traction modérées",
        "Peu ou pas de rayon de miel"
    ],
    associations: ['SSc-ILD (le plus fréquent)', 'PM/DM-ILD', 'Syndrome anti-synthétase', 'Pronostic généralement favorable']
  },
  OP: {
    name: 'OP (Organizing Pneumonia)',
    description: 'Condensations alvéolaires multifocales, souvent périphériques ou péribronchiques. Signe du halo inversé possible. Bonne réponse aux corticoïdes.',
     criteria: [
        "Condensations alvéolaires, uni ou bilatérales",
        "Distribution souvent périphérique et/ou péribronchovasculaire",
        "Signe du halo inversé (atoll sign) possible",
        "Peu ou pas de fibrose extensive (rayon de miel)"
    ],
    associations: ['PM/DM-ILD', 'PR-ILD', 'LED-ILD', 'Syndrome anti-synthétase', 'Réversible sous corticoïdes']
  },
  LIP: {
    name: 'LIP/DLH (Lymphoid Interstitial Pneumonia / Diffuse Lymphoid Hyperplasia)',
    description: 'Infiltration lymphoïde diffuse. Verre dépoli, kystes à parois fines, nodules centrolobulaires. Fortement associé au Syndrome de Sjögren.',
    criteria: [
        "Verre dépoli diffus",
        "Kystes à parois fines (pathognomoniques si présents)",
        "Nodules centrolobulaires ou péribronchovasculaires",
        "Épaississement septal interlobulaire"
    ],
    associations: ['Syndrome de Sjögren-ILD (très évocateur)', 'LED-ILD', 'PR-ILD']
  },
  FOP: { // Fibrosing OP / NSIP+OP overlap
    name: 'FOP (Fibrosing Organizing Pneumonia) / NSIP avec chevauchement OP',
    description: 'Combinaison de signes de NSIP (verre dépoli, réticulations) et d\'OP (condensations). Fréquent dans le syndrome anti-synthétase.',
    criteria: [
        "Coexistence de zones de verre dépoli/réticulations (type NSIP)",
        "Et de zones de condensations (type OP)",
        "Distribution souvent péribronchovasculaire et basale"
    ],
    associations: ['Syndrome anti-synthétase (très fréquent)', 'PM/DM-ILD']
  },
  DAD: {
    name: 'DAD (Diffuse Alveolar Damage)',
    description: 'Expression radiologique de l\'atteinte alvéolaire aiguë. Verre dépoli bilatéral et étendu, condensations. Évolution rapide. Souvent dans les formes aiguës de LED ou myosites (anti-MDA5).',
    criteria: [
        "Verre dépoli bilatéral et diffus, souvent étendu",
        "Condensations alvéolaires rapidement progressives",
        "Épaississement septal interlobulaire",
        "Parfois bronchectasies de traction si évolution vers fibrose"
    ],
    associations: ['Anti-MDA5+ DM (RP-ILD)', 'Lupus pneumonitis aigu', 'Exacerbation aiguë d\'une ILD préexistante', 'Urgence thérapeutique, pronostic réservé']
  }
};


export const TREATMENT_PROGNOSTIC_FACTORS_INPUTS = {
  common: [
    { id: 'ageOver60', label: 'Âge > 60 ans', category: 'general' },
    { id: 'maleSex', label: 'Sexe Masculin', category: 'general' },
    { id: 'smokingHistory', label: 'Tabagisme (actuel ou sevré)', category: 'general' },
    { id: 'lowDLCO', label: 'DLCO < 40-50%', category: 'pft' },
    { id: 'extensiveFibrosisHRCT', label: 'Fibrose extensive sur HRCT (>20%)', category: 'hrct' },
    { id: 'uipPattern', label: 'Pattern UIP sur HRCT', category: 'hrct' },
    { id: 'highKL6', label: 'KL-6 élevé (>1000 U/mL)', category: 'biomarker' },
    { id: 'highFerritin', label: 'Ferritine sérique élevée (>500 ng/mL)', category: 'biomarker' },
    { id: 'rpILD', label: 'RP-ILD (Rapidly Progressive ILD)', category: 'clinicalCourse' },
  ],
  pmdm: [
    { id: 'antiMda5Positive', label: 'Anticorps Anti-MDA5 positifs', category: 'autoantibody' },
    { id: 'antiARSPositive', label: 'Anticorps Anti-Synthétase (ex: Anti-Jo1) positifs', category: 'autoantibody' },
    // Note: Prognosis differs, MDA5 often worse short term.
  ],
  ssc: [
    { id: 'antiScl70Positive', label: 'Anticorps Anti-Scl-70 (topoisomerase I) positifs', category: 'autoantibody' },
    { id: 'severeSkinInvolvement', label: 'Atteinte cutanée diffuse/sévère (SSc)', category: 'clinicalSSc' },
  ],
  ra: [
    { id: 'highRF', label: 'Facteur Rhumatoïde (FR) élevé', category: 'autoantibody' },
    { id: 'antiCCPPositive', label: 'Anti-CCP positifs', category: 'autoantibody' },
  ],
  // SLE, SS, MCTD might have less specific ILD prognostic factors beyond general ones
};

export const ILD_SEVERITY_OPTIONS = [
  { value: '', label: 'Évaluer la sévérité ILD' },
  { value: 'mild', label: 'Légère/Limitée (ex: CVF >80%, atteinte HRCT <10-20%)' },
  { value: 'moderate', label: 'Modérée (ex: CVF 50-80%, atteinte HRCT 20-40%)' },
  { value: 'severe', label: 'Sévère (ex: CVF <50%, atteinte HRCT >40%, hypoxémie)' },
  { value: 'rp-ild', label: 'Rapidement Progressive (RP-ILD)'},
  { value: 'end-stage', label: 'Terminale (O2-dépendante, CVF très basse)' },
];

export const DISEASE_PROGRESSION_OPTIONS = [
  { value: '', label: "Type d'évolution récente" },
  { value: 'stable', label: 'Stable ou amélioration' },
  { value: 'slowly_progressive', label: 'Lentement progressive (clinique/EFR/HRCT)' },
  { value: 'rapidly_progressive', label: 'Rapidement progressive (clinique/EFR/HRCT)' },
  { value: 'acute_exacerbation', label: 'Exacerbation aiguë d\'ILD' },
];


export const INITIAL_FORM_DATA: Record<string, any> = {
  anamnese: {
    age: '', sexe: '', origine: '', tabac: '', pa: '', profession: '',
    silice: false, amiante: false, metaux: false, oiseaux: false, moisissures: false, foin: false,
    atcdCtd: false, atcdRaynaud: false, atcdIld: false, atcdAutoimmun: false,
    delaiEvolution: '', modeInstallation: '', evolution: ''
  },
  clinical: {
    arthritis: false, morningStiffness: false, deformities: false, muscleWeakness: false, myalgia: false,
    malarRash: false, heliotrope: false, gottron: false, sclerodactyly: false, telangiectasia: false,
    digitalUlcers: false, oralUlcers: false, photosensitivity: false,
    raynaudPresent: '', raynaudSequence: '', raynaudSeverity: '',
    dyspnea: false, dryCough: false, crackles: false, clubbing: false, cyanosis: false,
    dryEyes: false, dryMouth: false, fever: false, weightLoss: false, lymphNodes: false
  },
  standardBio: {
    vs: '', crp: '', ferritin: '', cpk: '', ldh: '', aldolase: '',
    anaTiter: '', anaPattern: '', rf: '', antiCcp: '', ancaMpo: '', ancaPr3: ''
  },
  targetedImmuno: {
    antiDna: false, antiSm: false, antiRnp: false, antiSsa: false, antiSsb: false,
    antiScl70: false, antiCentromere: false, antiRnaPol: false, antiPmScl: false,
    antiJo1: false, antiPl7: false, antiPl12: false, antiMda5: false, antiMi2: false, antiEJ: false, antiOJ: false, antiKS: false, // Added more anti-ARS from Table 3
  },
  respiratory: {
    mmrcDyspnea: '', coughType: '', respiratoryOnset: '', respiratoryEvolution: '',
    mtxExposure: false, infectionRecent: false, drugInduced: false
  },
  imaging: {
    fvc: '', dlco: '', spo2: '', kl6: '', spd: '', ccl18: '', il6_level: '', // Added CCL18, IL-6 from Table 1
    groundGlass: false, reticulations: false, honeycombing: false, tractionBe: false,
    consolidations: false, cysts: false,
    lowerPredominant: false, subpleuralDist: false, peribronchovascular: false, subpleuralSparing: false,
    extensionRange: '0'
  },
  patterns: { 
    selectedPattern: null
  },
  correlation: { 
    selectedCandidateDiagnoses: {} 
  },
  essentialTestsInputs: {}, 
  finalDiagnosisInputs: {
  },
  treatmentPlanInputs: {
    ildSeverity: '', // Uses ILD_SEVERITY_OPTIONS
    diseaseProgression: '', // Uses DISEASE_PROGRESSION_OPTIONS
    // Prognostic factors will be dynamically generated checkboxes based on TREATMENT_PROGNOSTIC_FACTORS_INPUTS
    ageOver60: false, maleSex: false, smokingHistory: false, lowDLCO: false, extensiveFibrosisHRCT: false, uipPatternHRCT: false, highKL6: false, highFerritin: false, rpILD: false,
    antiMda5Positive: false, antiARSPositive: false,
    antiScl70Positive: false, severeSkinInvolvement: false,
    highRF: false, antiCCPPositive: false,
    // from original HTML, for backward compatibility, may be redundant with above
    antiMda5Risk: false, uipPattern: false, badPrognosisMda5: false, hypoxemia: false, 
  },
  followUpInputs: {
    treatmentPhase: 'initiation', 
    carePhase: 'initiation', 
  },
};
