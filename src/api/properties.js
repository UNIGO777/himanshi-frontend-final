import { apiRequest, API_BASE_URL } from './client'

function normalizeId(value) {
  if (typeof value === 'string' && value.trim().length > 0) return value.trim()
  if (typeof value === 'number') return String(value)
  return ''
}

function resolveMediaUrl(input) {
  if (typeof input !== 'string') return ''
  const raw = input.trim()
  if (!raw) return ''
  const hasProtocol = /^https?:\/\//i.test(raw)

  try {
    const url = hasProtocol ? new URL(raw) : null
    if (url && (url.hostname === 'localhost' || url.hostname === '127.0.0.1')) {
      if (!API_BASE_URL) return `${url.pathname}${url.search}`
      return `${API_BASE_URL}${url.pathname}${url.search}`
    }
    if (API_BASE_URL) {
      if (raw.startsWith('/')) return `${API_BASE_URL}${raw}`
      if (!hasProtocol) return `${API_BASE_URL}/${raw.replace(/^\/+/, '')}`
    }
    return raw.startsWith('/') ? raw : raw
  } catch {
    if (!API_BASE_URL) return raw
    if (raw.startsWith('/')) return `${API_BASE_URL}${raw}`
    if (!hasProtocol) return `${API_BASE_URL}/${raw.replace(/^\/+/, '')}`
    return raw
  }
}

function extractPropertyList(payload) {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.items)) return payload.items
  if (Array.isArray(payload?.data)) return payload.data
  if (Array.isArray(payload?.properties)) return payload.properties
  if (Array.isArray(payload?.value)) return payload.value
  if (Array.isArray(payload?.results)) return payload.results
  return []
}

function formatPriceWithCommas(value) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(value)
  }

  if (typeof value !== 'string') return ''
  const raw = value.trim()
  if (!raw) return ''

  const match = /^(?<prefix>(?:₹|rs\.?|inr)?\s*)?(?<amount>[\d,]+(?:\.\d+)?)\s*$/i.exec(raw)
  if (!match) return raw

  const amountRaw = String(match.groups?.amount || '').replace(/,/g, '')
  const n = Number.parseFloat(amountRaw)
  if (!Number.isFinite(n)) return raw

  const prefix = String(match.groups?.prefix || '')
  const formatted = new Intl.NumberFormat('en-IN', { maximumFractionDigits: amountRaw.includes('.') ? 2 : 0 }).format(n)
  return `${prefix}${formatted}`
}

export function normalizePropertyPreview(p) {
  const id = normalizeId(p?.id ?? p?._id ?? p?.propertyId)
  const title = typeof p?.title === 'string' ? p.title : typeof p?.name === 'string' ? p.name : 'Property'
  const imageCandidate =
    typeof p?.image === 'string'
      ? p.image
      : Array.isArray(p?.images) && typeof p.images[0] === 'string'
        ? p.images[0]
        : ''
  const image = resolveMediaUrl(imageCandidate)
  const videoCandidate =
    typeof p?.video === 'string'
      ? p.video
      : typeof p?.videoUrl === 'string'
        ? p.videoUrl
        : typeof p?.videoURL === 'string'
          ? p.videoURL
          : typeof p?.video_url === 'string'
            ? p.video_url
            : ''
  const video = resolveMediaUrl(videoCandidate)
  const location = typeof p?.location === 'string' ? p.location : typeof p?.city === 'string' ? p.city : typeof p?.address === 'string' ? p.address : ''
  const priceSource = p?.price ?? p?.rent ?? ''
  const price = formatPriceWithCommas(priceSource)
  const beds = typeof p?.beds === 'number' ? p.beds : typeof p?.bedrooms === 'number' ? p.bedrooms : 0
  const baths = typeof p?.baths === 'number' ? p.baths : typeof p?.bathrooms === 'number' ? p.bathrooms : 0
  const area = typeof p?.area === 'string' ? p.area : typeof p?.area === 'number' ? `${p.area}` : typeof p?.size === 'string' ? p.size : ''

  const rawSafe = p && typeof p === 'object' ? { ...p } : {}
  if (typeof rawSafe.image === 'string') rawSafe.image = resolveMediaUrl(rawSafe.image)
  if (Array.isArray(rawSafe.images)) {
    rawSafe.images = rawSafe.images.map((src) => (typeof src === 'string' ? resolveMediaUrl(src) : '')).filter((src) => src)
  }
  if (typeof rawSafe.video === 'string') rawSafe.video = resolveMediaUrl(rawSafe.video)
  if (typeof rawSafe.videoUrl === 'string') rawSafe.videoUrl = resolveMediaUrl(rawSafe.videoUrl)
  if (!rawSafe.video && video) rawSafe.video = video

  return { id, title, image, video, location, price, beds, baths, area, raw: rawSafe }
}

