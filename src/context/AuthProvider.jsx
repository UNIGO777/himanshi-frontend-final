import { useCallback, useEffect, useMemo, useState } from 'react'
import { AuthContext, AUTH_STORAGE_KEY } from './AuthContext'
import { API_BASE_URL } from '../api/client'

function safeParse(raw, fallback) {
  if (!raw) return fallback
  try {
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

function loadSessionUser() {
  if (typeof window === 'undefined') return null
  const user = safeParse(window.localStorage.getItem(AUTH_STORAGE_KEY), null)
  if (!user || typeof user !== 'object') return null
  if (typeof user.id !== 'string' || typeof user.email !== 'string') return null
  return user
}

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

function extractToken(body) {
  const candidates = [
    getValue(body, 'token'),
    getValue(body, 'accessToken'),
    getValue(body, 'authToken'),
    getValue(body, 'data.token'),
    getValue(body, 'data.accessToken'),
    getValue(body, 'data.authToken'),
  ]
  const found = candidates.find((v) => typeof v === 'string' && v.trim().length > 0)
  return found ? found.trim() : ''
}

function extractVerificationId(body) {
  const candidates = [
    getValue(body, 'verificationId'),
    getValue(body, 'requestId'),
    getValue(body, 'otpId'),
    getValue(body, 'data.verificationId'),
    getValue(body, 'data.requestId'),
    getValue(body, 'data.otpId'),
  ]
  const found = candidates.find((v) => typeof v === 'string' && v.trim().length > 0)
  return found ? found.trim() : ''
}

function extractUser(body) {
  const candidates = [getValue(body, 'user'), getValue(body, 'data.user')]
  const found = candidates.find((v) => v && typeof v === 'object')
  return found || null
}

function base64UrlToUtf8String(input) {
  if (typeof input !== 'string' || input.length === 0) return ''
  try {
    const base64 = input.replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64 + '==='.slice((base64.length + 3) % 4)
    const binary = window.atob(padded)
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))
    return new TextDecoder().decode(bytes)
  } catch {
    return ''
  }
}

function decodeJwtPayload(token) {
  if (typeof token !== 'string' || token.trim().length === 0) return null
  const parts = token.split('.')
  if (parts.length < 2) return null
  const decoded = base64UrlToUtf8String(parts[1])
  if (!decoded) return null
  try {
    const parsed = JSON.parse(decoded)
    return parsed && typeof parsed === 'object' ? parsed : null
  } catch {
    return null
  }
}

function deriveRawUserFromBody(body, fallbackEmail) {
  const idCandidates = [
    getValue(body, 'userId'),
    getValue(body, 'id'),
    getValue(body, '_id'),
    getValue(body, 'data.userId'),
    getValue(body, 'data.id'),
    getValue(body, 'data._id'),
  ]
  const emailCandidates = [getValue(body, 'email'), getValue(body, 'data.email'), fallbackEmail]

  const id = idCandidates.find((v) => typeof v === 'string' || typeof v === 'number')
  const email = emailCandidates.find((v) => typeof v === 'string' && v.trim().length > 0)
  if (typeof id !== 'string' && typeof id !== 'number') return null
  return { id, email }
}

function deriveRawUserFromJwt(token, fallbackEmail) {
  const payload = decodeJwtPayload(token)
  if (!payload) return null
  const id = payload.userId ?? payload.id ?? payload.sub
  const email = payload.email ?? fallbackEmail
  if (typeof id !== 'string' && typeof id !== 'number') return null
  return { id, email }
}

function extractPhone(rawUser, fallbackPhone) {
  if (rawUser && typeof rawUser === 'object') {
    const candidates = [
      rawUser.phone,
      rawUser.mobile,
      rawUser.phoneNumber,
      rawUser.mobileNumber,
      rawUser.contactNumber,
    ]
    const found = candidates.find((v) => typeof v === 'string' && v.trim().length > 0)
    if (found) return found.trim()
  }
  return typeof fallbackPhone === 'string' && fallbackPhone.trim().length > 0 ? fallbackPhone.trim() : ''
}

function normalizeSessionUser({ rawUser, token, fallbackEmail, fallbackPhone }) {
  if (!rawUser || typeof rawUser !== 'object') return null
  const id = rawUser.id ?? rawUser._id ?? rawUser.userId
  const email = rawUser.email ?? fallbackEmail
  const cleanId = typeof id === 'string' ? id.trim() : typeof id === 'number' ? String(id) : ''
  const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : ''
  if (!cleanId) return null
  if (!cleanEmail) return null

  const name = typeof rawUser.name === 'string' ? rawUser.name : typeof rawUser.fullName === 'string' ? rawUser.fullName : ''
  const phone = extractPhone(rawUser, fallbackPhone)
  const sessionUser = { id: cleanId, email: cleanEmail, name }
  if (phone) sessionUser.phone = phone
  if (typeof token === 'string' && token.trim().length > 0) {
    sessionUser.token = token.trim()
  }
  return sessionUser
}

