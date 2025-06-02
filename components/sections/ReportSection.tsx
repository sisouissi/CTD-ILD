
import React from 'react';
import SectionWrapper from './SectionWrapper';
import type { AnalysisResults, FormData } from '../../types';
import Button from '../ui/Button';

interface ReportSectionProps {
  analysisResults: AnalysisResults;
  formData: FormData; // May need specific parts of formData for the report
}

const ReportSection: React.FC<ReportSectionProps> = ({ analysisResults, formData }) => {
  const { finalDiagnosis, selectedPattern, imaging, treatmentPlan, followUpPlan } = analysisResults;
  const currentDate = new Date().toLocaleDateString('fr-FR');

  const printReport = () => {
    const reportContent = document.getElementById('medical-report-content')?.innerHTML;
    if (reportContent) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write('<html><head><title>Rapport CTD-ILD</title>');
        printWindow.document.write('<style>body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; color: #333;} h1,h2,h3,h4,h5 {margin-top:0.5em; margin-bottom:0.25em;} table{border-collapse:collapse;width:100%;margin-bottom:1em;} th,td{border:1px solid #ddd;padding:8px;text-align:left;} th{background-color:#f0f0f0;} ul{padding-left:20px;} .section-title{color: #2c3e50; border-bottom: 2px solid #bdc3c7; padding-bottom: 5px; margin-bottom:15px; font-size: 1.5em;} .subsection-title{color:#3498db; margin-bottom:10px; font-size:1.2em;} .report-header{text-align:center; border-bottom: 3px solid #3498db; padding-bottom:20px; margin-bottom:30px;} .report-footer{margin-top:40px; padding-top:20px; border-top:2px solid #bdc3c7; text-align:center; font-size:0.8em; color:#7f8c8d;} </style>');
        printWindow.document.write('</head><body>');
        printWindow.document.write(reportContent);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
      }
    }
  };


  if (!finalDiagnosis) {
    return (
      <SectionWrapper title="📄 Rapport de Synthèse">
        <p className="text-slate-600">Le diagnostic final n'a pas encore été établi. Veuillez compléter les étapes précédentes.</p>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper title="📄 Rapport de Synthèse" showNextButton={false}>
      <div id="medical-report-content" className="space-y-6 text-sm">
        <div className="report-header">
          <h1 className="text-2xl font-bold text-slate-800">RAPPORT MÉDICAL SPÉCIALISÉ</h1>
          <h2 className="text-xl text-blue-700">Connectivite avec Atteinte Pulmonaire Interstitielle</h2>
          <p className="font-semibold">Date : {currentDate}</p>
        </div>

        <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded">
          <h3 className="section-title text-green-700">DIAGNOSTIC RETENU</h3>
          <p className="text-lg font-bold text-slate-800">
            {finalDiagnosis.ctdName}-ILD
          </p>
          <p><strong>Pattern HRCT :</strong> {finalDiagnosis.pattern || selectedPattern || 'Non déterminé'}</p>
          <p><strong>Certitude diagnostique :</strong> {finalDiagnosis.confidence}</p>
        </div>

        <div>
          <h3 className="section-title">SYNTHÈSE CLINIQUE & BIOLOGIQUE</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="subsection-title">Arguments cliniques :</h4>
              <ul className="list-disc pl-5 text-slate-700">
                {analysisResults.anamnesis?.suspicions?.map((s, i) => <li key={`clin-${i}`}>{s}</li>) ?? <li>Données cliniques non détaillées.</li>}
              </ul>
            </div>
            <div>
              <h4 className="subsection-title">Arguments biologiques :</h4>
              <ul className="list-disc pl-5 text-slate-700">
                {analysisResults.targetedImmuno?.confirmedDiagnoses?.map((d, i) => <li key={`bio-${i}`}>{d}</li>) ?? <li>Sérologie auto-immune non détaillée.</li>}
              </ul>
            </div>
          </div>
           {finalDiagnosis.arguments.length > 0 && <div className="mt-3">
                <h4 className="subsection-title">Autres Arguments :</h4>
                <ul className="list-disc pl-5 text-slate-700">
                    {finalDiagnosis.arguments.map((arg, i) => <li key={`arg-${i}`}>{arg}</li>)}
                </ul>
            </div>}
        </div>
        
        <div>
          <h3 className="section-title">ATTEINTE PULMONAIRE</h3>
          <div className="bg-slate-50 p-3 rounded border border-slate-200">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div><strong>Pattern HRCT :</strong> {finalDiagnosis.pattern || selectedPattern || 'Non déterminé'}</div>
              <div><strong>CVF :</strong> {finalDiagnosis.classificationPrognosis.fvc || imaging?.fvc || 'NR'}%</div>
              <div><strong>DLCO :</strong> {finalDiagnosis.classificationPrognosis.dlco || imaging?.dlco || 'NR'}%</div>
              <div><strong>Extension :</strong> {finalDiagnosis.classificationPrognosis.extension || imaging?.extension || 'NR'}%</div>
              <div><strong>Sévérité ILD :</strong> {finalDiagnosis.classificationPrognosis.severity}</div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="section-title">ÉVALUATION PRONOSTIQUE</h3>
          <div className={`p-3 rounded ${finalDiagnosis.classificationPrognosis.prognosis.includes('Sombre') || finalDiagnosis.classificationPrognosis.prognosis.includes('Réservé') ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'}`}>
            <p><strong>Pronostic global :</strong> {finalDiagnosis.classificationPrognosis.prognosis}</p>
          </div>
        </div>
        
        {treatmentPlan && <div>
          <h3 className="section-title">PLAN THÉRAPEUTIQUE PROPOSÉ</h3>
          <div className="bg-blue-50 p-3 rounded border border-blue-200">
            <p className="font-semibold text-blue-700">{treatmentPlan.firstLine} ({treatmentPlan.urgency})</p>
            <h5 className="font-medium mt-2">Médications :</h5>
            <ul className="list-disc pl-5 text-slate-700">
              {treatmentPlan.medications.map((med, i) => <li key={`med-${i}`}>{med}</li>)}
            </ul>
             <h5 className="font-medium mt-2">Surveillance spécifique au traitement :</h5>
            <ul className="list-disc pl-5 text-slate-700">
              {treatmentPlan.monitoring.map((item, i) => <li key={`mon-${i}`}>{item}</li>)}
            </ul>
            {treatmentPlan.secondLine && <p className="mt-2"><strong>Deuxième ligne :</strong> {treatmentPlan.secondLine}</p>}
          </div>
        </div>}

        {followUpPlan && <div>
          <h3 className="section-title">PROTOCOLE DE SURVEILLANCE</h3>
          <div className="bg-indigo-50 p-3 rounded border border-indigo-200">
             <h4 className="subsection-title">Calendrier :</h4>
             <table className="w-full text-left border-collapse">
                <thead><tr><th className="border p-2 bg-slate-100">Paramètre</th><th className="border p-2 bg-slate-100">Fréquence</th></tr></thead>
                <tbody>
                {Object.entries(followUpPlan.schedule).map(([param, freq]) => (
                  <tr key={param}><td className="border p-2">{param.charAt(0).toUpperCase() + param.slice(1)}</td><td className="border p-2">{freq}</td></tr>
                ))}
                </tbody>
             </table>
             <h4 className="subsection-title mt-3">Critères d'Alerte :</h4>
             <ul className="list-disc pl-5 text-slate-700">{followUpPlan.alerts.map((alert, i) => <li key={`alert-${i}`}>{alert}</li>)}</ul>
             <h4 className="subsection-title mt-3">Objectifs Thérapeutiques :</h4>
             <ul className="list-disc pl-5 text-slate-700">{followUpPlan.objectives.map((goal, i) => <li key={`goal-${i}`}>{goal}</li>)}</ul>
          </div>
        </div>}

        <div className="report-footer">
          Rapport généré par CTD-ILD Diagnostic Assistant.<br />
          Ce rapport doit être interprété dans le contexte clinique global du patient.<br />
          <br />
          Application développée par Dr Zouhair Souissi, adaptée à partir du Guideline © 2021 de la Japanese Respiratory Society 2020 : Guide for the diagnosis and treatment of interstitial lung disease associated with connective tissue disease.
        </div>
      </div>
      <div className="mt-6 text-center">
        <Button variant="success" onClick={printReport}>
          Imprimer le Rapport
        </Button>
      </div>
    </SectionWrapper>
  );
};

export default ReportSection;
