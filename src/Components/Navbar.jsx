import { FiHeart, FiLogOut, FiMenu, FiUser, FiX } from 'react-icons/fi'
import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import useWishlist from '../hooks/useWishlist'
import useAuth from '../hooks/useAuth'
import logo from '../assets/logo_himashi_properties-removebg-preview (1).png'
import Container from './Container'
import { SellPropertyModalTrigger } from './SellPropertyModal'

export default function Navbar() {
  const { items } = useWishlist()
  const wishlistCount = items.length
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isTopBarVisible, setIsTopBarVisible] = useState(true)
  const [isNavbarSolid, setIsNavbarSolid] = useState(false)
  const isTopBarVisibleRef = useRef(true)
  const isNavbarSolidRef = useRef(false)
  const tickingRef = useRef(false)

  const navItems = [
    { label: 'Home', to: '/' },
    { label: 'Properties', to: '/properties' },
    { label: 'Services', to: '/services' },
    { label: 'About', to: '/about' },
  ]

  useEffect(() => {
    const initialY = typeof window !== 'undefined' ? window.scrollY || 0 : 0
    const initialTopBarVisible = initialY <= 24
    const initialNavbarSolid = initialY >= 8
    isTopBarVisibleRef.current = initialTopBarVisible
    isNavbarSolidRef.current = initialNavbarSolid
    setIsTopBarVisible(initialTopBarVisible)
    setIsNavbarSolid(initialNavbarSolid)

    const updateTopBarVisible = (next) => {
      if (isTopBarVisibleRef.current === next) return
      isTopBarVisibleRef.current = next
      setIsTopBarVisible(next)
    }

    const updateNavbarSolid = (next) => {
      if (isNavbarSolidRef.current === next) return
      isNavbarSolidRef.current = next
      setIsNavbarSolid(next)
    }

    const onScroll = () => {
      if (tickingRef.current) return
      tickingRef.current = true

      window.requestAnimationFrame(() => {
        const y = window.scrollY || 0
        updateNavbarSolid(y >= 8)
        const currentTopBarVisible = isTopBarVisibleRef.current
        const nextTopBarVisible = y <= 24 ? true : y >= 80 ? false : currentTopBarVisible
        updateTopBarVisible(nextTopBarVisible)
        tickingRef.current = false
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const TopBarNumbers = ({ className = '' }) => (
    <div className={`inline-flex shrink-0 items-center gap-2 ${className}`}>
      <span className="text-white/90">Call:</span>
      <a href="tel:+919826021111" className="hover:underline">
        +91 98260 21111
      </a>
      <span className="text-white/50">|</span>
      <a href="tel:+918349279710" className="hover:underline">
        +91 83492 79710
      </a>
      <span className="text-white/50">|</span>
      <a href="tel:+917771977139" className="hover:underline">
        +91 77719 77139
      </a>
      <span className="text-white/50">|</span>
      <a href="https://wa.me/919111111397" target="_blank" rel="noopener noreferrer" className="hover:underline">
        WhatsApp: +91 91111 11397
      </a>
    </div>
  )

  return (
    <header className="sticky top-0 z-50 md:backdrop-blur">
      <div
        className={`overflow-hidden bg-brand-900 text-white transition-[max-height,opacity] duration-300 ${
          isTopBarVisible ? 'max-h-12 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <Container className="px-3 py-2 text-[11px] font-semibold sm:px-4 sm:text-xs">
          <div className="relative overflow-hidden sm:hidden">
            <div className="flex w-max [animation:navbar-marquee_14s_linear_infinite] motion-reduce:[animation:none]">
              <TopBarNumbers className="pr-10 whitespace-nowrap" />
              <TopBarNumbers className="pr-10 whitespace-nowrap" />
            </div>
          </div>
          <div className="hidden items-center justify-end sm:flex">
            <TopBarNumbers />
          </div>
        </Container>
      </div>
      <div className={`transition-colors duration-300 ${isNavbarSolid ? 'bg-white/95' : 'bg-transparent'}`}>
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
                <div className="flex h-16 w-64 shrink-0 items-center justify-start overflow-hidden">
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
                <SellPropertyModalTrigger>
                  {({ open }) => (
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false)
                        open()
                      }}
                      className="rounded-2xl bg-brand-900 px-3 py-2.5 text-left text-sm font-semibold text-white"
                    >
                      Sell my property
                    </button>
                  )}
                </SellPropertyModalTrigger>
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
            <div className="flex h-14 w-52 shrink-0 items-center justify-start overflow-hidden sm:h-20 sm:w-72">
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
          <SellPropertyModalTrigger>
            {({ open }) => (
              <button
                type="button"
                onClick={open}
                className="hidden rounded-full bg-brand-900 px-3 py-1.5 text-sm font-semibold text-white sm:inline-flex"
              >
                Sell my property
              </button>
            )}
          </SellPropertyModalTrigger>
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
      </div>
    </header>
  )
}
