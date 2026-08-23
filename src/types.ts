export type Axis = 'A' | 'B' | 'C' | 'D'

export type AnswerOption = {
  label: string
  score: 1 | 2 | 3 | 4
}

export type Question = {
  id: string
  axis: Axis
  prompt: string
  options: AnswerOption[]
}

export type Level = {
  level: 1 | 2 | 3 | 4 | 5
  name: string
  min: number
  max: number
  description: string
}

export type DiagnosisType = {
  axis: Axis
  name: string
  heading: string
  description: string
  actions: string[]
}

export type Answers = Record<string, number>

export type DiagnosisResult = {
  axisScores: Record<Axis, number>
  totalScore: number
  level: Level
  primaryType: DiagnosisType
  secondaryWeakTypes: DiagnosisType[]
}