export async function getProperties() {
  const payload = await apiRequest('/api/properties', { method: 'GET' })
  const list = extractPropertyList(payload)
  return list.map(normalizePropertyPreview).filter((x) => x.id)
}

export async function getPropertyById(propertyId) {
  const id = normalizeId(propertyId)
  const payload = await apiRequest(`/api/properties/${encodeURIComponent(id)}`, { method: 'GET' })
  const prop = payload?.data ?? payload?.property ?? payload?.value ?? payload
  return normalizePropertyPreview(prop)
}

export async function getFeaturedProperties({ limit } = {}) {
  const normalizedLimit = limit === undefined ? undefined : Math.min(100, Math.max(1, Number.parseInt(limit, 10) || 6))
  const payload = await apiRequest('/api/properties/featured', {
    method: 'GET',
    query: { limit: normalizedLimit },
  })
  const list = extractPropertyList(payload)
  return list.map(normalizePropertyPreview).filter((x) => x.id)
}

export async function getRelatedProperties({ propertyId, limit = 6 } = {}) {
  const id = normalizeId(propertyId)
  if (!id) return []
  const normalizedLimit = Math.min(100, Math.max(1, Number.parseInt(limit, 10) || 6))
  const payload = await apiRequest(`/api/properties/${encodeURIComponent(id)}/related`, {
    method: 'GET',
    query: { limit: normalizedLimit },
  })
  const list = extractPropertyList(payload)
  return list.map(normalizePropertyPreview).filter((x) => x.id && x.id !== id)
}

export async function searchProperties({
  q,
  keyword,
  city,
  state,
  pincode,
  propertyType,
  listingType,
  status,
  furnishedStatus,
  listedBy,
  facing,
  verified,
  isFeatured,
  minPrice,
  maxPrice,
  minArea,
  maxArea,
  minBedrooms,
  minBathrooms,
  amenities,
  page = 1,
  limit = 20,
  sortBy = 'createdAt',
  sortOrder = 'desc',
} = {}) {
  const normalizedPage = Math.max(1, Number.parseInt(page, 10) || 1)
  const normalizedLimit = Math.min(100, Math.max(1, Number.parseInt(limit, 10) || 20))
  const qValue = typeof q === 'string' && q.trim().length > 0 ? q.trim() : typeof keyword === 'string' ? keyword.trim() : ''
  const amenitiesValue = Array.isArray(amenities) ? amenities.filter((x) => typeof x === 'string' && x.trim().length > 0).join(',') : amenities
  const query = {
    q: qValue,
    city,
    state,
    pincode,
    propertyType,
    listingType,
    status,
    furnishedStatus,
    listedBy,
    facing,
    verified,
    isFeatured,
    minPrice,
    maxPrice,
    minArea,
    maxArea,
    minBedrooms,
    minBathrooms,
    amenities: amenitiesValue,
    page: normalizedPage,
    limit: normalizedLimit,
    sortBy,
    sortOrder,
  }

  const payload = await apiRequest('/api/properties/search', { method: 'GET', query })
  let list = extractPropertyList(payload)

  const rawCity = typeof city === 'string' ? city.trim() : ''
  if (rawCity && list.length === 0) {
    const toTitleCase = (value) =>
      String(value)
        .trim()
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase())

    const candidates = [rawCity.toLowerCase(), toTitleCase(rawCity)].filter(
      (c, idx, arr) => c && c !== rawCity && arr.indexOf(c) === idx,
    )

    for (const candidate of candidates) {
      const retryPayload = await apiRequest('/api/properties/search', {
        method: 'GET',
        query: { ...query, city: candidate },
      })
      const retryList = extractPropertyList(retryPayload)
      if (retryList.length > 0) {
        list = retryList
        break
      }
    }
  }

  return list.map(normalizePropertyPreview).filter((x) => x.id)
}

export async function createPropertyQuery({ propertyId, message, token }) {
  const id = normalizeId(propertyId)
  return apiRequest(`/api/properties/${encodeURIComponent(id)}/queries`, {
    method: 'POST',
    token,
    body: { message },
  })
}

export async function getPropertyQueries({ propertyId, token }) {
  const id = normalizeId(propertyId)
  return apiRequest(`/api/properties/${encodeURIComponent(id)}/queries`, { method: 'GET', token })
}

export async function createPropertyRating({ propertyId, stars, comment, token }) {
  const id = normalizeId(propertyId)
  return apiRequest(`/api/properties/${encodeURIComponent(id)}/ratings`, {
    method: 'POST',
    token,
    body: { stars, comment },
  })
}
