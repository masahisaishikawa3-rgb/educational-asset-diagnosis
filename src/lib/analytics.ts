export type AnalyticsEvent =
  | 'diagnosis_view'
  | 'diagnosis_start'
  | 'diagnosis_answer'
  | 'diagnosis_complete'
  | 'generate_lead'
  | 'diagnosis_recommendation_click'
  | 'diagnosis_primary_cta_click'
  | 'diagnosis_secondary_cta_click'

export function track(event: AnalyticsEvent, parameters: Record<string, string | number> = {}) {
  try {
    const gtag = (window as typeof window & { gtag?: (...args: unknown[]) => void }).gtag
    gtag?.('event', event, parameters)
  } catch {
    // Analytics must never block the diagnosis experience.
  }
}

export function trackDiagnosisReportLead() {
  track('generate_lead', { form_type: 'diagnosis_report' })
}
