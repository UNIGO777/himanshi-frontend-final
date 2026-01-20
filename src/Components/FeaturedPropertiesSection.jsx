import { motion } from 'framer-motion'
import { FiDroplet, FiHeart, FiHome, FiMap, FiMaximize2 } from 'react-icons/fi'
import { Link, useNavigate } from 'react-router-dom'
import useWishlist from '../hooks/useWishlist'

function StatPill({ icon: Icon, value }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
      <Icon className="text-slate-600" />
      {value}
    </div>
  )
}

function PropertyCard({ property }) {
  const { hasItem, toggleItem } = useWishlist()
  const navigate = useNavigate()
  const isPlot = property.beds === 0 && property.baths === 0
  const isSaved = hasItem(property.id)
  const hasImage = typeof property.image === 'string' && property.image.trim().length > 0
  const imageSrc = hasImage ? property.image : ''
  const wishlistItem = {
    id: property.id,
    title: property.title,
    image: imageSrc,
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
          <img src={imageSrc} alt={property.title} className="h-full w-full object-cover" loading="lazy" />
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

export default function FeaturedPropertiesSection({ properties }) {
  const list = Array.isArray(properties) && properties.length > 0 ? properties.slice(0, 6) : []
  return (
    <section className="mx-auto max-w-[1400px] px-3 py-10 sm:px-6 lg:px-10">
      <div className="flex items-end justify-between gap-6">
        <div>
          <div className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">Recommended for you</div>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Find Your Dream Property
          </h2>
        </div>
        <Link to="/properties/search" className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
          See more
        </Link>
      </div>

      {list.length === 0 ? (
        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 text-sm font-semibold text-slate-600">
          No properties available yet.
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p, idx) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.35, delay: idx * 0.03 }}
            >
              <PropertyCard property={p} />
            </motion.div>
          ))}
        </div>
      )}
    </section>
  )
}
