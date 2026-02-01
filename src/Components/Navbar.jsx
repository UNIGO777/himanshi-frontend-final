import { FiHeart, FiLogOut, FiMenu, FiUser, FiX } from 'react-icons/fi'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import useWishlist from '../hooks/useWishlist'
import useAuth from '../hooks/useAuth'
import logo from '../assets/logo_himashi_properties-removebg-preview (1).png'
import Container from './Container'

export default function Navbar() {
  const { items } = useWishlist()
  const wishlistCount = items.length
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { label: 'Home', to: '/' },
    { label: 'Properties', to: '/properties' },
    { label: 'Services', to: '/services' },
    { label: 'About', to: '/about' },
  ]

  return (
    <header className="sticky top-0 z-50 md:backdrop-blur">
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
          role="button"
          tabIndex={-1}
          aria-label="Close menu"
        >
          <div
            className="h-full w-[300px] max-w-[85vw]  bg-brand-50 shadow-xl"
            onClick={(e) => e.stopPropagation()}
            role="presentation"
          >
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center" onClick={() => setIsMenuOpen(false)}>
                <div className="flex h-14 w-56 shrink-0 items-center justify-start overflow-hidden">
                  <img src={logo} alt="Himanshi Properties" className="h-full w-auto object-contain" loading="lazy" />
                </div>
              </Link>
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-900/10 bg-white text-slate-900"
                aria-label="Close menu"
                onClick={() => setIsMenuOpen(false)}
              >
                <FiX className="text-lg" />
              </button>
            </div>

            <nav className="px-3 py-3">
              <div className="grid gap-1">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.to
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setIsMenuOpen(false)}
                      className={`rounded-2xl px-3 py-2.5 text-sm font-semibold ${
                        isActive ? 'bg-white text-slate-900' : 'text-slate-800 hover:bg-white'
                      }`}
                    >
                      {item.label}
                    </Link>
                  )
                })}
              </div>

              <div className="mt-6 grid gap-2">
                {!isAuthenticated ? (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="rounded-2xl border border-slate-900/10 bg-white px-3 py-2.5 text-sm font-semibold text-slate-900"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setIsMenuOpen(false)}
                      className="rounded-2xl bg-brand-900 px-3 py-2.5 text-sm font-semibold text-white"
                    >
                      Sign up
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="rounded-2xl border border-slate-900/10 bg-white px-3 py-2.5 text-sm font-semibold text-slate-900"
                    >
                      Account
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false)
                        logout()
                        navigate('/')
                      }}
                      className="flex items-center gap-2 rounded-2xl border border-slate-900/10 bg-white px-3 py-2.5 text-sm font-semibold text-slate-900"
                    >
                      <FiLogOut />
                      Logout
                    </button>
                  </>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}

      <Container className="flex items-center justify-start gap-2 px-3 py-3 pr-3 sm:px-4 md:grid md:grid-cols-[1fr_auto_1fr] md:items-center">
        <div className="flex items-center gap-2 justify-self-start">
          <Link to="/" className="flex items-center">
            <div className="flex h-12 w-44 shrink-0 items-center justify-start overflow-hidden sm:h-16 sm:w-64">
              <img src={logo} alt="Himanshi Properties" className="h-full w-auto object-contain" loading="lazy" />
            </div>
          </Link>
        </div>

        <nav className="hidden items-center gap-1 justify-self-center rounded-full border border-slate-900/10 bg-white/70 p-0.5 text-sm font-semibold text-slate-700 md:flex">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`rounded-full px-3 py-1.5  ${isActive ? ' bg-brand-900 text-white' : 'hover:bg-brand-900 text-black hover:text-white'} `}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="ml-auto flex items-center justify-self-end gap-2">
          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="hidden rounded-full border border-slate-900/10 bg-white/70 px-3 py-1.5 text-sm font-semibold text-slate-800 sm:inline-flex"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="hidden rounded-full bg-brand-900 px-3 py-1.5 text-sm font-semibold text-white sm:inline-flex"
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
              className="hidden items-center gap-2 rounded-full border border-slate-900/10 bg-white/70 px-3 py-1.5 text-sm font-semibold text-slate-800 sm:inline-flex"
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
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-brand-900 px-1 text-[10px] font-extrabold text-white">
                {wishlistCount > 99 ? '99+' : wishlistCount}
              </span>
            )}
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-900/10 bg-white/70 text-slate-800 md:hidden"
            aria-label="Open menu"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen(true)}
          >
            <FiMenu className="text-lg" />
          </button>
          <Link
            to={isAuthenticated ? '/profile' : '/login'}
            className="hidden h-10 w-10 items-center justify-center rounded-full border border-slate-900/10 bg-white/70 text-slate-800 sm:inline-flex"
            aria-label="Account"
          >
            <FiUser />
          </Link>
        </div>
      </Container>
    </header>
  )
}
