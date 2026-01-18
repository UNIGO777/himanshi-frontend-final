export const ENV_API_BASE_URL = String(import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '')
export const API_BASE_URL = ENV_API_BASE_URL

async function parseResponseBody(response) {
  const raw = await response.text()
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return { message: raw }
  }
}

function getValue(obj, path) {
  if (!obj || typeof obj !== 'object') return undefined
  const keys = path.split('.')
  let cur = obj
  for (const key of keys) {
    if (!cur || typeof cur !== 'object') return undefined
    cur = cur[key]
  }
  return cur
}

function extractMessage(body) {
  const candidates = [
    getValue(body, 'message'),
    getValue(body, 'error'),
    getValue(body, 'msg'),
    getValue(body, 'data.message'),
    getValue(body, 'data.error'),
  ]
  const found = candidates.find((v) => typeof v === 'string' && v.trim().length > 0)
  return found ? found.trim() : ''
}

export async function apiRequest(path, { method = 'GET', token, query, body, formData } = {}) {
  if (!API_BASE_URL && !import.meta.env.DEV) {
    throw new Error('VITE_API_BASE_URL is not set.')
  }
  const base = API_BASE_URL || window.location.origin
  const url = new URL(path, base)
  if (query && typeof query === 'object') {
    Object.entries(query).forEach(([k, v]) => {
      if (v === undefined || v === null || v === '') return
      url.searchParams.set(k, String(v))
    })
  }

  const headers = {}
  if (typeof token === 'string' && token.trim().length > 0) {
    headers.Authorization = `Bearer ${token.trim()}`
  }

  let requestBody
  if (formData) {
    requestBody = formData
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
    requestBody = JSON.stringify(body)
  }

  let response
  try {
    response = await fetch(url.toString(), { method, headers, body: requestBody })
  } catch (err) {
    const message = `Failed to fetch ${url.toString()}`
    const wrapped = new Error(message)
    wrapped.cause = err
    throw wrapped
  }
  const parsed = await parseResponseBody(response)
  if (!response.ok) {
    const message = extractMessage(parsed) || `Request failed (${response.status})`
    const err = new Error(message)
    err.status = response.status
    err.body = parsed
    throw err
  }
  return parsed
}
