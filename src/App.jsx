import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useEffect, useLayoutEffect } from 'react'
import Home from './Pages/Home/Home'
import Profile from './Pages/Profile/Profile'
import PropertyDetails from './Pages/PropertyDetails/PropertyDetails'
import Wishlist from './Pages/Wishlist/Wishlist'
import { WishlistProvider } from './context/WishlistProvider'
import Login from './Pages/Login/Login'
import Signup from './Pages/Signup/Signup'
import About from './Pages/About/About'
import Services from './Pages/Services/Services'
import Listings from './Pages/Listings/Listings'
import PrivacyPolicy from './Pages/PrivacyPolicy/PrivacyPolicy'
import { AuthProvider } from './context/AuthProvider'
import useAuth from './hooks/useAuth'
import WhatsAppFloatingButton from './Components/WhatsAppFloatingButton'
import { SellPropertyModalProvider } from './Components/SellPropertyModal'
import { BuySellEnquiryModalProvider } from './Components/BuySellEnquiryModal'

function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <BrowserRouter>
          <SellPropertyModalProvider>
            <BuySellEnquiryModalProvider>
              <ScrollToHash />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/listings" element={<Navigate to="/properties" replace />} />
                <Route path="/properties" element={<Listings />} />
                <Route path="/properties/search" element={<Listings />} />
                <Route path="/properties-in/:citySlug" element={<Listings />} />
                <Route path="/services" element={<Services />} />
                <Route path="/about" element={<About />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route
                  path="/profile"
                  element={
                    <RequireAuth>
                      <Profile />
                    </RequireAuth>
                  }
                />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/property/:propertyId" element={<PropertyDetails />} />
                <Route path="*" element={<FallbackRoute />} />
              </Routes>
              <WhatsAppFloatingButton />
            </BuySellEnquiryModalProvider>
          </SellPropertyModalProvider>
        </BrowserRouter>
      </WishlistProvider>
    </AuthProvider>
  )
}

function ScrollToHash() {
  const location = useLocation()

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!('scrollRestoration' in window.history)) return
    const prev = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'
    return () => {
      window.history.scrollRestoration = prev
    }
  }, [])

  useLayoutEffect(() => {
    const hash = location.hash
    if (hash && hash.length >= 2) {
      const id = hash.slice(1)
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [location.hash, location.pathname, location.search])

  return null
}

function FallbackRoute() {
  const location = useLocation()
  if (location.pathname.startsWith('/properties-in-')) {
    return <Listings />
  }
  return <Navigate to="/" replace />
}

function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  return children
}

export default App
