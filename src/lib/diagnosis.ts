import { diagnosisTypes, levels, questions } from '../config/diagnosis'
import type { Answers, Axis, DiagnosisResult } from '../types'

const axisOrder: Axis[] = ['A', 'B', 'C', 'D']

export function calculateDiagnosis(answers: Answers): DiagnosisResult {
  if (questions.some((question) => !Number.isInteger(answers[question.id]) || answers[question.id] < 1 || answers[question.id] > 4)) {
    throw new Error('12問すべてに回答してください。')
  }

  const axisScores = axisOrder.reduce<Record<Axis, number>>((scores, axis) => {
    scores[axis] = questions
      .filter((question) => question.axis === axis)
      .reduce((sum, question) => sum + answers[question.id], 0)
    return scores
  }, { A: 0, B: 0, C: 0, D: 0 })

  const totalScore = Object.values(axisScores).reduce((sum, score) => sum + score, 0)
  const level = levels.find((item) => totalScore >= item.min && totalScore <= item.max)
  if (!level) throw new Error('Levelを判定できませんでした。')

  const lowestScore = Math.min(...Object.values(axisScores))
  const weakAxes = axisOrder.filter((axis) => axisScores[axis] === lowestScore)

  return {
    axisScores,
    totalScore,
    level,
    primaryType: diagnosisTypes[weakAxes[0]],
    secondaryWeakTypes: weakAxes.slice(1).map((axis) => diagnosisTypes[axis]),
  }
}
