const questionIds = Array.from({ length: 12 }, (_, index) => `Q${index + 1}`)
const diagnosisTypes = ['体系化不足型', '教材化不足型', '運用不足型', '改善不足型']
const allowedOrigins = new Set([
  'https://diagnosis.adop-context.co.jp',
  'https://educational-asset.netlify.app',
])

const response = (statusCode, body) => ({
  statusCode,
  headers: { 'content-type': 'application/json; charset=utf-8' },
  body: JSON.stringify(body),
})

const isScore = (value) => Number.isInteger(value) && value >= 1 && value <= 4
const isAxisScore = (value) => Number.isInteger(value) && value >= 3 && value <= 12
const isNullableToken = (value) => value === null || (typeof value === 'string' && value.length <= 100 && /^[a-zA-Z0-9._~-]+$/.test(value))

export function createSupabaseHeaders(key) {
  const headers = {
    apikey: key,
    'content-type': 'application/json',
    prefer: 'return=minimal',
  }
  if (!key.startsWith('sb_secret_')) headers.authorization = `Bearer ${key}`
  return headers
}

export function validatePayload(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null

  const answers = value.answers
  if (!answers || typeof answers !== 'object' || Array.isArray(answers)) return null
  if (Object.keys(answers).length !== questionIds.length || questionIds.some((id) => !isScore(answers[id]))) return null

  const axisScores = value.axis_scores
  if (!axisScores || typeof axisScores !== 'object' || Array.isArray(axisScores)) return null
  if (!['A', 'B', 'C', 'D'].every((axis) => isAxisScore(axisScores[axis]))) return null

  const calculatedTotal = Object.values(axisScores).reduce((sum, score) => sum + score, 0)
  if (value.total_score !== calculatedTotal || calculatedTotal < 12 || calculatedTotal > 48) return null
  if (!Number.isInteger(value.level) || value.level < 1 || value.level > 5) return null
  if (!diagnosisTypes.includes(value.diagnosis_type)) return null
  if (!Array.isArray(value.secondary_weak_types) || value.secondary_weak_types.some((type) => !diagnosisTypes.includes(type))) return null
  if (value.referrer_host !== null && (typeof value.referrer_host !== 'string' || value.referrer_host.length > 253 || !/^[a-zA-Z0-9.-]+$/.test(value.referrer_host))) return null
  if (!['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'].every((key) => isNullableToken(value[key]))) return null
  if (typeof value.app_version !== 'string' || !/^\d+\.\d+\.\d+$/.test(value.app_version)) return null

  return {
    answers: Object.fromEntries(questionIds.map((id) => [id, answers[id]])),
    score_a: axisScores.A,
    score_b: axisScores.B,
    score_c: axisScores.C,
    score_d: axisScores.D,
    total_score: calculatedTotal,
    level: value.level,
    diagnosis_type: value.diagnosis_type,
    secondary_weak_types: value.secondary_weak_types,
    referrer_host: value.referrer_host,
    utm_source: value.utm_source,
    utm_medium: value.utm_medium,
    utm_campaign: value.utm_campaign,
    utm_content: value.utm_content,
    app_version: value.app_version,
  }
}

export async function handler(event) {
  if (event.httpMethod !== 'POST') return response(405, { error: 'method_not_allowed' })

  const origin = event.headers?.origin
  if (origin && !allowedOrigins.has(origin) && !origin.startsWith('http://localhost:')) {
    return response(403, { error: 'origin_not_allowed' })
  }

  let body
  try {
    body = JSON.parse(event.body ?? '')
  } catch {
    return response(400, { error: 'invalid_json' })
  }

  const payload = validatePayload(body)
  if (!payload) return response(400, { error: 'invalid_payload' })

  const supabaseUrl = process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceRoleKey) return response(503, { error: 'storage_not_configured' })

  try {
    const stored = await fetch(`${supabaseUrl}/rest/v1/diagnosis_results`, {
      method: 'POST',
      headers: createSupabaseHeaders(serviceRoleKey),
      body: JSON.stringify(payload),
    })
    if (!stored.ok) return response(502, { error: 'storage_failed' })
    return response(202, { stored: true })
  } catch {
    return response(502, { error: 'storage_failed' })
  }
}
