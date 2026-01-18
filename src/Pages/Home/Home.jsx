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
import { getProperties } from '../../api/properties'

export default function Home() {
  const [properties, setProperties] = useState([])

  useEffect(() => {
    let isMounted = true
    getProperties()
      .then((list) => {
        if (!isMounted) return
        setProperties(Array.isArray(list) ? list : [])
      })
      .catch(() => {
        if (!isMounted) return
        setProperties([])
      })
    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <TrySearchCitiesSection />
        <QuickSearchSection />
        <FeaturedPropertiesSection properties={properties} />
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

