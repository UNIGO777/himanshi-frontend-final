import { useEffect } from 'react'
import Navbar from '../../Components/Navbar'
import FooterSection from '../../Components/FooterSection'
import ExpertiseSection from '../../Components/ExpertiseSection'
import TestimonialsSection from '../../Components/TestimonialsSection'
import FAQSection from '../../Components/FAQSection'
import TeamConnectSection from '../../Components/TeamConnectSection'
import ContactSection from '../../Components/ContactSection'
import ServicesHeroSection from './components/ServicesHeroSection'
import ServicesIncludesSection from './components/ServicesIncludesSection'
import ServicesWorkflowSection from './components/ServicesWorkflowSection'
import SellPropertySection from './components/SellPropertySection'

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

export default function Services() {
  useEffect(() => {
    const url = `${window.location.origin}/services`
    const title = 'Real Estate Services | Himanshi Properties'
    const description =
      'From verified shortlisting and site visits to negotiations and documentation, explore the services offered by Himanshi Properties for buyers and sellers.'
    document.title = title
    upsertCanonical(url)
    upsertMeta({ name: 'description' }, description)
    upsertMeta({ property: 'og:title' }, title)
    upsertMeta({ property: 'og:description' }, description)
    upsertMeta({ property: 'og:url' }, url)
    upsertMeta({ name: 'twitter:title' }, title)
    upsertMeta({ name: 'twitter:description' }, description)
  }, [])

  return (
    <div className="min-h-screen bg-brand-50">
      <Navbar />
      <main>
        <ServicesHeroSection />
        <ServicesIncludesSection />
        <ServicesWorkflowSection />

        <SellPropertySection />
        <ExpertiseSection />
        <TestimonialsSection />
        <FAQSection />
        <TeamConnectSection />
        <ContactSection />
      </main>
      <FooterSection />
    </div>
  )
}
