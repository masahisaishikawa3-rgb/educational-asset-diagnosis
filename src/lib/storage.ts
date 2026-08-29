import type { Answers, DiagnosisResult } from '../types'

type SaveAnonymousDiagnosisInput = {
  answers: Answers
  result: DiagnosisResult
  appVersion: string
}

function getReferrerHost() {
  try {
    return document.referrer ? new URL(document.referrer).hostname : null
  } catch {
    return null
  }
}

function getCampaignValue(name: string) {
  const value = new URLSearchParams(window.location.search).get(name)
  if (!value || value.length > 100 || !/^[a-zA-Z0-9._~-]+$/.test(value)) return null
  return value
}

export async function saveAnonymousDiagnosis({ answers, result, appVersion }: SaveAnonymousDiagnosisInput) {
  if (import.meta.env.VITE_ANONYMOUS_STORAGE_ENABLED !== 'true') return

  const payload = {
    answers,
    axis_scores: result.axisScores,
    total_score: result.totalScore,
    level: result.level.level,
    diagnosis_type: result.primaryType.name,
    secondary_weak_types: result.secondaryWeakTypes.map((type) => type.name),
    referrer_host: getReferrerHost(),
    utm_source: getCampaignValue('utm_source'),
    utm_medium: getCampaignValue('utm_medium'),
    utm_campaign: getCampaignValue('utm_campaign'),
    utm_content: getCampaignValue('utm_content'),
    app_version: appVersion,
  }

  try {
    await fetch('/.netlify/functions/diagnosis-result', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    })
  } catch {
    // Anonymous storage is fail-open and must never block result display.
  }
}
