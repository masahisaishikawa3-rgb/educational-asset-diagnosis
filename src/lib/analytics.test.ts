// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { trackDiagnosisReportLead } from './analytics'

const gtag = vi.fn()

beforeEach(() => {
  gtag.mockClear()
  vi.stubGlobal('gtag', gtag)
})

describe('GA4 events', () => {
  it('generate_leadにはフォーム種別だけを送る', () => {
    trackDiagnosisReportLead()

    expect(gtag).toHaveBeenCalledWith('event', 'generate_lead', {
      form_type: 'diagnosis_report',
    })
  })
})
