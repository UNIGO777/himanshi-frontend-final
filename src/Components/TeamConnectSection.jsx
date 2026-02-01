import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Container from './Container'

const team = [
  {
    name: 'Himanshi',
    role: 'Property Consultant',
    image:
      'https://images.unsplash.com/photo-1677575491741-46c1a8915815?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Aarav',
    role: 'Sales Specialist',
    image:
      'https://images.unsplash.com/photo-1694871420538-b40db58ae5af?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Meera',
    role: 'Customer Success',
    image:
      'https://images.unsplash.com/photo-1757351122515-21a7b61d682e?auto=format&fit=crop&w=1200&q=80',
  },
]

export default function TeamConnectSection() {
  const onWhatsApp = () => {
    window.open('https://wa.me/919000000000', '_blank', 'noopener,noreferrer')
  }

  return (
    <section className="py-10">
      <Container>
      <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
        <div>
          <div className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">Meet our team</div>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Let your property discussions begin!
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
           Talk with our experts, get honest advice and schedule your property visits to lock your dream property.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/#contact" className="rounded-2xl bg-brand-900 px-5 py-3 text-sm font-semibold text-white">
              Book a Call
            </Link>
            <button
              type="button"
              onClick={onWhatsApp}
              className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700"
            >
              WhatsApp
            </button>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {team.map((m, idx) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.35, delay: idx * 0.06 }}
              className="overflow-hidden rounded-3xl border border-slate-200 bg-white"
            >
              <img src={m.image} alt={m.name} className="h-28 w-full object-cover sm:h-32" loading="lazy" />
              <div className="p-3">
                <div className="text-sm font-bold text-slate-900">{m.name}</div>
                <div className="text-xs text-slate-500">{m.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      </Container>
    </section>
  )
}
