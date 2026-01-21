import { motion } from 'framer-motion'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { FiArrowLeft, FiDroplet, FiHeart, FiHome, FiMapPin, FiMaximize2, FiPlay } from 'react-icons/fi'
import { Star } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import Navbar from '../../Components/Navbar'
import FooterSection from '../../Components/FooterSection'
import Container from '../../Components/Container'
import useWishlist from '../../hooks/useWishlist'
import useAuth from '../../hooks/useAuth'
import { createPropertyQuery, createPropertyRating, getProperties, getPropertyById, getPropertyQueries, getRelatedProperties } from '../../api/properties'

function StatPill({ icon: Icon, value }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
      <Icon className="text-slate-600" />
      {value}
    </div>
  )
}

function RatingRow({ label, value, total }) {
  const pct = total === 0 ? 0 : Math.round((value / total) * 100)
  return (
    <div className="flex items-center gap-3 text-xs font-semibold text-slate-600">
      <div className="w-6 shrink-0">{label}</div>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-slate-900" style={{ width: `${pct}%` }} />
      </div>
      <div className="w-10 shrink-0 text-right tabular-nums">{pct}%</div>
    </div>
  )
}

export default function PropertyDetails() {
  const { propertyId } = useParams()
  const [apiProperty, setApiProperty] = useState(null)
  const [apiRelated, setApiRelated] = useState([])
  const [apiFallbackList, setApiFallbackList] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true
    setIsLoading(true)
    setError('')
    setApiRelated([])
    setApiFallbackList([])

    ;(async () => {
      try {
        const [propResult, relatedResult] = await Promise.allSettled([
          getPropertyById(propertyId),
          getRelatedProperties({ propertyId, limit: 6 }),
        ])
        if (!isMounted) return

        if (propResult.status === 'fulfilled') {
          setApiProperty(propResult.value)
        } else {
          setApiProperty(null)
          if (propResult.reason?.message) setError(propResult.reason.message)
        }

        const relatedList =
          relatedResult.status === 'fulfilled' && Array.isArray(relatedResult.value) ? relatedResult.value : []
        setApiRelated(relatedList)

        if (relatedList.length === 0) {
          try {
            const list = await getProperties()
            if (!isMounted) return
            setApiFallbackList(Array.isArray(list) ? list : [])
          } catch {
            if (!isMounted) return
            setApiFallbackList([])
          }
        }
      } finally {
        if (isMounted) setIsLoading(false)
      }
    })()

    return () => {
      isMounted = false
    }
  }, [propertyId])

  const property = useMemo(() => {
    if (!apiProperty?.id) return null
    const raw = apiProperty.raw && typeof apiProperty.raw === 'object' ? apiProperty.raw : {}
    const merged = { ...raw }
    merged.id = apiProperty.id
    merged.title = apiProperty.title || merged.title
    merged.location = apiProperty.location || merged.location || merged.city
    merged.address = merged.address || merged.location
    merged.price = apiProperty.price || merged.price
    merged.beds = typeof apiProperty.beds === 'number' ? apiProperty.beds : merged.beds
    merged.baths = typeof apiProperty.baths === 'number' ? apiProperty.baths : merged.baths
    merged.area = apiProperty.area || merged.area
    merged.image = apiProperty.image || merged.image || (Array.isArray(merged.images) ? merged.images[0] : '')
    merged.images = Array.isArray(merged.images) ? merged.images : []
    merged.amenities = Array.isArray(merged.amenities) ? merged.amenities : []
    merged.description = typeof merged.description === 'string' ? merged.description : ''
    return merged
  }, [apiProperty])

  const propertyIdValue = property?.id || ''
  const recommendations = useMemo(() => {
    if (!propertyIdValue) return []
    const source = apiRelated.length > 0 ? apiRelated : apiFallbackList
    if (source.length === 0) return []
    return source
      .filter((p) => p.id !== propertyIdValue)
      .slice(0, 4)
      .map((p) => (p.raw ? { ...p.raw, id: p.id, title: p.title, image: p.image, location: p.location, price: p.price, beds: p.beds, baths: p.baths, area: p.area } : p))
  }, [apiFallbackList, apiRelated, propertyIdValue])

  const locationText = property?.location || property?.address
  const priceText = property?.period ? `${property.price} ${property.period}` : property?.price
  const bedsText = typeof property?.beds === 'number' ? `${property.beds} Beds` : property?.beds
  const bathsText = typeof property?.baths === 'number' ? `${property.baths} Baths` : property?.baths
  const { hasItem, toggleItem } = useWishlist()
  const isSaved = property ? hasItem(property.id) : false
  const wishlistItem = property
    ? {
        id: property.id,
        title: property.title,
        image: property.image,
        price: priceText || '',
        location: locationText || '',
      }
    : null

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="py-8">
        <Container>
        <div className="flex items-center justify-between gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
          >
            <FiArrowLeft />
            Back
          </Link>
          {!!wishlistItem && (
            <button
              type="button"
              onClick={() => toggleItem(wishlistItem)}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                isSaved ? 'border-rose-200 bg-rose-50 text-rose-700' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
              aria-label={isSaved ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <FiHeart />
              {isSaved ? 'Saved' : 'Save'}
            </button>
          )}
        </div>

        {!property ? (
          isLoading ? (
            <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-8">
              <div className="text-xl font-extrabold text-slate-900">Loading property…</div>
              <div className="mt-2 text-sm font-semibold text-slate-600">Fetching the latest details.</div>
            </div>
          ) : (
            <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-8">
              <div className="text-xl font-extrabold text-slate-900">Property not found</div>
              <div className="mt-2 text-sm font-semibold text-slate-600">
                {error ? error : 'The property you are looking for is not available.'}
              </div>
              <Link to="/" className="mt-6 inline-flex rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white">
                Go to home
              </Link>
            </div>
          )
        ) : (
          <PropertyDetailsContent
            property={property}
            locationText={locationText}
            priceText={priceText}
            bedsText={bedsText}
            bathsText={bathsText}
            isSaved={isSaved}
            wishlistItem={wishlistItem}
            toggleItem={toggleItem}
            recommendations={recommendations}
            isLoading={isLoading}
            error={error}
          />
        )}
        </Container>
      </main>
      <FooterSection />
    </div>
  )
}

