import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { FiMapPin, FiSearch } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { getProperties } from '../api/properties'
import sunrise from '../assets/photo-1707497009301-78bed8b1a51d.avif'
import Container from './Container'

function slugifySegment(value) {
  const raw = typeof value === 'string' ? value.trim().toLowerCase() : ''
  if (!raw) return ''
  return raw
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
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

export default function HeroSection() {
  const [city, setCity] = useState('')
  const [cities, setCities] = useState([])
  const [keyword, setKeyword] = useState('')
  const [priceRange, setPriceRange] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    let isMounted = true
    getProperties()
      .then((list) => {
        if (!isMounted) return
        const seen = new Set()
        const next = []
        for (const p of Array.isArray(list) ? list : []) {
          const name = getCityFromProperty(p)
          if (!name) continue
          const key = name.toLowerCase()
          if (seen.has(key)) continue
          seen.add(key)
          next.push(name)
        }
        next.sort((a, b) => a.localeCompare(b))
        setCities(next)
      })
      .catch(() => {
        if (!isMounted) return
        setCities([])
      })
    return () => {
      isMounted = false
    }
  }, [])

  const onSearch = () => {
    const cleanCity = city.trim()
    const cleanKeyword = keyword.trim()
    const params = new URLSearchParams()
    if (cleanKeyword) params.set('q', cleanKeyword)
    if (cleanCity) params.set('city', cleanCity)
    if (priceRange) {
      const { minPrice, maxPrice } = parsePriceRangeToMinMax(priceRange)
      if (minPrice) params.set('minPrice', minPrice)
      if (maxPrice) params.set('maxPrice', maxPrice)
    }
    const qs = params.toString()
    const pathname = cleanCity ? `/properties-in-${slugifySegment(cleanCity)}` : '/properties/search'
    navigate({ pathname, search: qs ? `?${qs}` : '' })
  }

  return (
    <section className="relative overflow-hidden bg-brand-50">
      <div className="pointer-events-none absolute inset-0">
        <span className="absolute left-[6%] top-[22%] text-2xl font-light text-slate-900/25">
          +
        </span>
        <span className="absolute right-[10%] top-[16%] text-2xl font-light text-slate-900/25">
          +
        </span>
        <span className="absolute left-[16%] top-[54%] text-2xl font-light text-slate-900/20">
          +
        </span>
        <span className="absolute right-[22%] top-[52%] text-2xl font-light text-slate-900/20">
          +
        </span>
      </div>

      <Container className="relative pb-64 pt-14 sm:pb-72 sm:pt-20 lg:pb-80">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-900/10 bg-white/70 px-4 py-2 text-xs font-semibold text-slate-800 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-brand-500" />
            Top-notch real estate platform
          </div>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
            Turning Real Estate Dreams into Realities!
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-700 sm:text-base">
            Look and book the perfect agricultural and residential properties across Bhopal with Himanshi Properties.
          </p>
        </motion.div>

        <div className="mx-auto mt-10 max-w-5xl">
          <div className="flex flex-col gap-3 rounded-3xl border border-slate-900/10 bg-white/85 p-3 backdrop-blur sm:flex-row sm:items-stretch sm:gap-0 sm:p-2">
            <div className="flex min-w-0 items-center gap-3 rounded-2xl bg-white px-4 py-3 sm:flex-1 sm:rounded-[22px]">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-100 text-slate-900">
                <FiMapPin className="text-lg" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-semibold text-black">Location</div>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="mt-0.5 w-full bg-transparent text-sm font-semibold text-slate-900 outline-none"
                >
                  <option value="">All cities</option>
                  {cities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="hidden w-px bg-brand-900/10 sm:block" />

            <div className="flex min-w-0 items-center gap-3 rounded-2xl bg-white px-4 py-3 sm:flex-1 sm:rounded-[22px]">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-100 text-slate-900">
                <FiSearch className="text-lg" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-semibold text-black">Keyword</div>
                <input
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') onSearch()
                  }}
                  placeholder="Search by keyword"
                  className="mt-0.5 w-full bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder:text-black"
                />
              </div>
            </div>

            <div className="hidden w-px bg-brand-900/10 sm:block" />

            <div className="flex min-w-0 items-center gap-3 rounded-2xl bg-white px-4 py-3 sm:flex-1 sm:rounded-[22px]">
              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-semibold text-black">Price Range</div>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="mt-0.5 w-full bg-transparent text-sm font-semibold text-slate-900 outline-none"
                >
                  <option value="">Any</option>
                  <option value="0-5000000">Under ₹50 Lakh</option>
                  <option value="5000000-10000000">₹50 Lakh - ₹1 Cr</option>
                  <option value="10000000-20000000">₹1 Cr - ₹2 Cr</option>
                  <option value="20000000-">Above ₹2 Cr</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end sm:pl-2">
              <button
                type="button"
                aria-label="Search"
                onClick={onSearch}
                className="grid h-12 w-full place-items-center rounded-2xl bg-brand-900 text-white sm:w-12 sm:rounded-full"
              >
                <FiSearch className="text-lg" />
              </button>
            </div>

          </div>
        </div>
      </Container>

      <div className="absolute inset-x-0 bottom-0 h-56 sm:h-72 lg:h-80">
        <img
          className="h-full w-full object-cover"
          src={sunrise}
          alt="Sunrise"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 via-transparent to-brand-50" />
      </div>
    </section>
  )
}
