import type { Answers } from '../types'

const STORAGE_KEY = 'educational-asset-diagnosis:answers:v0.1'

export function loadAnswers(): Answers {
  try {
    const value = sessionStorage.getItem(STORAGE_KEY)
    return value ? JSON.parse(value) as Answers : {}
  } catch {
    return {}
  }
}

export function saveAnswers(answers: Answers) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(answers))
  } catch {
    // State persistence must not stop the diagnosis.
  }
}

export function clearAnswers() {
  try {
    sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    // No-op by design.
  }
}
