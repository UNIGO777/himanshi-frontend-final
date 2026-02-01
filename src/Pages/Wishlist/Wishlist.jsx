import { Link } from 'react-router-dom'
import { FiHeart, FiX } from 'react-icons/fi'
import Navbar from '../../Components/Navbar'
import FooterSection from '../../Components/FooterSection'
import Container from '../../Components/Container'
import useWishlist from '../../hooks/useWishlist'

export default function Wishlist() {
  const { items, removeItem, clear } = useWishlist()

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="py-10">
        <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">Wishlist</div>
            <div className="mt-1 text-sm font-semibold text-slate-600">
              {items.length === 0 ? 'No saved properties yet.' : `${items.length} saved ${items.length === 1 ? 'property' : 'properties'}.`}
            </div>
          </div>

          {items.length > 0 && (
            <button
              type="button"
              onClick={clear}
              className="rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-700"
            >
              Clear all
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-8">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-3xl bg-brand-900 text-white">
                <FiHeart />
              </div>
              <div>
                <div className="text-lg font-extrabold text-slate-900">Your wishlist is empty</div>
                <div className="mt-1 text-sm font-semibold text-slate-600">
                  Tap the heart icon on any property to save it here.
                </div>
              </div>
            </div>
            <Link to="/" className="mt-6 inline-flex rounded-2xl bg-brand-900 px-5 py-3 text-sm font-semibold text-white">
              Browse properties
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p) => (
              <Link
                key={p.id}
                to={`/property/${p.id}`}
                className="block overflow-hidden rounded-3xl border border-slate-200 bg-white transition-shadow hover:shadow-sm"
              >
                <div className="relative h-44 sm:h-48">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      removeItem(p.id)
                    }}
                    aria-label="Remove from wishlist"
                    className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white/90 text-slate-700 backdrop-blur transition-colors hover:bg-white"
                  >
                    <FiX />
                  </button>
                </div>

                <div className="p-5">
                  <div className="text-base font-extrabold text-slate-900">{p.title}</div>
                  {!!p.location && <div className="mt-1 text-sm font-semibold text-slate-500">{p.location}</div>}
                  {!!p.price && <div className="mt-3 text-lg font-extrabold text-slate-900">{p.price}</div>}

                  <div className="mt-4 block w-full rounded-2xl bg-brand-900 px-4 py-3 text-center text-sm font-semibold text-white">
                    View Details
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        </Container>
      </main>
      <FooterSection />
    </div>
  )
}
