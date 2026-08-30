// @vitest-environment node

import { describe, expect, it } from 'vitest'
import { validatePayload } from '../../netlify/functions/diagnosis-result.mjs'

const validPayload = {
  answers: Object.fromEntries(Array.from({ length: 12 }, (_, index) => [`Q${index + 1}`, 1])),
  axis_scores: { A: 3, B: 3, C: 3, D: 3 },
  total_score: 12,
  level: 1,
  diagnosis_type: '体系化不足型',
  secondary_weak_types: ['教材化不足型'],
  referrer_host: 'www.adop-context.jp',
  utm_source: 'owned',
  utm_medium: null,
  utm_campaign: null,
  utm_content: null,
  app_version: '0.1.0',
}

describe('diagnosis-result function', () => {
  it('匿名診断データを保存用の固定スキーマへ変換する', () => {
    expect(validatePayload(validPayload)).toEqual(expect.objectContaining({
      score_a: 3,
      total_score: 12,
      diagnosis_type: '体系化不足型',
    }))
  })

  it('余分な回答、範囲外スコア、不正なキャンペーン値を拒否する', () => {
    expect(validatePayload({ ...validPayload, answers: { ...validPayload.answers, email: 'x@example.com' } })).toBeNull()
    expect(validatePayload({ ...validPayload, answers: { ...validPayload.answers, Q1: 5 } })).toBeNull()
    expect(validatePayload({ ...validPayload, utm_source: 'x@example.com' })).toBeNull()
  })
})
