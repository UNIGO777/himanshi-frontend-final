import { motion } from 'framer-motion'
import { FiChevronDown, FiDroplet, FiHeart, FiHome, FiMap, FiMapPin, FiMaximize2, FiSearch } from 'react-icons/fi'
import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import Navbar from '../../Components/Navbar'
import FooterSection from '../../Components/FooterSection'
import Container from '../../Components/Container'
import useWishlist from '../../hooks/useWishlist'
import { getProperties, searchProperties } from '../../api/properties'

function upsertMeta({ name, property }, content) {
  if (typeof document === 'undefined') return
  const key = name ? `meta[name="${name}"]` : `meta[property="${property}"]`
  let el = document.querySelector(key)
  if (!el) {
    el = document.createElement('meta')
    if (name) el.setAttribute('name', name)
    if (property) el.setAttribute('property', property)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertCanonical(href) {
  if (typeof document === 'undefined') return
  let el = document.querySelector('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 20
const MAX_LIMIT = 100
const DEFAULT_SORT_BY = 'createdAt'
const DEFAULT_SORT_ORDER = 'desc'

function slugifySegment(value) {
  const raw = typeof value === 'string' ? value.trim().toLowerCase() : ''
  if (!raw) return ''
  return raw
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function deslugifySegment(value) {
  const raw = typeof value === 'string' ? value.trim() : ''
  if (!raw) return ''
  return raw.replace(/-+/g, ' ').trim()
}

function clampInt(value, { min, max, fallback }) {
  const n = Number.parseInt(String(value), 10)
  if (!Number.isFinite(n)) return fallback
  return Math.min(max, Math.max(min, n))
}

function parsePriceRangeToMinMax(range) {
  if (!range) return {}
  const [minRaw, maxRaw] = String(range).split('-')
  const min = minRaw ? Number.parseFloat(minRaw) : undefined
  const max = maxRaw ? Number.parseFloat(maxRaw) : undefined
  return {
    minPrice: Number.isFinite(min) ? String(min) : '',
    maxPrice: Number.isFinite(max) ? String(max) : '',
  }
}

function extractCityLabel(input) {
  const raw = typeof input === 'string' ? input.trim() : ''
  if (!raw) return ''
  const first = raw.split('•')[0] || raw
  const cleaned = first.split(',')[0] || first
  return cleaned.trim()
}

function getCityFromProperty(p) {
  const rawCity = p?.raw?.city
  if (typeof rawCity === 'string' && rawCity.trim().length > 0) return extractCityLabel(rawCity)
  return extractCityLabel(p?.location)
}

function buildDefaultFilters(overrides = {}) {
  return {
    city: '',
    state: '',
    propertyType: '',
    listingType: '',
    status: '',
    facing: '',
    verified: '',
    isFeatured: '',
    priceRange: '',
    minArea: '',
    page: DEFAULT_PAGE,
    limit: DEFAULT_LIMIT,
    sortBy: DEFAULT_SORT_BY,
    sortOrder: DEFAULT_SORT_ORDER,
    ...overrides,
  }
}

function getFiltersFromUrl({ citySlug, search }) {
  const params = new URLSearchParams(search)
  const cityFromQuery = (params.get('city') || '').trim()
  const cityFromSlug = deslugifySegment(citySlug)
  const city = cityFromQuery || cityFromSlug
  const rawMinPrice = (params.get('minPrice') || '').trim()
  const rawMaxPrice = (params.get('maxPrice') || '').trim()
  const priceRange = (params.get('priceRange') || (rawMinPrice || rawMaxPrice ? `${rawMinPrice}-${rawMaxPrice}` : '')).trim()

  return buildDefaultFilters({
    city,
    state: (params.get('state') || '').trim(),
    propertyType: (params.get('propertyType') || '').trim(),
    listingType: (params.get('listingType') || '').trim(),
    status: (params.get('status') || '').trim(),
    facing: (params.get('facing') || '').trim(),
    verified: (params.get('verified') || '').trim(),
    isFeatured: (params.get('isFeatured') || '').trim(),
    priceRange,
    minArea: (params.get('minArea') || '').trim(),
    page: clampInt(params.get('page'), { min: 1, max: Number.POSITIVE_INFINITY, fallback: DEFAULT_PAGE }),
    limit: clampInt(params.get('limit'), { min: 1, max: MAX_LIMIT, fallback: DEFAULT_LIMIT }),
    sortBy: (params.get('sortBy') || DEFAULT_SORT_BY).trim(),
    sortOrder: (params.get('sortOrder') || DEFAULT_SORT_ORDER).trim(),
  })
}

function hasMeaningfulFilter(filters) {
  const keys = [
    'city',
    'state',
    'propertyType',
    'listingType',
    'status',
    'facing',
    'verified',
    'isFeatured',
    'priceRange',
    'minArea',
  ]
  return keys.some((k) => String(filters?.[k] || '').trim().length > 0)
}

function buildSearchUrl(filters) {
  const next = buildDefaultFilters(filters)
  const cleanCity = next.city.trim()
  const pathname = cleanCity ? `/properties-in-${slugifySegment(cleanCity)}` : '/properties/search'
  const params = new URLSearchParams()

  const setIf = (key, value) => {
    const v = typeof value === 'string' ? value.trim() : value
    if (v === undefined || v === null) return
    if (typeof v === 'string' && v.length === 0) return
    params.set(key, String(v))
  }

  setIf('city', cleanCity)
  setIf('state', next.state)
  setIf('propertyType', next.propertyType)
  setIf('listingType', next.listingType)
  setIf('status', next.status)
  setIf('facing', next.facing)
  setIf('verified', next.verified)
  setIf('isFeatured', next.isFeatured)
  setIf('priceRange', next.priceRange)
  setIf('minArea', next.minArea)

  if (next.page !== DEFAULT_PAGE) params.set('page', String(next.page))
  if (next.limit !== DEFAULT_LIMIT) params.set('limit', String(next.limit))
  if (next.sortBy && next.sortBy !== DEFAULT_SORT_BY) params.set('sortBy', next.sortBy)
  if (next.sortOrder && next.sortOrder !== DEFAULT_SORT_ORDER) params.set('sortOrder', next.sortOrder)

  const search = params.toString()
  return { pathname, search: search ? `?${search}` : '' }
}

function StatPill({ icon: Icon, value }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
      <Icon className="text-slate-600" />
      {value}
    </div>
  )
}

function ListingCard({ property }) {
  const { hasItem, toggleItem } = useWishlist()
  const navigate = useNavigate()
  const isPlot = property.beds === 0 && property.baths === 0
  const isSaved = hasItem(property.id)
  const hasImage = typeof property.image === 'string' && property.image.trim().length > 0
  const wishlistItem = {
    id: property.id,
    title: property.title,
    image: property.image,
    price: property.price,
    location: property.location,
  }

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.18 }}
      onClick={() => navigate(`/property/${property.id}`)}
      className="cursor-pointer overflow-hidden rounded-3xl border border-slate-200 bg-white"
    >
      <div className="relative h-44 sm:h-48">
        {hasImage ? (
          <img src={property.image} alt={property.title} className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <div className="h-full w-full bg-slate-100" aria-hidden="true" />
        )}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            toggleItem(wishlistItem)
          }}
          aria-label={isSaved ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full border backdrop-blur transition-colors ${
            isSaved ? 'border-orange-200 bg-orange-50/90 text-orange-700 hover:bg-orange-50' : 'border-slate-200 bg-white/90 text-slate-700 hover:bg-white'
          }`}
        >
          <FiHeart />
        </button>
      </div>
      <div className="p-4">
        <div className="text-[15px] font-semibold leading-snug tracking-tight text-slate-900">{property.title}</div>
        <div className="mt-1 text-sm font-medium text-slate-600">{property.location}</div>
        <div className="mt-2 text-lg font-bold tracking-tight text-slate-900">{property.price}</div>

        <div className="mt-3 flex flex-wrap gap-2">
          {!isPlot && (
            <>
              <StatPill icon={FiHome} value={`${property.beds} Beds`} />
              <StatPill icon={FiDroplet} value={`${property.baths} Baths`} />
            </>
          )}
          {isPlot && <StatPill icon={FiMap} value="Plot" />}
          <StatPill icon={FiMaximize2} value={property.area} />
        </div>

        <Link
          to={`/property/${property.id}`}
          onClick={(e) => e.stopPropagation()}
          className="mt-4 block w-full rounded-2xl bg-brand-900 px-4 py-3 text-center text-sm font-semibold text-white"
        >
          View Details
        </Link>
      </div>
    </motion.article>
  )
}

export default function Listings() {
  const [properties, setProperties] = useState(() => [])
  const [cityOptions, setCityOptions] = useState(() => [])
  const location = useLocation()
  const navigate = useNavigate()
  const { citySlug: citySlugParam } = useParams()
  const citySlug = useMemo(() => {
    if (typeof citySlugParam === 'string' && citySlugParam.trim().length > 0) return citySlugParam
    const match = /^\/properties-in-(.+)$/.exec(location.pathname)
    return match ? match[1] : undefined
  }, [citySlugParam, location.pathname])

  const [filters, setFilters] = useState(() => getFiltersFromUrl({ citySlug, search: location.search }))
  const [hasNextPage, setHasNextPage] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [isRentNoticeOpen, setIsRentNoticeOpen] = useState(false)

  useEffect(() => {
    let isMounted = true
    getProperties()
      .then((list) => {
        if (!isMounted) return
        const seen = new Set()
        const next = []
        for (const p of Array.isArray(list) ? list : []) {
          const city = getCityFromProperty(p)
          if (!city) continue
          const key = city.toLowerCase()
          if (seen.has(key)) continue
          seen.add(key)
          next.push(city)
        }
        next.sort((a, b) => a.localeCompare(b))
        setCityOptions(next)
      })
      .catch(() => {
        if (!isMounted) return
        setCityOptions([])
      })
    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    let isMounted = true
    const nextFilters = getFiltersFromUrl({ citySlug, search: location.search })
    Promise.resolve().then(() => {
      if (!isMounted) return
      setFilters(nextFilters)
      setIsFiltersOpen(hasMeaningfulFilter(nextFilters))
      setIsLoading(true)
      setError('')
      if (nextFilters.listingType === 'Rent') {
        const key = 'hp_rent_notice_shown'
        if (!sessionStorage.getItem(key)) {
          sessionStorage.setItem(key, '1')
          setIsRentNoticeOpen(true)
        }
      }
    })

    const { page, limit } = nextFilters
    const hasAnyFilter = hasMeaningfulFilter(nextFilters)
    const loader = hasAnyFilter
      ? searchProperties({
          ...parsePriceRangeToMinMax(nextFilters.priceRange),
          city: nextFilters.city,
          state: nextFilters.state,
          propertyType: nextFilters.propertyType,
          listingType: nextFilters.listingType,
          status: nextFilters.status,
          facing: nextFilters.facing,
          verified: nextFilters.verified,
          isFeatured: nextFilters.isFeatured,
          minArea: nextFilters.minArea,
          page,
          limit,
          sortBy: nextFilters.sortBy,
          sortOrder: nextFilters.sortOrder,
        })
      : getProperties()

    loader
      .then((list) => {
        if (!isMounted) return
        const normalized = list.map((p) => ({
          id: p.id,
          title: p.title,
          location: p.location,
          price: p.price,
          beds: p.beds,
          baths: p.baths,
          area: p.area,
          image: p.image || '',
          raw: p.raw,
        }))
        setProperties(normalized.length > 0 ? normalized : [])
        setHasNextPage(list.length === limit)
      })
      .catch(async (err) => {
        if (!isMounted) return
        if (!hasMeaningfulFilter(nextFilters)) {
          try {
            const list = await getProperties()
            if (!isMounted) return
            setProperties(
              list.map((p) => ({
                id: p.id,
                title: p.title,
                location: p.location,
                price: p.price,
                beds: p.beds,
                baths: p.baths,
                area: p.area,
                image: p.image || '',
                raw: p.raw,
              })),
            )
            setHasNextPage(false)
            return
          } catch {
            if (!isMounted) return
          }
        }
        setError(err?.message || 'Failed to load properties.')
        setProperties([])
        setHasNextPage(false)
      })
      .finally(() => {
        if (!isMounted) return
        setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [citySlug, location.search])

  useEffect(() => {
    const cleanCity = filters.city.trim()
    const heading = cleanCity ? `Properties in ${cleanCity} | Himanshi Properties` : 'Property Search | Himanshi Properties'
    const description = cleanCity
      ? `Browse verified properties in ${cleanCity}. Filter by budget, property type, and area, and contact Himanshi Properties for site visits and documentation support.`
      : 'Search and filter verified properties across India by city, budget, property type, and area. Explore listings and connect with Himanshi Properties.'

    const canonical = `${window.location.origin}${location.pathname}${location.search}`
    document.title = heading
    upsertCanonical(canonical)
    upsertMeta({ name: 'description' }, description)
    upsertMeta({ property: 'og:title' }, heading)
    upsertMeta({ property: 'og:description' }, description)
    upsertMeta({ property: 'og:url' }, canonical)
    upsertMeta({ name: 'twitter:title' }, heading)
    upsertMeta({ name: 'twitter:description' }, description)
  }, [filters.city, location.pathname, location.search])

  const onApply = () => {
    navigate(buildSearchUrl({ ...filters, page: DEFAULT_PAGE }))
    setIsFiltersOpen(false)
  }

  const onClear = () => {
    const next = buildDefaultFilters()
    setFilters(next)
    navigate(buildSearchUrl(next))
    setIsFiltersOpen(false)
  }

  const onChangeField = (key) => (e) => {
    const value = e?.target?.value ?? ''
    setFilters((cur) => ({ ...cur, [key]: value }))
  }

  const onChangeNumberField = (key) => (e) => {
    const value = e?.target?.value ?? ''
    const sanitized = String(value).replace(/[^\d.]/g, '')
    setFilters((cur) => ({ ...cur, [key]: sanitized }))
  }

  const onChangePage = (nextPage) => {
    const page = Math.max(1, nextPage)
    navigate(buildSearchUrl({ ...filters, page }))
  }

  const hasActiveSearch = hasMeaningfulFilter(filters)
  const headingCity = filters.city.trim()
  const heading = headingCity ? `Properties in ${headingCity}` : 'Property Search'

  return (
    <div className="min-h-screen bg-brand-50">
      <Navbar />
      {isRentNoticeOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 px-4 py-8">
          <div className="mx-auto w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-xl">
            <div className="p-6">
              <div className="text-lg font-extrabold tracking-tight text-slate-900">Rent listings notice</div>
              <div className="mt-2 text-sm font-semibold text-slate-600">
                Rent listings are currently available only for Bhopal.
              </div>
              <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setIsRentNoticeOpen(false)}
                  className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-extrabold text-slate-800"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsRentNoticeOpen(false)
                    navigate(buildSearchUrl({ ...filters, city: 'Bhopal', listingType: 'Rent', page: DEFAULT_PAGE }))
                  }}
                  className="rounded-2xl bg-brand-900 px-5 py-3 text-sm font-extrabold text-white"
                >
                  View Bhopal rentals
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <main className="py-10">
        <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">{heading}</div>
            <div className="mt-1 text-sm font-semibold text-slate-600">{properties.length} properties available</div>
          </div>
          <Link to="/properties/search" className="text-sm font-semibold text-slate-700 underline">
            All properties
          </Link>
        </div>

        {!!error && (
          <div className="mt-5 rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-semibold text-orange-800">
            {error}
          </div>
        )}

        <div className="mt-6 grid gap-6 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-4 xl:col-span-3">
            <div className="flex items-center justify-between gap-3 rounded-3xl border border-slate-200 bg-white p-4 sm:p-5 lg:hidden">
              <div className="text-sm font-extrabold text-slate-900">Filters</div>
              <div className="flex items-center gap-3">
                {hasActiveSearch && (
                  <button type="button" onClick={onClear} className="text-xs font-semibold text-slate-700 underline">
                    Clear
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsFiltersOpen((v) => !v)}
                  className="rounded-full border border-slate-900/10 bg-white px-3 py-1 text-xs font-semibold text-slate-800"
                >
                  {isFiltersOpen ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div className={`${isFiltersOpen ? 'mt-4 block' : 'hidden'} rounded-3xl border border-slate-200 bg-white p-4 sm:p-5 lg:mt-0 lg:block`}>
              <div className="hidden items-center justify-between gap-3 lg:flex">
              <div className="text-sm font-extrabold text-slate-900">Filters</div>
              {hasActiveSearch && (
                <button type="button" onClick={onClear} className="text-xs font-semibold text-slate-700 underline">
                  Clear
                </button>
              )}
            </div>

            <div className="mt-4 grid gap-3">
              <label className="grid gap-1">
                <div className="text-[11px] font-semibold text-slate-500">Price</div>
                <div className="relative">
                  <select
                    value={filters.priceRange}
                    onChange={onChangeField('priceRange')}
                    className="w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 py-2 pr-11 text-sm font-semibold text-slate-900 outline-none"
                  >
                    <option value="">Any</option>
                    <option value="0-5000000">Up to 50 Lakhs</option>
                    <option value="5000000-10000000">50 Lakhs - 1 Crore</option>
                    <option value="10000000-20000000">1 Crore - 2 Crore</option>
                    <option value="20000000-50000000">2 Crore - 5 Crore</option>
                    <option value="50000000-">5 Crore+</option>
                  </select>
                  <FiChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-base text-slate-600" />
                </div>
              </label>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="grid gap-1">
                  <div className="text-[11px] font-semibold text-slate-500">City</div>
                  <input
                    value={filters.city}
                    onChange={onChangeField('city')}
                    list="city-options"
                    placeholder="Delhi"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 outline-none"
                  />
                </label>
                <label className="grid gap-1">
                  <div className="text-[11px] font-semibold text-slate-500">State</div>
                  <input
                    value={filters.state}
                    onChange={onChangeField('state')}
                    placeholder="Karnataka"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </label>
              </div>

              <datalist id="city-options">
                {cityOptions.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="grid gap-1">
                  <div className="text-[11px] font-semibold text-slate-500">Area (sqft)</div>
                  <input
                    value={filters.minArea}
                    onChange={onChangeNumberField('minArea')}
                    inputMode="numeric"
                    placeholder="500"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="grid gap-1">
                  <div className="text-[11px] font-semibold text-slate-500">Property Type</div>
                  <div className="relative">
                    <select
                      value={filters.propertyType}
                      onChange={onChangeField('propertyType')}
                      className="w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 py-2 pr-11 text-sm font-semibold text-slate-900 outline-none"
                    >
                      <option value="">Any</option>
                      <option value="Apartment">Apartment</option>
                      <option value="Villa">Villa</option>
                      <option value="Farmhouse">Farmhouse</option>
                      <option value="Plot">Plot</option>
                      <option value="Land">Land</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Office">Office</option>
                    </select>
                    <FiChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-base text-slate-600" />
                  </div>
                </label>
                <label className="grid gap-1">
                  <div className="text-[11px] font-semibold text-slate-500">Listing Type</div>
                  <div className="relative">
                    <select
                      value={filters.listingType}
                      onChange={onChangeField('listingType')}
                      className="w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 py-2 pr-11 text-sm font-semibold text-slate-900 outline-none"
                    >
                      <option value="">Any</option>
                      <option value="Sale">Sale</option>
                      <option value="Rent">Rent</option>
                      <option value="Lease">Lease</option>
                    </select>
                    <FiChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-base text-slate-600" />
                  </div>
                </label>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="grid gap-1">
                  <div className="text-[11px] font-semibold text-slate-500">Status</div>
                  <div className="relative">
                    <select
                      value={filters.status}
                      onChange={onChangeField('status')}
                      className="w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 py-2 pr-11 text-sm font-semibold text-slate-900 outline-none"
                    >
                      <option value="">Any</option>
                      <option value="Available">Available</option>
                      <option value="Booked">Booked</option>
                      <option value="Sold">Sold</option>
                      <option value="Under Construction">Under Construction</option>
                    </select>
                    <FiChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-base text-slate-600" />
                  </div>
                </label>
                <label className="grid gap-1">
                  <div className="text-[11px] font-semibold text-slate-500">Facing</div>
                  <div className="relative">
                    <select
                      value={filters.facing}
                      onChange={onChangeField('facing')}
                      className="w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 py-2 pr-11 text-sm font-semibold text-slate-900 outline-none"
                    >
                      <option value="">Any</option>
                      <option value="North">North</option>
                      <option value="South">South</option>
                      <option value="East">East</option>
                      <option value="West">West</option>
                      <option value="North-East">North-East</option>
                      <option value="North-West">North-West</option>
                      <option value="South-East">South-East</option>
                      <option value="South-West">South-West</option>
                    </select>
                    <FiChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-base text-slate-600" />
                  </div>
                </label>
              </div>

              <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={filters.verified === 'true'}
                    onChange={(e) => setFilters((cur) => ({ ...cur, verified: e.target.checked ? 'true' : '' }))}
                    className="h-4 w-4 rounded border-slate-300"
                  />
                  Verified
                </label>
                <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={filters.isFeatured === 'true'}
                    onChange={(e) => setFilters((cur) => ({ ...cur, isFeatured: e.target.checked ? 'true' : '' }))}
                    className="h-4 w-4 rounded border-slate-300"
                  />
                  Featured
                </label>
              </div>
            </div>

            <button
              type="button"
              onClick={onApply}
              disabled={isLoading}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-900 px-5 py-3 text-sm font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FiSearch className="text-lg" />
              Apply filters
            </button>
          </div>
          </div>

          <div className="lg:col-span-8 xl:col-span-9">
            <div className="flex items-center justify-between gap-4">
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600">
                <FiMapPin />
                <span>{headingCity ? headingCity : 'India'}</span>
              </div>
              {!!hasActiveSearch && (
                <div className="text-xs font-semibold text-slate-600">
                  Page {filters.page}
                </div>
              )}
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
              {properties.map((p, idx) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.35, delay: idx * 0.03 }}
                >
                  <ListingCard property={p} />
                </motion.div>
              ))}
            </div>

            {!isLoading && properties.length === 0 && (
              <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6">
                <div className="text-base font-extrabold text-slate-900">No properties found</div>
                <div className="mt-2 text-sm font-semibold text-slate-600">
                  {hasActiveSearch ? 'Try changing filters to see more results.' : 'No properties are available yet.'}
                </div>
                {hasActiveSearch && (
                  <button
                    type="button"
                    onClick={onClear}
                    className="mt-4 inline-flex rounded-2xl bg-brand-900 px-5 py-3 text-sm font-extrabold text-white"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )}

            {hasActiveSearch && properties.length > 0 && (
              <div className="mt-8 flex items-center justify-center gap-3">
                <button
                  type="button"
                  disabled={isLoading || filters.page <= 1}
                  onClick={() => onChangePage(filters.page - 1)}
                  className="rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Prev
                </button>
                <div className="text-sm font-semibold text-slate-600">Page {filters.page}</div>
                <button
                  type="button"
                  disabled={isLoading || !hasNextPage}
                  onClick={() => onChangePage(filters.page + 1)}
                  className="rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
        </Container>
      </main>
      <FooterSection />
    </div>
  )
}
