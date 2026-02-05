import { motion } from 'framer-motion'
import { useRef, useState } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import Container from './Container'

const svgToDataUri = (svg) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`

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
}

const ICONS_LIGHT = {
  apartment: ICONS_DARK.apartment.replaceAll('#0f172a', '#ffffff'),
  villa: ICONS_DARK.villa.replaceAll('#0f172a', '#ffffff'),
  farmhouse: ICONS_DARK.farmhouse.replaceAll('#0f172a', '#ffffff'),
  studio: ICONS_DARK.studio.replaceAll('#0f172a', '#ffffff'),
  office: ICONS_DARK.office.replaceAll('#0f172a', '#ffffff'),
  townhouse: ICONS_DARK.townhouse.replaceAll('#0f172a', '#ffffff'),
  commercial: ICONS_DARK.commercial.replaceAll('#0f172a', '#ffffff'),
}

const items = [
  {
    label: 'Apartment',
    kind: 'apartment',
    meta: '240 Listings',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1600&q=80',
  },
  {
    label: 'Residential',
    kind: 'apartment',
    meta: 'Browse',
    image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1600&q=80',
  },
  {
    label: 'Villa',
    kind: 'villa',
    meta: '128 Listings',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1600&q=80',
  },
  {
    label: 'Farmhouse',
    kind: 'farmhouse',
    meta: 'Browse',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1600&q=80',
  },
  {
    label: 'Studio',
    kind: 'studio',
    meta: '86 Listings',
    image: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1600&q=80',
  },
  {
    label: 'Office',
    kind: 'office',
    meta: '95 Listings',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1600&q=80',
  },
  {
    label: 'Townhouse',
    kind: 'townhouse',
    meta: '74 Listings',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
  },
  {
    label: 'Commercial',
    kind: 'commercial',
    meta: '112 Listings',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
  },
]

export default function QuickSearchSection() {
  const trackRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(null)
  const navigate = useNavigate()

  const getScrollStep = () => {
    const el = trackRef.current
    if (!el) return 280
    const card = el.querySelector('[data-slider-card="true"]')
    if (!card) return 280
    const styles = window.getComputedStyle(el)
    const rawGap = styles.columnGap || styles.gap || '0px'
    const gap = Number.parseFloat(rawGap) || 0
    const cardWidth = card.getBoundingClientRect().width
    return cardWidth + gap
  }

  const scrollByCards = (direction) => {
    const el = trackRef.current
    if (!el) return
    el.scrollBy({ left: direction * getScrollStep(), behavior: 'smooth' })
  }

  return (
    <section className="py-6 md:py-12">
      <Container>
      <div className="flex items-end justify-between gap-6">
        <div>
          
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Popular Categories
          </h2>
        </div>
      </div>

      <div className="relative mt-6">
        <button
          type="button"
          onClick={() => scrollByCards(-1)}
          aria-label="Scroll left"
          className="absolute left-0 top-1/2 z-10 hidden h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-slate-900/10 bg-white/80 text-slate-800 shadow-sm backdrop-blur transition-colors hover:bg-white sm:grid"
        >
          <FiChevronLeft />
        </button>
        <button
          type="button"
          onClick={() => scrollByCards(1)}
          aria-label="Scroll right"
          className="absolute right-0 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 translate-x-1/2 place-items-center rounded-full border border-slate-900/10 bg-white/80 text-slate-800 shadow-sm backdrop-blur transition-colors hover:bg-white sm:grid"
        >
          <FiChevronRight />
        </button>
        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-3 overflow-x-auto overflow-y-hidden scroll-smooth pb-2"
        >
          {items.map((item, index) => {
            const isActive = index === activeIndex
            const iconSvg = ICONS_LIGHT[item.kind]
            return (
              <motion.button
                key={item.label}
                type="button"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.35, delay: index * 0.04 }}
                onClick={() => {
                  setActiveIndex(index)
                  const params = new URLSearchParams()
                  params.set('propertyType', item.label)
                  navigate({ pathname: '/properties/search', search: `?${params.toString()}` })
                }}
                data-slider-card="true"
                className={`snap-start relative shrink-0 w-[150px] overflow-hidden rounded-3xl border px-4 py-4 text-center transition-shadow hover:shadow-sm sm:w-[170px] lg:w-[19.3%] lg:min-w-0 ${
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
                    className={`mx-auto grid h-12 w-12 place-items-center rounded-3xl border border-white/10 ring-1 ring-inset ring-white/45 shadow-[0_10px_30px_rgba(0,0,0,0.22)] backdrop-blur-xl saturate-150 ${
                      isActive ? 'bg-white/18 text-white' : 'bg-white/14 text-white'
                    }`}
                  >
                    <img alt="" className="h-7 w-7" src={svgToDataUri(iconSvg)} aria-hidden="true" />
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
      </Container>
    </section>
  )
}
