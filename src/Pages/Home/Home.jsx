import Navbar from '../../Components/Navbar'
import HeroSection from '../../Components/HeroSection'
import TrySearchCitiesSection from '../../Components/TrySearchCitiesSection'
import QuickSearchSection from '../../Components/QuickSearchSection'
import FeaturedPropertiesSection from '../../Components/FeaturedPropertiesSection'
import TrustedPartnerSection from '../../Components/TrustedPartnerSection'
import ServicesHighlightsSection from '../../Components/ServicesHighlightsSection'
import ExpertiseSection from '../../Components/ExpertiseSection'
import DreamPropertyShowcaseSection from '../../Components/DreamPropertyShowcaseSection'
import TestimonialsSection from '../../Components/TestimonialsSection'
import FAQSection from '../../Components/FAQSection'
import TeamConnectSection from '../../Components/TeamConnectSection'
import ContactSection from '../../Components/ContactSection'
import FooterSection from '../../Components/FooterSection'
import { useEffect, useState } from 'react'
import { getFeaturedProperties, getProperties } from '../../api/properties'
import { BuySellEnquiryModalTrigger } from '../../Components/BuySellEnquiryModal'

function upsertMeta({ name, property }, content) {
  if (typeof document === 'undefined') return
  const key = name ? `meta[name="${name}"]` : `meta[property="${property}"]`
  let el = document.querySelector(key)
  if (!el) {
    el = document.createElement('meta')
    if (name) el.setAttribute('name', name)
    if (property) el.setAttribute('property', property)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertCanonical(href) {
  if (typeof document === 'undefined') return
  let el = document.querySelector('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

function EnquiryAutoOpenInner({ open }) {
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      open('buy')
    }, 3000)
    return () => window.clearTimeout(timeoutId)
  }, [open])

  return null
}

function EnquiryAutoOpen() {
  return (
    <BuySellEnquiryModalTrigger>
      {({ open }) => <EnquiryAutoOpenInner open={open} />}
    </BuySellEnquiryModalTrigger>
  )
}

export default function Home() {
  const [properties, setProperties] = useState([])
  const [featuredProperties, setFeaturedProperties] = useState([])

  useEffect(() => {
    const url = `${window.location.origin}/`
    const title = 'Himanshi Properties | Buy, Sell & Rent Properties in India'
    const description =
      'Himanshi Properties helps you buy, sell, and rent verified properties across India. Explore listings, compare locations, and connect with experts for site visits and documentation.'
    document.title = title
    upsertCanonical(url)
    upsertMeta({ name: 'description' }, description)
    upsertMeta({ property: 'og:title' }, title)
    upsertMeta({ property: 'og:description' }, description)
    upsertMeta({ property: 'og:url' }, url)
    upsertMeta({ name: 'twitter:title' }, title)
    upsertMeta({ name: 'twitter:description' }, description)
  }, [])

  useEffect(() => {
    let isMounted = true
    Promise.allSettled([getProperties(), getFeaturedProperties({ limit: 6 })]).then(([allResult, featuredResult]) => {
      if (!isMounted) return
      setProperties(allResult.status === 'fulfilled' && Array.isArray(allResult.value) ? allResult.value : [])
      setFeaturedProperties(
        featuredResult.status === 'fulfilled' && Array.isArray(featuredResult.value) ? featuredResult.value : [],
      )
    })
    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="min-h-screen">
      <EnquiryAutoOpen />
      <Navbar />
      <main>
        <HeroSection />
        <TrySearchCitiesSection />
        <QuickSearchSection />
        <FeaturedPropertiesSection properties={featuredProperties} />
        <TrustedPartnerSection />
        <ServicesHighlightsSection />
        <ExpertiseSection />
        <DreamPropertyShowcaseSection properties={properties} />
        <TestimonialsSection />
        <FAQSection />
        <TeamConnectSection />
        <ContactSection />
      </main>
      <FooterSection />
    </div>
  )
}
