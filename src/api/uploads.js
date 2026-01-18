import { apiRequest } from './client'

export async function uploadImage(file, { token } = {}) {
  const fd = new FormData()
  fd.append('file', file)
  return apiRequest('/api/upload/image', { method: 'POST', token, formData: fd })
}

export async function uploadImages(files, { token } = {}) {
  const fd = new FormData()
  Array.from(files || []).forEach((f) => {
    if (f) fd.append('files', f)
  })
  return apiRequest('/api/upload/images', { method: 'POST', token, formData: fd })
}

export async function uploadVideo(file, { token } = {}) {
  const fd = new FormData()
  fd.append('file', file)
  return apiRequest('/api/upload/video', { method: 'POST', token, formData: fd })
}
