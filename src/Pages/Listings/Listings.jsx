import { motion } from 'framer-motion'
import { FiDroplet, FiHeart, FiHome, FiMap, FiMapPin, FiMaximize2, FiSearch } from 'react-icons/fi'
import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import Navbar from '../../Components/Navbar'
import FooterSection from '../../Components/FooterSection'
import Container from '../../Components/Container'
import useWishlist from '../../hooks/useWishlist'
import { getProperties, searchProperties } from '../../api/properties'

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
    q: '',
    city: '',
    state: '',
    pincode: '',
    propertyType: '',
    listingType: '',
    status: '',
    furnishedStatus: '',
    listedBy: '',
    facing: '',
    verified: '',
    isFeatured: '',
    minPrice: '',
    maxPrice: '',
    minArea: '',
    maxArea: '',
    minBedrooms: '',
    minBathrooms: '',
    amenities: '',
    page: DEFAULT_PAGE,
    limit: DEFAULT_LIMIT,
    sortBy: DEFAULT_SORT_BY,
    sortOrder: DEFAULT_SORT_ORDER,
    ...overrides,
  }
}

function getFiltersFromUrl({ citySlug, search }) {
  const params = new URLSearchParams(search)
  const q = (params.get('q') || params.get('keyword') || '').trim()
  const cityFromQuery = (params.get('city') || '').trim()
  const cityFromSlug = deslugifySegment(citySlug)
  const city = cityFromQuery || cityFromSlug
  const priceRange = (params.get('priceRange') || '').trim()
  const rangeMinMax = parsePriceRangeToMinMax(priceRange)

  return buildDefaultFilters({
    q,
    city,
    state: (params.get('state') || '').trim(),
    pincode: (params.get('pincode') || '').trim(),
    propertyType: (params.get('propertyType') || '').trim(),
    listingType: (params.get('listingType') || '').trim(),
    status: (params.get('status') || '').trim(),
    furnishedStatus: (params.get('furnishedStatus') || '').trim(),
    listedBy: (params.get('listedBy') || '').trim(),
    facing: (params.get('facing') || '').trim(),
    verified: (params.get('verified') || '').trim(),
    isFeatured: (params.get('isFeatured') || '').trim(),
    minPrice: (params.get('minPrice') || rangeMinMax.minPrice || '').trim(),
    maxPrice: (params.get('maxPrice') || rangeMinMax.maxPrice || '').trim(),
    minArea: (params.get('minArea') || '').trim(),
    maxArea: (params.get('maxArea') || '').trim(),
    minBedrooms: (params.get('minBedrooms') || '').trim(),
    minBathrooms: (params.get('minBathrooms') || '').trim(),
    amenities: (params.get('amenities') || '').trim(),
    page: clampInt(params.get('page'), { min: 1, max: Number.POSITIVE_INFINITY, fallback: DEFAULT_PAGE }),
    limit: clampInt(params.get('limit'), { min: 1, max: MAX_LIMIT, fallback: DEFAULT_LIMIT }),
    sortBy: (params.get('sortBy') || DEFAULT_SORT_BY).trim(),
    sortOrder: (params.get('sortOrder') || DEFAULT_SORT_ORDER).trim(),
  })
}