function PropertyDetailsContent({ property, locationText, priceText, bedsText, bathsText, isSaved, wishlistItem, toggleItem, recommendations, isLoading, error }) {
  const { isAuthenticated, user } = useAuth()
  const token = user?.token
  const navigate = useNavigate()
  const location = useLocation()
  const [activeMediaIndex, setActiveMediaIndex] = useState(0)
  const [inquiryMessage, setInquiryMessage] = useState('')
  const [queryStatus, setQueryStatus] = useState('')
  const [isSendingQuery, setIsSendingQuery] = useState(false)
  const [isQuerySubmitted, setIsQuerySubmitted] = useState(false)
  const [queriesCount, setQueriesCount] = useState(null)
  const mediaItems = useMemo(() => {
    const images = Array.isArray(property.images)
      ? property.images.filter((src) => typeof src === 'string' && src.trim().length > 0)
      : []
    const fallbackImages = [property.image].filter((src) => typeof src === 'string' && src.trim().length > 0)
    const baseImages = images.length > 0 ? images : fallbackImages
    const items = baseImages.map((src) => ({ type: 'image', src }))

    if (typeof property.video === 'string' && property.video.trim().length > 0) {
      items.push({
        type: 'video',
        src: property.video,
        poster: items[0]?.src || property.image,
      })
    }

    return items.length > 0 ? items : [{ type: 'image', src: '' }]
  }, [property.image, property.images, property.video])
  const activeItem = mediaItems[Math.min(activeMediaIndex, mediaItems.length - 1)]

  const [reviews, setReviews] = useState(() => [])
  const [ratingStars, setRatingStars] = useState(5)
  const [ratingComment, setRatingComment] = useState('')
  const [ratingStatus, setRatingStatus] = useState('')
  const [isSendingRating, setIsSendingRating] = useState(false)

  useEffect(() => {
    let isMounted = true
    setQueriesCount(null)
    if (!token || !property?.id) return () => {}
    getPropertyQueries({ propertyId: property.id, token })
      .then((payload) => {
        if (!isMounted) return
        const list = Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : Array.isArray(payload?.queries) ? payload.queries : []
        setQueriesCount(list.length)
      })
      .catch(() => {
        if (!isMounted) return
        setQueriesCount(null)
      })
    return () => {
      isMounted = false
    }
  }, [property?.id, token])

  const ratingSummary = useMemo(() => {
    const total = reviews.length
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0)
    const avg = total === 0 ? 0 : sum / total
    const counts = reviews.reduce(
      (acc, r) => {
        acc[r.rating] = (acc[r.rating] || 0) + 1
        return acc
      },
      { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    )
    return { total, avg, counts }
  }, [reviews])

  const onSubmitQuery = async () => {
    const msg = inquiryMessage.trim()
    setQueryStatus('')
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `${location.pathname}${location.search}` } })
      return
    }
    if (!msg) {
      setQueryStatus('Please enter a message.')
      return
    }
    setIsSendingQuery(true)
    try {
      await createPropertyQuery({ propertyId: property.id, message: msg, token })
      setInquiryMessage('')
      setIsQuerySubmitted(true)
    } catch (err) {
      setQueryStatus(err?.message || 'Failed to send query.')
    } finally {
      setIsSendingQuery(false)
    }
  }

  const onSubmitRating = async (e) => {
    e.preventDefault()
    setRatingStatus('')
    if (!isAuthenticated) {
      setRatingStatus('Please login to submit a rating.')
      return
    }
    const stars = Number(ratingStars)
    if (!Number.isFinite(stars) || stars < 1 || stars > 5) {
      setRatingStatus('Stars must be between 1 and 5.')
      return
    }
    setIsSendingRating(true)
    try {
      await createPropertyRating({ propertyId: property.id, stars, comment: ratingComment.trim(), token })
      const now = new Date()
      const date = now.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })
      const name = typeof user?.email === 'string' ? user.email : 'You'
      setReviews((prev) => [
        {
          id: `r_${now.getTime()}`,
          name,
          date,
          rating: stars,
          text: ratingComment.trim() || 'Rating submitted.',
        },
        ...prev,
      ])
      setRatingComment('')
      setRatingStars(5)
      setRatingStatus('Rating submitted successfully.')
    } catch (err) {
      setRatingStatus(err?.message || 'Failed to submit rating.')
    } finally {
      setIsSendingRating(false)
    }
  }

  return (
    <div className="mt-6">
      {(isLoading || !!error) && (
        <div className="mb-6 grid gap-3 sm:grid-cols-2">
          {isLoading && (
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700">
              Loading latest details…
            </div>
          )}
          {!!error && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
              {error}
            </div>
          )}
        </div>
      )}
      <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
        <div className="space-y-6 lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="overflow-hidden rounded-3xl border border-slate-200 bg-white"
          >
            <div className="relative">
              {activeItem.type === 'video' ? (
                <video
                  src={activeItem.src}
                  poster={activeItem.poster}
                  className="aspect-[16/10] w-full object-cover"
                  controls
                  playsInline
                />
              ) : (
                <img
                  src={activeItem.src}
                  alt={property.title}
                  className="aspect-[16/10] w-full object-cover"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              )}
              <div className="absolute left-4 top-4 rounded-full bg-white/90 px-4 py-2 text-xs font-extrabold text-slate-900 backdrop-blur">
                Verified Listing
              </div>
            </div>

            <div className="flex gap-3 overflow-x-auto p-4">
              {mediaItems.map((item, idx) => {
                const isActive = idx === activeMediaIndex
                return (
                  <button
                    key={`${item.type}-${item.src}-${idx}`}
                    type="button"
                    onClick={() => setActiveMediaIndex(idx)}
                    aria-label={item.type === 'video' ? 'Preview video' : `Preview image ${idx + 1}`}
                    className={`overflow-hidden rounded-2xl border bg-white ${isActive ? 'border-slate-900 ring-2 ring-slate-900/20' : 'border-slate-200'}`}
                  >
                    {item.type === 'video' ? (
                      <div className="relative">
                        <img
                          src={item.poster}
                          alt=""
                          className="h-16 w-20 object-cover sm:h-20 sm:w-24"
                          loading="lazy"
                          aria-hidden="true"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 grid place-items-center bg-slate-900/20 text-white">
                          <FiPlay />
                        </div>
                      </div>
                    ) : (
                      <img
                        src={item.src}
                        alt=""
                        className="h-16 w-20 object-cover sm:h-20 sm:w-24"
                        loading="lazy"
                        aria-hidden="true"
                        referrerPolicy="no-referrer"
                      />
                    )}
                  </button>
                )
              })}
            </div>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.03 }}
              className="rounded-3xl border border-slate-200 bg-white p-6"
            >
              <div className="text-lg font-extrabold text-slate-900">Description</div>
              <div className="mt-3 text-sm leading-relaxed text-slate-600">{property.description}</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.06 }}
              className="rounded-3xl border border-slate-200 bg-white p-6"
            >
              <div className="text-lg font-extrabold text-slate-900">Amenities</div>
              <div className="mt-4 flex flex-wrap gap-2">
                {(property.amenities || []).slice(0, 10).map((a) => (
                  <div
                    key={a}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700"
                  >
                    {a}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        <div className="space-y-6 lg:col-span-5">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.03 }}
            className="rounded-3xl border border-slate-200 bg-white p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">{property.title}</div>
                <div className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-slate-600">
                  <FiMapPin className="text-slate-500" />
                  <span className="truncate">{locationText}</span>
                </div>
              </div>

              {!!wishlistItem && (
                <button
                  type="button"
                  onClick={() => toggleItem(wishlistItem)}
                  aria-label={isSaved ? 'Remove from wishlist' : 'Add to wishlist'}
                  className={`grid h-12 w-12 place-items-center rounded-2xl border transition-colors ${
                    isSaved ? 'border-rose-200 bg-rose-50 text-rose-700' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <FiHeart />
                </button>
              )}
            </div>

            <div className="mt-5 text-3xl font-extrabold text-slate-900">{priceText}</div>

            <div className="mt-4 flex flex-wrap gap-2">
              {!!bedsText && property.beds !== 0 && <StatPill icon={FiHome} value={bedsText} />}
              {!!bathsText && property.baths !== 0 && <StatPill icon={FiDroplet} value={bathsText} />}
              {!!property.area && <StatPill icon={FiMaximize2} value={property.area} />}
            </div>

            <div className="mt-6 grid gap-3">
              <div className="grid gap-2 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-sm font-extrabold text-slate-900">What you get</div>
                <div className="grid gap-2 text-xs font-semibold text-slate-600 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white px-3 py-2">Free site visit</div>
                  <div className="rounded-2xl bg-white px-3 py-2">Verified documentation support</div>
                  <div className="rounded-2xl bg-white px-3 py-2">Negotiation assistance</div>
                  <div className="rounded-2xl bg-white px-3 py-2">Fast callbacks</div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.06 }}
            className="rounded-3xl bg-slate-900 p-6 text-white"
          >
            <div className="text-lg font-extrabold">Interested in this property?</div>
            <div className="mt-2 text-sm font-semibold text-white/75">Send a message and we will contact you.</div>
            {typeof queriesCount === 'number' && (
              <div className="mt-3 text-xs font-semibold text-white/70">{queriesCount} queries already submitted</div>
            )}
            {!isAuthenticated && (
              <div className="mt-3 text-xs font-semibold text-white/70">
                <Link to="/login" className="font-extrabold text-white underline">
                  Login
                </Link>{' '}
                to submit a query.
              </div>
            )}
            {isQuerySubmitted ? (
              <div className="mt-5 rounded-2xl border border-white/10 bg-white/10 px-4 py-4">
                <div className="text-base font-extrabold text-white">Thank you!</div>
                <div className="mt-1 text-sm font-semibold text-white/75">Your query has been submitted. We will contact you soon.</div>
              </div>
            ) : (
              <>
                <textarea
                  value={inquiryMessage}
                  onChange={(e) => setInquiryMessage(e.target.value)}
                  rows={4}
                  className="mt-5 w-full resize-none rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-white/50"
                  placeholder="I am interested in this property. Please call me."
                />
                {!!queryStatus && <div className="mt-3 text-xs font-semibold text-white/80">{queryStatus}</div>}
                <button
                  type="button"
                  onClick={onSubmitQuery}
                  disabled={isSendingQuery}
                  className="mt-4 w-full rounded-2xl bg-white px-5 py-3 text-sm font-extrabold text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Send query
                </button>
              </>
            )}
          </motion.div>
        </div>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-12 lg:items-start">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.06 }}
          className="rounded-3xl border border-slate-200 bg-white p-6 lg:col-span-4 xl:col-span-3"
        >
          <div className="text-sm font-extrabold text-slate-900">Rating & Reviews</div>
          <div className="mt-5 flex items-end gap-4">
            <div className="text-6xl font-extrabold tracking-tight text-slate-900">{ratingSummary.avg.toFixed(1)}</div>
            <div className="pb-2 text-sm font-semibold text-slate-600">{ratingSummary.total} Reviews</div>
          </div>

          <div className="mt-6 space-y-3">
            <RatingRow label="5" value={ratingSummary.counts[5]} total={ratingSummary.total} />
            <RatingRow label="4" value={ratingSummary.counts[4]} total={ratingSummary.total} />
            <RatingRow label="3" value={ratingSummary.counts[3]} total={ratingSummary.total} />
            <RatingRow label="2" value={ratingSummary.counts[2]} total={ratingSummary.total} />
            <RatingRow label="1" value={ratingSummary.counts[1]} total={ratingSummary.total} />
          </div>

          <form onSubmit={onSubmitRating} className="mt-6 space-y-3 border-t border-slate-200 pt-6">
            <div className="text-xs font-extrabold text-slate-900">Rate this property</div>
            {!isAuthenticated && (
              <div className="text-xs font-semibold text-slate-600">
                <Link to="/login" className="font-extrabold text-slate-900 underline">
                  Login
                </Link>{' '}
                to submit a rating.
              </div>
            )}
            <div
              role="radiogroup"
              aria-label="Star rating"
              className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-3 py-2"
            >
              {Array.from({ length: 5 }, (_, idx) => {
                const value = idx + 1
                const isFilled = value <= ratingStars
                return (
                  <button
                    key={value}
                    type="button"
                    role="radio"
                    aria-checked={value === ratingStars}
                    aria-label={`${value} star${value === 1 ? '' : 's'}`}
                    onClick={() => setRatingStars(value)}
                    className={`grid h-10 w-10 place-items-center rounded-full transition-colors ${
                      isFilled ? 'text-amber-400 hover:bg-amber-50' : 'text-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <Star className="h-5 w-5" fill={isFilled ? 'currentColor' : 'none'} />
                  </button>
                )
              })}
            </div>
            <textarea
              value={ratingComment}
              onChange={(e) => setRatingComment(e.target.value)}
              rows={3}
              className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400"
              placeholder="Optional comment"
            />
            {!!ratingStatus && <div className="text-xs font-semibold text-slate-700">{ratingStatus}</div>}
            <button
              type="submit"
              disabled={isSendingRating}
              className="w-full rounded-2xl bg-slate-900 px-5 py-3 text-sm font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              Submit rating
            </button>
          </form>
        </motion.div>

        <div className="lg:col-span-8 xl:col-span-9">
          {reviews.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm font-semibold text-slate-600">
              No reviews yet. Be the first to leave a rating.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {reviews.map((r, idx) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.35, delay: idx * 0.03 }}
                  className="rounded-3xl border border-slate-200 bg-white p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-extrabold text-slate-900">{r.name}</div>
                      <div className="mt-1 text-xs font-semibold text-slate-500">{r.date}</div>
                    </div>
                    <div className="rounded-full bg-slate-900 px-3 py-1 text-xs font-extrabold text-white">
                      {r.rating.toFixed(1)}
                    </div>
                  </div>
                  <div className="mt-3 text-sm font-semibold leading-relaxed text-slate-600">{r.text}</div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-12">
        <div className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">You might also like</div>
        {recommendations.length === 0 ? (
          <div className="mt-5 rounded-3xl border border-slate-200 bg-white p-6 text-sm font-semibold text-slate-600">
            No recommendations available yet.
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {recommendations.map((p, idx) => {
              const pLocation = p.location || p.address || ''
              const pPrice = p.period ? `${p.price} ${p.period}` : p.price
              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.35, delay: idx * 0.03 }}
                  className="overflow-hidden rounded-3xl border border-slate-200 bg-white"
                >
                  <Link to={`/property/${p.id}`} className="block">
                    <div className="h-40 overflow-hidden">
                      <img
                        src={p.image}
                        alt={p.title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="p-4">
                      <div className="text-sm font-semibold leading-snug tracking-tight text-slate-900">{p.title}</div>
                      <div className="mt-1 line-clamp-2 text-xs font-medium text-slate-600">{pLocation}</div>
                      <div className="mt-3 text-sm font-bold tracking-tight text-slate-900">{pPrice}</div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
