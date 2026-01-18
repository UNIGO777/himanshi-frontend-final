import { FiHeart, FiLogOut, FiMenu, FiUser } from 'react-icons/fi'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import useWishlist from '../hooks/useWishlist'
import useAuth from '../hooks/useAuth'

export default function Navbar() {
  const { items } = useWishlist()
  const wishlistCount = items.length
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const navItems = [
    { label: 'Home', to: '/' },
    { label: 'Properties', to: '/properties' },
    { label: 'Services', to: '/services' },
    { label: 'About', to: '/about' },
  ]

  return (
    <header className="sticky top-0 z-50  bg-[#f4f1ea]/80 backdrop-blur">
      <div className="mx-auto grid max-w-[1400px] grid-cols-[1fr_auto_1fr] items-center gap-3 px-3 py-4 sm:px-6 lg:px-10">
        <div className="flex items-center gap-3 justify-self-start">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-900/10 bg-white/70 text-slate-800 md:hidden"
            aria-label="Open menu"
          >
            <FiMenu className="text-lg" />
          </button>

          <Link to="/" className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-slate-900 text-sm font-semibold text-white">
              HP
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold text-slate-900">Himanshi</div>
              <div className="text-xs text-slate-600">Properties</div>
            </div>
          </Link>
        </div>

        <nav className="hidden items-center gap-1 justify-self-center rounded-full border border-slate-900/10 bg-white/70 p-1 text-sm font-semibold text-slate-700 md:flex">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`rounded-full px-4 py-2 ${isActive ? 'text-slate-900' : 'hover:bg-white/70'}`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center justify-self-end gap-2">
          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="hidden rounded-full border border-slate-900/10 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-800 sm:inline-flex"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="hidden rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white sm:inline-flex"
              >
                Sign up
              </Link>
            </>
          ) : (
            <button
              type="button"
              onClick={() => {
                logout()
                navigate('/')
              }}
              className="hidden items-center gap-2 rounded-full border border-slate-900/10 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-800 sm:inline-flex"
            >
              <FiLogOut />
              Logout
            </button>
          )}
          <Link
            to="/wishlist"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-900/10 bg-white/70 text-slate-800"
            aria-label="Wishlist"
          >
            <FiHeart />
            {wishlistCount > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-slate-900 px-1 text-[10px] font-extrabold text-white">
                {wishlistCount > 99 ? '99+' : wishlistCount}
              </span>
            )}
          </Link>
          <Link
            to={isAuthenticated ? '/profile' : '/login'}
            className="hidden h-10 w-10 items-center justify-center rounded-full border border-slate-900/10 bg-white/70 text-slate-800 sm:inline-flex"
            aria-label="Account"
          >
            <FiUser />
          </Link>
        </div>
      </div>
    </header>
  )
}
