import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { FiCheck, FiCheckCircle, FiFileText, FiHome, FiKey, FiPieChart, FiSearch, FiShield, FiTrendingUp, FiUsers } from 'react-icons/fi'
import Navbar from '../../Components/Navbar'
import FooterSection from '../../Components/FooterSection'
import Container from '../../Components/Container'
import ExpertiseSection from '../../Components/ExpertiseSection'
import TestimonialsSection from '../../Components/TestimonialsSection'
import FAQSection from '../../Components/FAQSection'
import TeamConnectSection from '../../Components/TeamConnectSection'
import ContactSection from '../../Components/ContactSection'

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

const SERVICES = [
  {
    title: 'Verified Shortlisting',
    description: 'We narrow down options depending on your requirements.',
    icon: FiSearch,
    points: ['Relevant property match', 'Quick shortlisting', 'Clear communication about pricing'],
  },
  {
    title: 'Site Visits',
    description: 'Our team sets up coordinated site visits for all properties.',
    icon: FiHome,
    points: ['Accompanied by agents', 'Neighbourhood tour included', 'Flexible timings for visits'],
  },
  {
    title: 'Negotiations',
    description: 'We do in-depth market price evaluation for strategic negotiation.',
    icon: FiPieChart,
    points: ['Clear cost breakdown', 'Complete support', 'Expert market assessment'],
  },
  {
    title: 'Third Party Property Listing',
    description: 'We help you list and promote your property through trusted third-party channels.',
    icon: FiTrendingUp,
    points: ['Wider visibility', 'Qualified buyer leads', 'Support with listing details'],
  },
  {
    title: 'Documentation Help',
    description: 'End to end support for all paperwork and legalities.',
    icon: FiFileText,
    points: ['Compliance with legal systems', 'Smooth process explanations', 'Defined timelines'],
  },
  {
    title: 'Safe & Transparent Process',
    description: 'Guidance with a structured process for faster closures.',
    icon: FiShield,
    points: ['Transparency on top', 'Timely process updates', 'Verified stakeholders involved'],
  },
  {
    title: 'Move-in / Handover',
    description: 'Move-in support to seal the deal smoothly.',
    icon: FiKey,
    points: ['Quick access transfers', 'Communication about societal conditions', 'Post-deal support'],
  },
]

const STEPS = [
  {
    title: 'Communicate your preferences',
    description: 'Tell us about your budget, preferred location and any other requirements for the property.',
    icon: FiUsers,
  },
  {
    title: 'Shortlisting and sightseeing',
    description: 'We do a quick property match and schedule property tours.',
    icon: FiHome,
  },
  {
    title: 'Negotiations to close the deal',
    description: 'Our team confidently negotiates to get a fair price.',
    icon: FiCheckCircle,
  },
  {
    title: 'Document and moving in',
    description: 'We will handle all legalities while you prepare yourself for moving in.',
    icon: FiFileText,
  },
]

function StatPill({ value, label }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/10 p-4">
      <div className="text-xl font-extrabold text-white">{value}</div>
      <div className="mt-1 text-xs font-semibold text-white/70">{label}</div>
    </div>
  )
}

