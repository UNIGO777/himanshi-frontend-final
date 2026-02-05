import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import Container from './Container'
import { SellPropertyModalTrigger } from './SellPropertyModal'

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
  {
    label: 'Agriculture',
    kind: 'agriculture',
    meta: 'Browse',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80',
  },
  {
    label: 'Commercial',
    kind: 'commercial',
    meta: 'Browse',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
  },
  {
    label: 'Rent',
    kind: 'office',
    meta: 'Browse',
    image: 'https://images.unsplash.com/photo-1565402170291-8491f14678db?auto=format&fit=crop&w=1600&q=80',
  },
  {
    label: 'Farmhouse',
    kind: 'farmhouse',
    meta: 'Browse',
    image: 'https://i.pinimg.com/1200x/9d/03/d7/9d03d7fee1a18c4947d563c10f12246d.jpg',
  },
  {
    label: 'Buy',
    kind: 'apartment',
    meta: 'Browse',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
  },
  {
    label: 'Residential',
    kind: 'apartment',
    meta: 'Browse',
    image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1600&q=80',
  },
  {
    label: 'Sell',
    kind: 'villa',
    meta: 'Enquire',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1600&q=80',
  },
  {
    label: 'Resale',
    kind: 'studio',
    meta: 'Browse',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1600&q=80',
  },
  {
    label: 'Near Me',
    kind: 'townhouse',
    meta: 'Browse',
    image: 'https://images.unsplash.com/photo-1496568816309-51d7c20e3b21?auto=format&fit=crop&w=1600&q=80',
  },
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
      'https://images.unsplash.com/photo-1591898194689-9fad783aa6b6?ixlib=rb-4.1.0&q=85&fm=jpg&crop=entropy&cs=srgb&dl=dhruv-maniyar-JoiL5k0xtGQ-unsplash.jpg',
  },
  {
    name: 'Bangalore',
    image:
      'https://images.unsplash.com/photo-1585659726474-c8ad9ebc9f98?ixlib=rb-4.1.0&q=85&fm=jpg&crop=entropy&cs=srgb&dl=akshat-agrawal-tQ2XUxG9268-unsplash.jpg',
  },
  {
    name: 'Jaipur',
    image:
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Noida',
    image:
      'https://images.unsplash.com/photo-1648455288365-ee27a61c95bd?ixlib=rb-4.1.0&q=85&fm=jpg&crop=entropy&cs=srgb&dl=shivansh-singh-kR7hIRO0vVc-unsplash.jpg',
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

  useEffect(() => {
    if (typeof window === 'undefined') return
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const isMobile = () => (window.matchMedia ? window.matchMedia('(max-width: 639px)').matches : window.innerWidth < 640)

    const pauseUntilRef = { current: 0 }
    const pause = () => {
      pauseUntilRef.current = Date.now() + 4500
    }

    const quickEl = quickTrackRef.current
    const citiesEl = citiesTrackRef.current

    const addPauseListeners = (el) => {
      if (!el) return () => {}
      const opts = { passive: true }
      el.addEventListener('touchstart', pause, opts)
      el.addEventListener('pointerdown', pause, opts)
      el.addEventListener('wheel', pause, opts)
      return () => {
        el.removeEventListener('touchstart', pause, opts)
        el.removeEventListener('pointerdown', pause, opts)
        el.removeEventListener('wheel', pause, opts)
      }
    }

    const removeQuick = addPauseListeners(quickEl)
    const removeCities = addPauseListeners(citiesEl)

    const intervalId = window.setInterval(() => {
      if (!isMobile()) return
      if (Date.now() < pauseUntilRef.current) return

      const scrollOne = (el, step) => {
        if (!el) return
        const maxLeft = Math.max(0, el.scrollWidth - el.clientWidth)
        if (maxLeft <= 0) return
        const atEnd = el.scrollLeft >= maxLeft - 4
        if (atEnd) el.scrollTo({ left: 0, behavior: 'smooth' })
        else el.scrollBy({ left: Math.max(40, step), behavior: 'smooth' })
      }

      const quickStep = getScrollStep(quickTrackRef, '[data-quick-card="true"]', 260)
      const citiesStep = getScrollStep(citiesTrackRef, '[data-city-card="true"]', 320)
      scrollOne(quickTrackRef.current, quickStep)
      scrollOne(citiesTrackRef.current, citiesStep)
    }, 3200)

    return () => {
      window.clearInterval(intervalId)
      removeQuick()
      removeCities()
    }
  }, [])

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
    <section className="py-6">
      <Container>
      <SellPropertyModalTrigger>
        {({ open }) => (
          <div className="flex flex-col gap-10">
            <div>
              <div className="flex items-end justify-between gap-6">
                <div>
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
                <div
                  ref={quickTrackRef}
                  className="flex snap-x snap-mandatory gap-3 overflow-x-auto overflow-y-hidden scroll-smooth pb-2"
                >
                  {quick.map((item, idx) => {
                    const isActive = idx === activeQuickIndex
                    const iconSvg = ICONS_LIGHT[item.kind]
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
                          if (item.label === 'Sell') {
                            open()
                            return
                          }
                          const params = new URLSearchParams()
                          if (item.label === 'Buy') params.set('listingType', 'Sale')
                          else if (item.label === 'Residential') params.set('propertyType', 'Residential')
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
                        className={`snap-start relative shrink-0 w-[210px] overflow-hidden rounded-3xl border px-6 py-6 text-center transition-shadow hover:shadow-sm sm:w-[240px] lg:w-[19.3%] lg:min-w-0 ${
                          isActive ? 'border-brand-900' : 'border-slate-900/10 hover:border-slate-200'
                        }`}
                      >
                        <img
                          src={item.image}
                          alt=""
                          aria-hidden="true"
                          className="absolute inset-0 h-full w-full object-cover"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                        <div
                          className={`absolute inset-0 ${
                            isActive ? 'bg-black/65' : 'bg-black/45'
                          }`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

                        <div className="relative">
                          <div
                            className={`mx-auto grid h-14 w-14 place-items-center rounded-3xl border border-white/10 ring-1 ring-inset ring-white/45 shadow-[0_10px_30px_rgba(0,0,0,0.22)] backdrop-blur-xl saturate-150 ${
                              isActive ? 'bg-white/18' : 'bg-white/14'
                            }`}
                          >
                            <img alt="" className="h-8 w-8" src={svgToDataUri(iconSvg)} aria-hidden="true" />
                          </div>
                          <div className="mt-4 text-sm font-extrabold text-white">{item.label}</div>
                          <div className={`mt-1 text-xs font-semibold ${isActive ? 'text-white/90' : 'text-white/80'}`}>
                            {item.meta}
                          </div>
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
                  className="snap-start relative shrink-0 w-full overflow-hidden rounded-3xl border border-slate-900/10 bg-white/70 transition-shadow hover:shadow-sm sm:w-[300px] lg:w-[19.3%] lg:min-w-0"
                >
                  <img
                    src={c.image}
                    alt={c.name}
                    className="h-52 w-full object-cover sm:h-44"
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
        )}
      </SellPropertyModalTrigger>
      </Container>
    </section>
  )
}
