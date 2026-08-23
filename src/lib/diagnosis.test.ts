import { describe, expect, it } from 'vitest'
import { questions } from '../config/diagnosis'
import type { Answers } from '../types'
import { calculateDiagnosis } from './diagnosis'

const all = (score: number): Answers => Object.fromEntries(questions.map((question) => [question.id, score]))

function withAxisScores(a: number, b: number, c: number, d: number): Answers {
  const axisTotals = { A: a, B: b, C: c, D: d }
  return Object.fromEntries(questions.map((question, index) => {
    const axisIndex = index % 3
    const total = axisTotals[question.axis]
    const base = Math.floor(total / 3)
    const remainder = total % 3
    return [question.id, base + (axisIndex < remainder ? 1 : 0)]
  }))
}

describe('calculateDiagnosis', () => {
  it('全1点はLevel 1、全4点はLevel 5になる', () => {
    expect(calculateDiagnosis(all(1)).level.level).toBe(1)
    expect(calculateDiagnosis(all(4)).level.level).toBe(5)
  })

  it.each([
    [19, 1], [20, 2], [27, 2], [28, 3], [35, 3], [36, 4], [42, 4], [43, 5],
  ])('総合点%iはLevel %iになる', (total, expectedLevel) => {
    const scores = [3, 3, 3, 3]
    let remaining = total - 12
    for (let index = 0; index < scores.length && remaining > 0; index += 1) {
      const extra = Math.min(9, remaining)
      scores[index] += extra
      remaining -= extra
    }
    expect(calculateDiagnosis(withAxisScores(scores[0], scores[1], scores[2], scores[3])).level.level).toBe(expectedLevel)
  })

  it.each([
    ['A', [3, 6, 9, 12]], ['B', [6, 3, 9, 12]], ['C', [9, 6, 3, 12]], ['D', [12, 9, 6, 3]],
  ] as const)('%sのみ最低の場合、その軸がprimaryになる', (axis, scores) => {
    expect(calculateDiagnosis(withAxisScores(scores[0], scores[1], scores[2], scores[3])).primaryType.axis).toBe(axis)
  })

  it('A/B同点ではAがprimary、Bがsecondaryになる', () => {
    const result = calculateDiagnosis(withAxisScores(6, 6, 9, 12))
    expect(result.primaryType.axis).toBe('A')
    expect(result.secondaryWeakTypes.map((type) => type.axis)).toEqual(['B'])
  })

  it('B/C同点ではBがprimary、Cがsecondaryになる', () => {
    const result = calculateDiagnosis(withAxisScores(9, 6, 6, 12))
    expect(result.primaryType.axis).toBe('B')
    expect(result.secondaryWeakTypes.map((type) => type.axis)).toEqual(['C'])
  })

  it('未回答がある場合は結果を生成しない', () => {
    expect(() => calculateDiagnosis({})).toThrow('12問すべてに回答してください。')
  })
})
