import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { FiArrowUpRight, FiMaximize2, FiMessageSquare, FiRefreshCw } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Home Buyer',
    text: 'Smooth experience from shortlisting to final paperwork. The team shared verified options and helped negotiate the best deal.',
    handle: '@priya_sharma',
  },
  {
    name: 'Rahul Verma',
    role: 'Investor',
    text: 'Great market insights and honest advice. The process was transparent and quick, and the property checks saved a lot of time.',
    handle: '@rahulverma',
  },
  {
    name: 'Neha Singh',
    role: 'Tenant',
    text: 'Fast rental support and excellent coordination for site visits. Everything was handled professionally and on time.',
    handle: '@nehasingh',
  },
  {
    name: 'Aman Gupta',
    role: 'Home Seller',
    text: 'Strong marketing and quick follow-ups. The team helped shortlist genuine buyers and handled the documentation smoothly.',
    handle: '@amangupta',
  },
  {
    name: 'Sneha Iyer',
    role: 'First-time Buyer',
    text: 'Clear guidance at every step. From loan support to final registration, everything was explained in simple terms.',
    handle: '@snehaiyer',
  },
]

export default function TestimonialsSection() {
  const trackRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const navigate = useNavigate()

  const scrollToIndex = (index) => {
    const el = trackRef.current
    if (!el) return
    const clamped = Math.max(0, Math.min(index, testimonials.length - 1))
    const card = el.querySelector('[data-testimonial-card="true"]')
    if (!card) return
    const cardWidth = card.getBoundingClientRect().width
    const gap = 16
    el.scrollTo({ left: clamped * (cardWidth + gap), behavior: 'smooth' })
  }

  useEffect(() => {
    const el = trackRef.current
    if (!el) return

    const onScroll = () => {
      const card = el.querySelector('[data-testimonial-card="true"]')
      if (!card) return
      const cardWidth = card.getBoundingClientRect().width
      const gap = 16
      const idx = Math.round(el.scrollLeft / (cardWidth + gap))
      setActiveIndex(Math.max(0, Math.min(idx, testimonials.length - 1)))
    }

    onScroll()
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section className="mx-auto max-w-[1400px] px-3 py-10 sm:px-6 lg:px-10">
      <div className="text-center">
        <div className="text-xs font-semibold tracking-wide text-slate-500">Testimonial</div>
        <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Transformative Client Experiences
        </h2>
      </div>

      <div className="relative mt-6">
        <div
          ref={trackRef}
          className="hide-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden scroll-smooth pb-2"
        >
          {testimonials.map((t, idx) => (
            <motion.div
              key={`${t.name}-${t.role}`}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.35, delay: idx * 0.04 }}
              data-testimonial-card="true"
              className="shrink-0 snap-start rounded-3xl border border-slate-200 bg-white p-6 w-[78%] sm:w-[46%] lg:w-[32%]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-slate-400">
                  <FiMessageSquare className="text-xl" />
                </div>
              </div>

              <p className="mt-5 text-base font-semibold leading-relaxed text-slate-700">{t.text}</p>

              <div className="mt-6 flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="h-10 w-10 overflow-hidden rounded-full bg-slate-200" aria-hidden="true" />
                  <div className="text-sm font-extrabold text-slate-900">{t.name}</div>
                  <div className="text-xs font-semibold text-slate-500">{t.handle}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => navigate('/properties/search')}
          className="inline-flex items-center gap-2 text-sm font-extrabold text-slate-900"
        >
          <FiArrowUpRight className="text-base" />
          Visit site
        </button>

        <div className="flex items-center justify-center gap-2">
          {[0, 1, 2].map((i) => {
            const isActive = i === (activeIndex % 3)
            return (
              <button
                key={i}
                type="button"
                onClick={() => scrollToIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1.5 rounded-full transition ${isActive ? 'w-8 bg-slate-900' : 'w-5 bg-slate-300'}`}
              />
            )
          })}
        </div>

        <div className="flex items-center gap-3 text-slate-900">
          <button type="button" aria-label="Reset" onClick={() => scrollToIndex(0)} className="text-xl">
            <FiRefreshCw />
          </button>
          <button
            type="button"
            aria-label="Expand"
            onClick={() => trackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
            className="text-xl"
          >
            <FiMaximize2 />
          </button>
        </div>
      </div>
    </section>
  )
}
