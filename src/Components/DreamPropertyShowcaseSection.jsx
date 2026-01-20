import { motion } from 'framer-motion'
import { useState } from 'react'
import { FiArrowUpRight, FiHeart, FiPlus } from 'react-icons/fi'
import { Link, useNavigate } from 'react-router-dom'
import useWishlist from '../hooks/useWishlist'
import Container from './Container'

const tabs = [
  'All Type',
  'Apartments/Flats',
  'Villas',
  'Duplex Homes',
  'Penthouse Suites',
  'Bungalows',
  'Farmhouses',
]

function normalizeDreamProperty(p) {
  if (!p || typeof p !== 'object') return null
  const id = typeof p.id === 'string' ? p.id : typeof p._id === 'string' ? p._id : ''
  if (!id) return null

  const title = typeof p.title === 'string' ? p.title : 'Property'
  const address = typeof p.address === 'string' ? p.address : typeof p.location === 'string' ? p.location : typeof p.city === 'string' ? p.city : ''
  const image = typeof p.image === 'string' ? p.image : Array.isArray(p.images) && typeof p.images[0] === 'string' ? p.images[0] : ''
  const price = typeof p.price === 'string' ? p.price : typeof p.price === 'number' ? String(p.price) : ''
  const bedsNum = typeof p.beds === 'number' ? p.beds : typeof p.bedrooms === 'number' ? p.bedrooms : null
  const bathsNum = typeof p.baths === 'number' ? p.baths : typeof p.bathrooms === 'number' ? p.bathrooms : null
  const beds = bedsNum === null ? '' : `${bedsNum} Beds`
  const baths = bathsNum === null ? '' : `${bathsNum} Bathrooms`
  const area = typeof p.area === 'string' ? p.area : typeof p.area === 'number' ? `${p.area}` : ''

  return { id, title, address, image, price, period: '', beds, baths, area }
}

export default function DreamPropertyShowcaseSection({ properties }) {
  const [activeTab, setActiveTab] = useState(tabs[0])
  const list = Array.isArray(properties) && properties.length > 0 ? properties.map(normalizeDreamProperty).filter(Boolean).slice(0, 6) : []
  const { hasItem, toggleItem } = useWishlist()
  const navigate = useNavigate()

  return (
    <section className="py-10">
      <Container>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Find Your Dream Property
          </h2>
        </div>

        <button
          type="button"
          aria-label="More"
          onClick={() => navigate('/properties/search')}
          className="hidden h-10 w-10 items-center justify-center rounded-full border border-slate-900/10 bg-white/70 text-slate-800 sm:inline-flex"
        >
          <FiPlus />
        </button>
      </div>

      <div className="mt-5 flex items-center gap-2 overflow-x-auto overflow-y-hidden pb-2">
        {tabs.map((t) => {
          const isActive = t === activeTab
          return (
            <button
              key={t}
              type="button"
              onClick={() => setActiveTab(t)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold ${
                isActive ? 'bg-slate-900 text-white' : 'border border-slate-900/10 bg-white/70 text-slate-700'
              }`}
            >
              {t}
            </button>
          )
        })}
      </div>

      {list.length === 0 ? (
        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 text-sm font-semibold text-slate-600">
          No properties available yet.
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p, idx) => {
            const isSaved = hasItem(p.id)
            const priceText = p.period ? `${p.price} ${p.period}` : p.price
            const hasImage = typeof p.image === 'string' && p.image.trim().length > 0
            const wishlistItem = {
              id: p.id,
              title: p.title,
              image: p.image,
              price: priceText,
              location: p.address || '',
            }

            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.35, delay: idx * 0.03 }}
                className="relative overflow-hidden rounded-3xl border border-slate-900/10 bg-white/70"
              >
                <button
                  type="button"
                  onClick={() => toggleItem(wishlistItem)}
                  aria-label={isSaved ? 'Remove from wishlist' : 'Add to wishlist'}
                  className={`absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full border backdrop-blur transition-colors ${
                    isSaved ? 'border-rose-200 bg-rose-50/90 text-rose-600 hover:bg-rose-50' : 'border-slate-200 bg-white/90 text-slate-700 hover:bg-white'
                  }`}
                >
                  <FiHeart />
                </button>
                <Link to={`/property/${p.id}`} className="block">
                  <div className="overflow-hidden">
                    {hasImage ? (
                      <img
                        src={p.image}
                        alt={p.title}
                        className="h-44 w-full object-cover sm:h-48"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="h-44 w-full bg-slate-100 sm:h-48" aria-hidden="true" />
                    )}
                  </div>

                  <div className="relative p-5">
                    <div className="text-sm font-bold tracking-tight text-slate-900">{p.price}</div>

                    <div className="mt-2 text-[15px] font-semibold leading-snug tracking-tight text-slate-900">{p.title}</div>
                    <div className="mt-1 text-xs font-medium text-slate-600">{p.address}</div>

                    <div className="mt-4 flex items-center gap-4 text-[11px] font-semibold text-slate-500">
                      <div>{p.beds}</div>
                      <div>{p.baths}</div>
                      <div>{p.area}</div>
                    </div>

                    <div className="absolute bottom-4 right-4 grid h-10 w-10 place-items-center rounded-full bg-slate-900 text-white">
                      <FiArrowUpRight />
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      )}
      </Container>
    </section>
  )
}