function hasMeaningfulFilter(filters) {
  const keys = [
    'q',
    'city',
    'state',
    'pincode',
    'propertyType',
    'listingType',
    'status',
    'furnishedStatus',
    'listedBy',
    'facing',
    'verified',
    'isFeatured',
    'minPrice',
    'maxPrice',
    'minArea',
    'maxArea',
    'minBedrooms',
    'minBathrooms',
    'amenities',
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

  setIf('q', next.q)
  setIf('city', cleanCity)
  setIf('state', next.state)
  setIf('pincode', next.pincode)
  setIf('propertyType', next.propertyType)
  setIf('listingType', next.listingType)
  setIf('status', next.status)
  setIf('furnishedStatus', next.furnishedStatus)
  setIf('listedBy', next.listedBy)
  setIf('facing', next.facing)
  setIf('verified', next.verified)
  setIf('isFeatured', next.isFeatured)
  setIf('minPrice', next.minPrice)
  setIf('maxPrice', next.maxPrice)
  setIf('minArea', next.minArea)
  setIf('maxArea', next.maxArea)
  setIf('minBedrooms', next.minBedrooms)
  setIf('minBathrooms', next.minBathrooms)
  setIf('amenities', next.amenities)

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
            isSaved ? 'border-rose-200 bg-rose-50/90 text-rose-600 hover:bg-rose-50' : 'border-slate-200 bg-white/90 text-slate-700 hover:bg-white'
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
          className="mt-4 block w-full rounded-2xl bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white"
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
    })

    const { page, limit } = nextFilters
    const hasAnyFilter = hasMeaningfulFilter(nextFilters)
    const loader = hasAnyFilter
      ? searchProperties({
          q: nextFilters.q,
          city: nextFilters.city,
          state: nextFilters.state,
          pincode: nextFilters.pincode,
          propertyType: nextFilters.propertyType,
          listingType: nextFilters.listingType,
          status: nextFilters.status,
          furnishedStatus: nextFilters.furnishedStatus,
          listedBy: nextFilters.listedBy,
          facing: nextFilters.facing,
          verified: nextFilters.verified,
          isFeatured: nextFilters.isFeatured,
          minPrice: nextFilters.minPrice,
          maxPrice: nextFilters.maxPrice,
          minArea: nextFilters.minArea,
          maxArea: nextFilters.maxArea,
          minBedrooms: nextFilters.minBedrooms,
          minBathrooms: nextFilters.minBathrooms,
          amenities: nextFilters.amenities,
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
    const heading = cleanCity ? `Properties in ${cleanCity}` : 'Property Search'
    document.title = filters.q.trim() ? `${filters.q.trim()} • ${heading}` : heading
  }, [filters.city, filters.q])

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
    <div className="min-h-screen bg-white">
      <Navbar />
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
          <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
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
                <div className="text-[11px] font-semibold text-slate-500">Search</div>
                <input
                  value={filters.q}
                  onChange={onChangeField('q')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') onApply()
                  }}
                  placeholder="Title, description, address, owner..."
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400"
                />
              </label>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="grid gap-1">
                  <div className="text-[11px] font-semibold text-slate-500">City</div>
                  <select
                    value={filters.city}
                    onChange={onChangeField('city')}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 outline-none"
                  >
                    <option value="">All cities</option>
                    {!!filters.city && !cityOptions.some((c) => c.toLowerCase() === filters.city.trim().toLowerCase()) && (
                      <option value={filters.city}>{filters.city}</option>
                    )}
                    {cityOptions.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
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

              <label className="grid gap-1">
                <div className="text-[11px] font-semibold text-slate-500">Pincode</div>
                <input
                  value={filters.pincode}
                  onChange={onChangeField('pincode')}
                  inputMode="numeric"
                  placeholder="560001"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400"
                />
              </label>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="grid gap-1">
                  <div className="text-[11px] font-semibold text-slate-500">Property Type</div>
                  <select
                    value={filters.propertyType}
                    onChange={onChangeField('propertyType')}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 outline-none"
                  >
                    <option value="">Any</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Villa">Villa</option>
                    <option value="Plot">Plot</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Office">Office</option>
                  </select>
                </label>
                <label className="grid gap-1">
                  <div className="text-[11px] font-semibold text-slate-500">Listing Type</div>
                  <select
                    value={filters.listingType}
                    onChange={onChangeField('listingType')}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 outline-none"
                  >
                    <option value="">Any</option>
                    <option value="Sale">Sale</option>
                    <option value="Rent">Rent</option>
                    <option value="Lease">Lease</option>
                  </select>
                </label>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="grid gap-1">
                  <div className="text-[11px] font-semibold text-slate-500">Status</div>
                  <select
                    value={filters.status}
                    onChange={onChangeField('status')}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 outline-none"
                  >
                    <option value="">Any</option>
                    <option value="Available">Available</option>
                    <option value="Sold">Sold</option>
                    <option value="Under Construction">Under Construction</option>
                  </select>
                </label>
                <label className="grid gap-1">
                  <div className="text-[11px] font-semibold text-slate-500">Furnished</div>
                  <select
                    value={filters.furnishedStatus}
                    onChange={onChangeField('furnishedStatus')}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 outline-none"
                  >
                    <option value="">Any</option>
                    <option value="Furnished">Furnished</option>
                    <option value="Semi-furnished">Semi-furnished</option>
                    <option value="Unfurnished">Unfurnished</option>
                  </select>
                </label>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="grid gap-1">
                  <div className="text-[11px] font-semibold text-slate-500">Listed By</div>
                  <select
                    value={filters.listedBy}
                    onChange={onChangeField('listedBy')}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 outline-none"
                  >
                    <option value="">Any</option>
                    <option value="Owner">Owner</option>
                    <option value="Agent">Agent</option>
                    <option value="Builder">Builder</option>
                  </select>
                </label>
                <label className="grid gap-1">
                  <div className="text-[11px] font-semibold text-slate-500">Facing</div>
                  <select
                    value={filters.facing}
                    onChange={onChangeField('facing')}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 outline-none"
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
                </label>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="grid gap-1">
                  <div className="text-[11px] font-semibold text-slate-500">Verified</div>
                  <select
                    value={filters.verified}
                    onChange={onChangeField('verified')}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 outline-none"
                  >
                    <option value="">Any</option>
                    <option value="true">Verified</option>
                    <option value="false">Not verified</option>
                  </select>
                </label>
                <label className="grid gap-1">
                  <div className="text-[11px] font-semibold text-slate-500">Featured</div>
                  <select
                    value={filters.isFeatured}
                    onChange={onChangeField('isFeatured')}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 outline-none"
                  >
                    <option value="">Any</option>
                    <option value="true">Featured</option>
                    <option value="false">Not featured</option>
                  </select>
                </label>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="grid gap-1">
                  <div className="text-[11px] font-semibold text-slate-500">Min Price</div>
                  <input
                    value={filters.minPrice}
                    onChange={onChangeNumberField('minPrice')}
                    inputMode="numeric"
                    placeholder="5000000"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </label>
                <label className="grid gap-1">
                  <div className="text-[11px] font-semibold text-slate-500">Max Price</div>
                  <input
                    value={filters.maxPrice}
                    onChange={onChangeNumberField('maxPrice')}
                    inputMode="numeric"
                    placeholder="20000000"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="grid gap-1">
                  <div className="text-[11px] font-semibold text-slate-500">Min Area</div>
                  <input
                    value={filters.minArea}
                    onChange={onChangeNumberField('minArea')}
                    inputMode="numeric"
                    placeholder="900"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </label>
                <label className="grid gap-1">
                  <div className="text-[11px] font-semibold text-slate-500">Max Area</div>
                  <input
                    value={filters.maxArea}
                    onChange={onChangeNumberField('maxArea')}
                    inputMode="numeric"
                    placeholder="2000"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="grid gap-1">
                  <div className="text-[11px] font-semibold text-slate-500">Min Bedrooms</div>
                  <input
                    value={filters.minBedrooms}
                    onChange={onChangeNumberField('minBedrooms')}
                    inputMode="numeric"
                    placeholder="2"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </label>
                <label className="grid gap-1">
                  <div className="text-[11px] font-semibold text-slate-500">Min Bathrooms</div>
                  <input
                    value={filters.minBathrooms}
                    onChange={onChangeNumberField('minBathrooms')}
                    inputMode="numeric"
                    placeholder="2"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </label>
              </div>

              <label className="grid gap-1">
                <div className="text-[11px] font-semibold text-slate-500">Amenities</div>
                <input
                  value={filters.amenities}
                  onChange={onChangeField('amenities')}
                  placeholder="Parking,Lift,Gym"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400"
                />
              </label>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="grid gap-1">
                  <div className="text-[11px] font-semibold text-slate-500">Sort By</div>
                  <select
                    value={filters.sortBy}
                    onChange={onChangeField('sortBy')}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 outline-none"
                  >
                    <option value="createdAt">Newest</option>
                    <option value="price">Price</option>
                    <option value="area">Area</option>
                    <option value="views">Views</option>
                  </select>
                </label>
                <label className="grid gap-1">
                  <div className="text-[11px] font-semibold text-slate-500">Order</div>
                  <select
                    value={filters.sortOrder}
                    onChange={onChangeField('sortOrder')}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 outline-none"
                  >
                    <option value="desc">Desc</option>
                    <option value="asc">Asc</option>
                  </select>
                </label>
              </div>

              <label className="grid gap-1">
                <div className="text-[11px] font-semibold text-slate-500">Results per page</div>
                <select
                  value={filters.limit}
                  onChange={(e) => {
                    const nextLimit = clampInt(e.target.value, { min: 1, max: MAX_LIMIT, fallback: DEFAULT_LIMIT })
                    setFilters((cur) => ({ ...cur, limit: nextLimit }))
                  }}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 outline-none"
                >
                  <option value={20}>20</option>
                  <option value={40}>40</option>
                  <option value={60}>60</option>
                  <option value={100}>100</option>
                </select>
              </label>
            </div>

            <button
              type="button"
              onClick={onApply}
              disabled={isLoading}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-60"
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
                    className="mt-4 inline-flex rounded-2xl bg-slate-900 px-5 py-3 text-sm font-extrabold text-white"
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
