// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { saveAnonymousDiagnosis } from './storage'
import type { DiagnosisResult } from '../types'

const fetchMock = vi.fn().mockResolvedValue({ ok: true })

const result: DiagnosisResult = {
  axisScores: { A: 3, B: 4, C: 5, D: 6 },
  totalScore: 18,
  level: { level: 1, name: '属人型', min: 12, max: 19, description: '' },
  primaryType: { axis: 'A', name: '体系化不足型', heading: '', description: '', actions: [] },
  secondaryWeakTypes: [],
}

beforeEach(() => {
  fetchMock.mockClear()
  vi.stubGlobal('fetch', fetchMock)
  vi.stubEnv('VITE_ANONYMOUS_STORAGE_ENABLED', 'true')
  window.history.replaceState({}, '', '/?utm_source=owned&utm_campaign=test-campaign')
})

describe('匿名診断結果保存', () => {
  it('仕様で定めた匿名項目だけを送信する', async () => {
    const answers = Object.fromEntries(Array.from({ length: 12 }, (_, index) => [`Q${index + 1}`, 1]))

    await saveAnonymousDiagnosis({ answers, result, appVersion: '0.1.0' })

    const [, request] = fetchMock.mock.calls[0]
    const payload = JSON.parse(request.body)
    expect(Object.keys(payload).sort()).toEqual([
      'answers', 'app_version', 'axis_scores', 'diagnosis_type', 'level', 'referrer_host',
      'secondary_weak_types', 'total_score', 'utm_campaign', 'utm_content', 'utm_medium', 'utm_source',
    ].sort())
    expect(payload.utm_source).toBe('owned')
    expect(payload.utm_campaign).toBe('test-campaign')
    expect(JSON.stringify(payload)).not.toMatch(/name|email|company|氏名|メール|会社名/i)
  })

  it('保存に失敗しても例外にしない', async () => {
    fetchMock.mockRejectedValueOnce(new Error('offline'))
    await expect(saveAnonymousDiagnosis({ answers: {}, result, appVersion: '0.1.0' })).resolves.toBeUndefined()
  })
})