function ServiceCard({ title, description, icon: Icon, points, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      className="group relative min-h-[270px] overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <div className="absolute -right-14 -top-14 h-48 w-48 rounded-full bg-brand-900/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-brand-900/10 blur-3xl" />
      </div>

      <div className="relative">
        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white shadow-sm ring-1 ring-slate-900/10">
            <Icon className="text-2xl text-slate-900" />
          </div>
          <div className="min-w-0">
            <div className="text-lg font-extrabold tracking-tight text-slate-900">{title}</div>
            <div className="mt-1 text-sm font-semibold text-slate-600">{description}</div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {points.map((p) => (
            <div
              key={p}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-extrabold text-slate-700"
            >
              <div className="grid h-5 w-5 place-items-center rounded-full bg-brand-900 text-white">
                <FiCheck className="text-sm" />
              </div>
              <div className="font-extrabold text-slate-700">{p}</div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

function StepCard({ title, description, icon: Icon, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand-900/10 blur-3xl" />
      </div>

      <div className="relative">
        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-3xl bg-brand-900/5 text-slate-900">
            <Icon className="text-xl" />
          </div>
          <div className="min-w-0">
            <div className="text-base font-extrabold tracking-tight text-slate-900">{title}</div>
            <div className="mt-1 text-sm font-semibold text-slate-600">{description}</div>
          </div>
        </div>

        <div className="mt-5 inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-extrabold text-slate-700">
          Step {String(index + 1).padStart(2, '0')}
        </div>
      </div>
    </motion.div>
  )
}

function SellPropertySection() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    city: '',
    propertyType: '',
    expectedPrice: '',
    message: '',
  })
  const [status, setStatus] = useState('')

  const buildMessage = () => {
    const cleanName = form.name.trim()
    const cleanPhone = form.phone.trim()
    const cleanCity = form.city.trim()
    const cleanType = form.propertyType.trim()
    const cleanPrice = form.expectedPrice.trim()
    const cleanMessage = form.message.trim()

    return (
      `Sell Property Enquiry\n\n` +
      `Name: ${cleanName}\n` +
      `Phone: ${cleanPhone}\n` +
      `City: ${cleanCity}\n` +
      `Property Type: ${cleanType}\n` +
      `Expected Price: ${cleanPrice}\n\n` +
      `Details:\n${cleanMessage}\n`
    )
  }

  const validate = () => {
    const cleanName = form.name.trim()
    const cleanPhone = form.phone.trim()
    if (!cleanName || !cleanPhone) {
      setStatus('Please enter your name and phone number.')
      return false
    }
    return true
  }

  const onWhatsApp = () => {
    if (!validate()) return
    const text = buildMessage()
    window.open(`https://wa.me/919000000000?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer')
    setStatus('Opening WhatsApp…')
  }

  const onEmail = () => {
    if (!validate()) return
    const subject = encodeURIComponent('Sell property enquiry')
    const body = encodeURIComponent(buildMessage())
    window.location.href = `mailto:hello@himanshiproperties.com?subject=${subject}&body=${body}`
    setStatus('Opening email app…')
  }

  return (
    <section className="py-10">
      <Container>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
        <div className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">Sell your property</div>
        <div className="mt-1 text-sm font-semibold text-slate-600">
          Share basic details and we’ll reach out with the next steps.
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2 lg:items-start">
          <div className="grid gap-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                value={form.name}
                onChange={(e) => {
                  setForm((cur) => ({ ...cur, name: e.target.value }))
                  if (status) setStatus('')
                }}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                placeholder="Full name"
              />
              <input
                value={form.phone}
                onChange={(e) => {
                  setForm((cur) => ({ ...cur, phone: e.target.value }))
                  if (status) setStatus('')
                }}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                placeholder="Phone number"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <input
                value={form.city}
                onChange={(e) => {
                  setForm((cur) => ({ ...cur, city: e.target.value }))
                  if (status) setStatus('')
                }}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                placeholder="City"
              />
              <input
                value={form.propertyType}
                onChange={(e) => {
                  setForm((cur) => ({ ...cur, propertyType: e.target.value }))
                  if (status) setStatus('')
                }}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                placeholder="Property type (Apartment/Villa/Land...)"
              />
            </div>

            <input
              value={form.expectedPrice}
              onChange={(e) => {
                setForm((cur) => ({ ...cur, expectedPrice: e.target.value }))
                if (status) setStatus('')
              }}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
              placeholder="Expected price (optional)"
            />

            <textarea
              value={form.message}
              onChange={(e) => {
                setForm((cur) => ({ ...cur, message: e.target.value }))
                if (status) setStatus('')
              }}
              className="min-h-28 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
              placeholder="Location, size, ownership type, and any other details..."
            />

            {!!status && <div className="text-xs font-semibold text-slate-600">{status}</div>}
          </div>

          <div className="rounded-3xl bg-brand-50 p-6">
            <div className="text-sm font-extrabold text-slate-900">Send your query</div>
            <div className="mt-2 text-sm font-semibold text-slate-600">
              Choose WhatsApp for a quick response, or email for detailed documents.
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={onWhatsApp}
                className="rounded-2xl bg-brand-900 px-5 py-3 text-sm font-extrabold text-white"
              >
                Send on WhatsApp
              </button>
              <button
                type="button"
                onClick={onEmail}
                className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-extrabold text-slate-800"
              >
                Send on Email
              </button>
            </div>
          </div>
        </div>
      </div>
      </Container>
    </section>
  )
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
        <section className="py-10">
          <Container>
          <div className="overflow-hidden rounded-3xl bg-brand-900">
            <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-12 lg:items-center">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="lg:col-span-7"
              >
                <div className="text-xs font-bold uppercase tracking-[0.22em] text-white/70">Services</div>
                <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
Property investments that deserve comprehensive support. 
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/70">
                  The journey from the first visit to the final registration is all made easy and stress-free!
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <StatPill value="Premium locations" label="High-growth property locations
" />
                  <StatPill value="Guided" label="Step-by-step assistance" />
                  <StatPill value="Transparent" label=" Crystal clear communications" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 }}
                className="relative overflow-hidden rounded-3xl bg-white/10 lg:col-span-5"
              >
                <img
                  className="h-64 w-full object-cover opacity-90 sm:h-72"
                  src="https://images.unsplash.com/photo-1706543441691-431be00ed3da?auto=format&fit=crop&w=1400&q=80"
                  alt="Residential township in Mumbai, India"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/60 via-slate-900/10 to-transparent" />
              </motion.div>
            </div>
          </div>
          </Container>
        </section>

        <section className="py-10">
          <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">What our services include</div>
              <div className="mt-1 text-sm font-semibold text-slate-600">
                Buy, sell and rent with our guidance.
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s, idx) => (
              <ServiceCard
                key={s.title}
                title={s.title}
                description={s.description}
                icon={s.icon}
                points={s.points}
                index={idx}
              />
            ))}
          </div>
          </Container>
        </section>

        <section className="py-10">
          <Container>
          <div className="rounded-3xl border border-slate-200 bg-brand-50 p-6 sm:p-8">
            <div className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">How do we get it done?</div>
            <div className="mt-1 text-sm font-semibold text-slate-600">
              We follow an organised workflow for your property dreams.
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((step, idx) => (
                <StepCard
                  key={step.title}
                  title={step.title}
                  description={step.description}
                  icon={step.icon}
                  index={idx}
                />
              ))}
            </div>
          </div>
          </Container>
        </section>

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
