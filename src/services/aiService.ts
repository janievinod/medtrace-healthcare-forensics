import { GoogleGenerativeAI } from '@google/generative-ai';
import { ThreatAlert, AIForensicReport } from '../types';

export async function generateAIForensicReport(
  alert: ThreatAlert,
  apiKey: string
): Promise<AIForensicReport> {
  if (!apiKey) {
    throw new Error('Gemini API key is missing.');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
    You are a Lead Healthcare Digital Forensics Specialist analyzing a SIEM security event in an EHR system.
    
    Alert Details:
    - ID: ${alert.id}
    - User: ${alert.doctorName} (ID: ${alert.doctorId}, Dept: ${alert.department})
    - Action: ${alert.action}
    - Severity: ${alert.severity}
    - Anomaly Score: ${alert.anomalyScore}/100
    - Records Accessed: ${alert.recordsAccessed}
    - Time Window: ${alert.timeWindow} on ${alert.timestamp}
    - IP Address: ${alert.ipAddress}
    - Device: ${alert.deviceId}
    - Location: ${alert.location}
    - Description: ${alert.description}

    Provide a structured forensic report formatted strictly in valid JSON with these keys:
    {
      "summary": "Concise summary of the forensic incident.",
      "riskAssessment": "Detailed risk assessment regarding HIPAA/data compliance.",
      "keyIndicators": ["Indicator 1", "Indicator 2", "Indicator 3"],
      "timelineAnalysis": "Chronological breakdown of observed behavior vs user baseline.",
      "hipaaImpact": "Impact on HIPAA privacy and breach notification rules.",
      "mitigationSteps": ["Step 1", "Step 2", "Step 3"]
    }
  `;

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();
  const cleanedJson = responseText.replace(/```json|```/g, '').trim();

  return JSON.parse(cleanedJson) as AIForensicReport;
}