async function apiPost(path, body) {
  if (!API_BASE_URL && !import.meta.env.DEV) {
    throw new Error('VITE_API_BASE_URL is not set.')
  }
  const url = API_BASE_URL ? `${API_BASE_URL}${path}` : path
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body ?? {}),
  })
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

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => loadSessionUser())

  useEffect(() => {
    if (user) {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
    } else {
      window.localStorage.removeItem(AUTH_STORAGE_KEY)
    }
  }, [user])

  const signup = useCallback(async ({ name, email, phone, password }) => {
    const cleanName = typeof name === 'string' ? name.trim() : ''
    const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : ''
    const cleanPhone = typeof phone === 'string' ? phone.trim() : ''
    const cleanPassword = typeof password === 'string' ? password : ''

    if (!cleanName || !cleanEmail || cleanPassword.length < 6) {
      return { ok: false, message: 'Please enter name, email, and password (min 6 chars).' }
    }

    try {
      const payload = await apiPost('/api/auth/signup', { name: cleanName, email: cleanEmail, phone: cleanPhone || undefined, password: cleanPassword })
      const token = extractToken(payload)
      const rawUser = extractUser(payload) || deriveRawUserFromBody(payload, cleanEmail) || deriveRawUserFromJwt(token, cleanEmail)
      const sessionUser = normalizeSessionUser({ rawUser, token, fallbackEmail: cleanEmail, fallbackPhone: cleanPhone })
      if (sessionUser) {
        setUser(sessionUser)
        return { ok: true }
      }

      const verificationId = extractVerificationId(payload)
      return { ok: true, next: 'otp', verificationId, message: extractMessage(payload) || 'OTP sent.' }
    } catch (err) {
      return { ok: false, message: err?.message || 'Signup failed.' }
    }
  }, [])

  const login = useCallback(async ({ email, phone, password }) => {
    const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : ''
    const cleanPhone = typeof phone === 'string' ? phone.trim() : ''
    const cleanPassword = typeof password === 'string' ? password : ''

    if (!cleanEmail || !cleanPassword) {
      return { ok: false, message: 'Please enter email and password.' }
    }

    try {
      const payload = await apiPost('/api/auth/login', { email: cleanEmail, phone: cleanPhone || undefined, password: cleanPassword })
      const token = extractToken(payload)
      const rawUser = extractUser(payload) || deriveRawUserFromBody(payload, cleanEmail) || deriveRawUserFromJwt(token, cleanEmail)
      const sessionUser = normalizeSessionUser({ rawUser, token, fallbackEmail: cleanEmail, fallbackPhone: cleanPhone })
      if (sessionUser) {
        setUser(sessionUser)
        return { ok: true }
      }

      const verificationId = extractVerificationId(payload)
      return { ok: true, next: 'otp', verificationId, message: extractMessage(payload) || 'OTP sent.' }
    } catch (err) {
      return { ok: false, message: err?.message || 'Login failed.' }
    }
  }, [])

  const verifyOtp = useCallback(async ({ email, otp, flow }) => {
    const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : ''
    const cleanOtp = typeof otp === 'string' ? otp.trim() : ''
    const cleanFlow = typeof flow === 'string' ? flow.trim().toLowerCase() : ''

    if (!cleanEmail || !cleanOtp) {
      return { ok: false, message: 'Please enter email and OTP.' }
    }

    try {
      const path = cleanFlow === 'signup' ? '/api/auth/signup/verify-otp' : '/api/auth/login/verify-otp'
      const payload = await apiPost(path, {
        email: cleanEmail,
        otp: cleanOtp,
      })
      const token = extractToken(payload)
      const rawUser = extractUser(payload) || deriveRawUserFromBody(payload, cleanEmail) || deriveRawUserFromJwt(token, cleanEmail)
      const sessionUser = normalizeSessionUser({ rawUser, token, fallbackEmail: cleanEmail })
      if (!sessionUser) {
        return { ok: false, message: extractMessage(payload) || 'OTP verification failed.' }
      }

      setUser(sessionUser)
      return { ok: true }
    } catch (err) {
      return { ok: false, message: err?.message || 'OTP verification failed.' }
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      login,
      signup,
      verifyOtp,
      logout,
    }),
    [login, logout, signup, user, verifyOtp],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
