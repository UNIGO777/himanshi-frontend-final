import { motion } from 'framer-motion'
import { useRef, useState } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import Container from './Container'

const svgToDataUri = (svg) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`

function slugifySegment(value) {
  const raw = typeof value === 'string' ? value.trim().toLowerCase() : ''
  if (!raw) return ''
  return raw
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

const ICONS_DARK = {
  apartment:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" fill="none" stroke="#0f172a" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="5" width="16" height="18" rx="2"/><path d="M9 10h10M9 14h10M9 18h10M13 7v14M17 7v14"/></svg>',
  villa:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" fill="none" stroke="#0f172a" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 11l8-6 8 6"/><rect x="8" y="11" width="12" height="10" rx="2"/><path d="M14 15v6"/></svg>',
  farmhouse:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" fill="none" stroke="#0f172a" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 13l8-6 8 6"/><path d="M8 12v10h12V12"/><path d="M13 22v-6h2v6"/><path d="M22 22c-3 0-4-1.2-4-3s1-3 4-3"/><path d="M18 18h3"/></svg>',
  studio:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" fill="none" stroke="#0f172a" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="8" width="14" height="12" rx="2"/><path d="M14 12a3 3 0 013 3v5M14 12a3 3 0 00-3 3v5"/></svg>',
  office:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" fill="none" stroke="#0f172a" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="5" width="10" height="18" rx="1.5"/><path d="M11 9h6M11 13h6M11 17h6"/></svg>',
  townhouse:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" fill="none" stroke="#0f172a" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 12l4-3 4 3M14 12l4-3 4 3"/><rect x="5" y="12" width="8" height="8" rx="1.5"/><rect x="15" y="12" width="8" height="8" rx="1.5"/><path d="M9 16v4M19 16v4"/></svg>',
  commercial:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" fill="none" stroke="#0f172a" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="10" width="16" height="8" rx="2"/><path d="M6 10h16M9 18v4M19 18v4"/></svg>',
  agriculture:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" fill="none" stroke="#0f172a" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 23V13"/><path d="M14 13c-5 0-7-4-7-8 4 0 8 2 8 7"/><path d="M14 13c5 0 7-4 7-8-4 0-8 2-8 7"/><path d="M9 23h10"/></svg>',
}

const ICONS_LIGHT = {
  apartment: ICONS_DARK.apartment.replaceAll('#0f172a', '#ffffff'),
  villa: ICONS_DARK.villa.replaceAll('#0f172a', '#ffffff'),
  farmhouse: ICONS_DARK.farmhouse.replaceAll('#0f172a', '#ffffff'),
  studio: ICONS_DARK.studio.replaceAll('#0f172a', '#ffffff'),
  office: ICONS_DARK.office.replaceAll('#0f172a', '#ffffff'),
  townhouse: ICONS_DARK.townhouse.replaceAll('#0f172a', '#ffffff'),
  commercial: ICONS_DARK.commercial.replaceAll('#0f172a', '#ffffff'),
  agriculture: ICONS_DARK.agriculture.replaceAll('#0f172a', '#ffffff'),
}

const quick = [
  { label: 'Buy', kind: 'apartment', meta: 'Browse' },
  { label: 'Agriculture', kind: 'agriculture', meta: 'Browse' },
  { label: 'Commercial', kind: 'commercial', meta: 'Browse' },
  { label: 'Rent', kind: 'villa', meta: 'Browse' },
  { label: 'Resale', kind: 'studio', meta: 'Browse' },
  { label: 'Near Me', kind: 'townhouse', meta: 'Browse' },
  { label: 'Farmhouse', kind: 'farmhouse', meta: 'Browse' },
]

const cities = [
  {
    name: 'Mumbai',
    image:
      'https://images.unsplash.com/photo-1595658658481-d53d3f999875?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Delhi',
    image:
      'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Pune',
    image:
      'https://images.unsplash.com/photo-1553064483-f10fe837615f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHB1bmV8ZW58MHx8MHx8fDA%3D',
  },
  {
    name: 'Bangalore',
    image:
      'https://media.istockphoto.com/id/1382384282/photo/bangalore-or-bengaluru.webp?a=1&b=1&s=612x612&w=0&k=20&c=j9jKtYxzHAHjodEQYuVPvQKPAlXvjCzx_TvqLh6BmKM=',
  },
  {
    name: 'Jaipur',
    image:
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Noida',
    image:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  },
]

export default function TrySearchCitiesSection() {
  const quickTrackRef = useRef(null)
  const citiesTrackRef = useRef(null)
  const [activeQuickIndex, setActiveQuickIndex] = useState(null)
  const navigate = useNavigate()

  const getScrollStep = (ref, selector, fallback) => {
    const el = ref.current
    if (!el) return fallback
    const card = el.querySelector(selector)
    if (!card) return fallback
    const styles = window.getComputedStyle(el)
    const rawGap = styles.columnGap || styles.gap || '0px'
    const gap = Number.parseFloat(rawGap) || 0
    const cardWidth = card.getBoundingClientRect().width
    return cardWidth + gap
  }

  const scrollQuick = (direction) => {
    const el = quickTrackRef.current
    if (!el) return
    el.scrollBy({ left: direction * getScrollStep(quickTrackRef, '[data-quick-card="true"]', 280), behavior: 'smooth' })
  }

  const scrollCities = (direction) => {
    const el = citiesTrackRef.current
    if (!el) return
    el.scrollBy({ left: direction * getScrollStep(citiesTrackRef, '[data-city-card="true"]', 340), behavior: 'smooth' })
  }

  return (
    <section className="py-10">
      <Container>
      <div className="flex flex-col gap-10">
        <div>
          <div className="flex items-end justify-between gap-6">
            <div>
              <div className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">Try searching for</div>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                Quick filters
              </h2>
            </div>
          </div>

          <div className="relative mt-5">
            <button
              type="button"
              onClick={() => scrollQuick(-1)}
              aria-label="Scroll left"
              className="absolute left-0 top-1/2 z-10 hidden h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-slate-900/10 bg-white/80 text-slate-800 shadow-sm backdrop-blur transition-colors hover:bg-white sm:grid"
            >
              <FiChevronLeft />
            </button>
            <button
              type="button"
              onClick={() => scrollQuick(1)}
              aria-label="Scroll right"
              className="absolute right-0 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 translate-x-1/2 place-items-center rounded-full border border-slate-900/10 bg-white/80 text-slate-800 shadow-sm backdrop-blur transition-colors hover:bg-white sm:grid"
            >
              <FiChevronRight />
            </button>
            <div ref={quickTrackRef} className="flex snap-x snap-mandatory gap-3 overflow-x-auto overflow-y-hidden scroll-smooth pb-2">
              {quick.map((item, idx) => {
                const isActive = idx === activeQuickIndex
                const iconSvg = isActive ? ICONS_LIGHT[item.kind] : ICONS_DARK[item.kind]
                return (
                  <motion.button
                    key={item.label}
                    type="button"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.35 }}
                    transition={{ duration: 0.35, delay: idx * 0.04 }}
                    onClick={() => {
                      setActiveQuickIndex(idx)
                      const params = new URLSearchParams()
                      if (item.label === 'Buy') params.set('listingType', 'Sale')
                      else if (item.label === 'Agriculture') {
                        params.set('listingType', 'Sale')
                        params.set('propertyType', 'Land')
                      } else if (item.label === 'Commercial') params.set('propertyType', 'Commercial')
                      else if (item.label === 'Rent') params.set('listingType', 'Rent')
                      else if (item.label === 'Resale') {
                        params.set('listingType', 'Sale')
                        params.set('status', 'Available')
                      } else if (item.label === 'Near Me') {
                        params.set('city', 'Bhopal')
                      } else if (item.label === 'Farmhouse') params.set('propertyType', 'Farmhouse')
                      navigate({ pathname: '/properties/search', search: `?${params.toString()}` })
                    }}
                    data-quick-card="true"
                    className={`snap-start rounded-3xl border px-6 py-6 text-center transition-colors hover:border-slate-200 hover:shadow-sm ${
                      isActive
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-900/10 bg-white text-slate-900 hover:bg-slate-100'
                    } shrink-0 w-[210px] sm:w-[240px] lg:w-[19.3%] lg:min-w-0`}
                  >
                    <div className={`mx-auto grid h-14 w-14 place-items-center rounded-3xl ${isActive ? 'bg-white/10' : 'bg-slate-900/5'}`}>
                      <img alt="" className="h-8 w-8" src={svgToDataUri(iconSvg)} aria-hidden="true" />
                    </div>
                    <div className={`mt-4 text-sm font-extrabold ${isActive ? 'text-white' : 'text-slate-900'}`}>
                      {item.label}
                    </div>
                    <div className={`mt-1 text-xs font-semibold ${isActive ? 'text-white/80' : 'text-slate-500'}`}>
                      {item.meta}
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-end justify-between gap-6">
            <div>
              <div className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">Cities</div>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                Explore top locations
              </h2>
            </div>
          </div>

          <div className="relative mt-5">
            <button
              type="button"
              onClick={() => scrollCities(-1)}
              aria-label="Scroll left"
              className="absolute left-0 top-1/2 z-10 hidden h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-slate-900/10 bg-white/80 text-slate-800 shadow-sm backdrop-blur transition-colors hover:bg-white sm:grid"
            >
              <FiChevronLeft />
            </button>
            <button
              type="button"
              onClick={() => scrollCities(1)}
              aria-label="Scroll right"
              className="absolute right-0 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 translate-x-1/2 place-items-center rounded-full border border-slate-900/10 bg-white/80 text-slate-800 shadow-sm backdrop-blur transition-colors hover:bg-white sm:grid"
            >
              <FiChevronRight />
            </button>
            <div ref={citiesTrackRef} className="flex snap-x snap-mandatory gap-3 overflow-x-auto overflow-y-hidden scroll-smooth pb-2">
              {cities.map((c, idx) => (
                <motion.button
                  key={c.name}
                  type="button"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 0.35, delay: idx * 0.04 }}
                  data-city-card="true"
                  onClick={() => {
                    const params = new URLSearchParams()
                    params.set('city', c.name)
                    navigate({ pathname: `/properties-in-${slugifySegment(c.name)}`, search: `?${params.toString()}` })
                  }}
                  className="snap-start relative shrink-0 w-[240px] overflow-hidden rounded-3xl border border-slate-900/10 bg-white/70 transition-shadow hover:shadow-sm sm:w-[300px] lg:w-[19.3%] lg:min-w-0"
                >
                  <img
                    src={c.image}
                    alt={c.name}
                    className="h-40 w-full object-cover sm:h-44"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-left">
                    <div className="text-base font-extrabold text-white">{c.name}</div>
                    <div className="mt-1 text-[11px] font-semibold text-white/80">Browse listings</div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
      </Container>
    </section>
  )
}
