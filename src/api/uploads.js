import { API_BASE_URL, apiRequest } from './client'

function parseResponseText(text) {
  const raw = typeof text === 'string' ? text : ''
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return { message: raw }
  }
}

function extractMessage(body) {
  if (!body || typeof body !== 'object') return ''
  const candidates = [body.message, body.error, body.msg, body?.data?.message, body?.data?.error]
  const found = candidates.find((v) => typeof v === 'string' && v.trim().length > 0)
  return found ? found.trim() : ''
}

function uploadFormData(path, formData, { token, onProgress, signal } = {}) {
  const base = API_BASE_URL || window.location.origin
  const url = new URL(path, base).toString()

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', url, true)
    if (typeof token === 'string' && token.trim().length > 0) {
      xhr.setRequestHeader('Authorization', `Bearer ${token.trim()}`)
    }

    xhr.onload = () => {
      const parsed = parseResponseText(xhr.responseText)
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(parsed)
        return
      }
      const message = extractMessage(parsed) || `Request failed (${xhr.status || 0})`
      const err = new Error(message)
      err.status = xhr.status
      err.body = parsed
      reject(err)
    }

    xhr.onerror = () => {
      const err = new Error(`Failed to fetch ${url}`)
      err.status = 0
      reject(err)
    }

    xhr.onabort = () => {
      const err = new Error('Request aborted')
      err.status = 0
      reject(err)
    }

    if (typeof onProgress === 'function') {
      xhr.upload.onprogress = (e) => {
        const total = e && e.total ? Number(e.total) : 0
        const loaded = e && e.loaded ? Number(e.loaded) : 0
        const percent = total > 0 ? Math.max(0, Math.min(100, Math.round((loaded / total) * 100))) : 0
        onProgress({ loaded, total, percent })
      }
    }

    if (signal && typeof signal === 'object' && typeof signal.addEventListener === 'function') {
      if (signal.aborted) {
        xhr.abort()
        return
      }
      const handleAbort = () => xhr.abort()
      signal.addEventListener('abort', handleAbort, { once: true })
    }

    xhr.send(formData)
  })
}

export async function uploadImage(file, { token, onProgress, signal } = {}) {
  const fd = new FormData()
  fd.append('file', file)
  if (onProgress || signal) return uploadFormData('/api/upload/image', fd, { token, onProgress, signal })
  return apiRequest('/api/upload/image', { method: 'POST', token, formData: fd })
}

export async function uploadImages(files, { token, onProgress, signal } = {}) {
  const fd = new FormData()
  Array.from(files || []).forEach((f) => {
    if (f) fd.append('files', f)
  })
  if (onProgress || signal) return uploadFormData('/api/upload/images', fd, { token, onProgress, signal })
  return apiRequest('/api/upload/images', { method: 'POST', token, formData: fd })
}

export async function uploadVideo(file, { token, onProgress, signal } = {}) {
  const fd = new FormData()
  fd.append('file', file)
  if (onProgress || signal) return uploadFormData('/api/upload/video', fd, { token, onProgress, signal })
  return apiRequest('/api/upload/video', { method: 'POST', token, formData: fd })
}
