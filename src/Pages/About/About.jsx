import Navbar from '../../Components/Navbar'
import FooterSection from '../../Components/FooterSection'
import Container from '../../Components/Container'
import ExpertiseSection from '../../Components/ExpertiseSection'
import TestimonialsSection from '../../Components/TestimonialsSection'
import FAQSection from '../../Components/FAQSection'
import TeamConnectSection from '../../Components/TeamConnectSection'
import ContactSection from '../../Components/ContactSection'
import { useEffect } from 'react'

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

export default function About() {
  useEffect(() => {
    const url = `${window.location.origin}/about`
    const title = 'About Himanshi Properties | Trusted Real Estate Guidance'
    const description =
      'Learn about Himanshi Properties and how we help buyers and sellers with verified shortlisting, site visits, negotiations, and documentation support.'
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
        <section className="py-10">
          <Container>
          <div className="grid gap-6 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">About</div>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Himanshi Properties
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-slate-600">
                We work to make your property search easier and tailored to your preferences and budget. From well-connected residential locations to high-growth agricultural properties, finding your dream property has never been easier.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-3xl bg-brand-50 p-4">
                  <div className="text-lg font-extrabold text-slate-900">Quick</div>
                  <div className="mt-1 text-xs font-semibold text-slate-600">Fast deal closures</div>
                </div>
                <div className="rounded-3xl bg-brand-50 p-4">
                  <div className="text-lg font-extrabold text-slate-900">Experienced</div>
                  <div className="mt-1 text-xs font-semibold text-slate-600">23 years of expertise</div>
                </div>
                <div className="rounded-3xl bg-brand-50 p-4">
                  <div className="text-lg font-extrabold text-slate-900">Verified</div>
                  <div className="mt-1 text-xs font-semibold text-slate-600">Carefully shortlisted authentic listings</div>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl bg-brand-900/5">
              <img
                className="h-64 w-full object-cover sm:h-72"
                src="https://images.unsplash.com/photo-1573132223210-d65883b944aa?auto=format&fit=crop&w=1400&q=80"
                alt="Residential buildings in Mumbai, India"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          </Container>
        </section>

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
