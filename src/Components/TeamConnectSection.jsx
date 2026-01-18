import { motion } from 'framer-motion'

const team = [
  {
    name: 'Himanshi',
    role: 'Property Consultant',
    image:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Aarav',
    role: 'Sales Specialist',
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Meera',
    role: 'Customer Success',
    image:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80',
  },
]

export default function TeamConnectSection() {
  return (
    <section className="mx-auto max-w-[1400px] px-3 py-10 sm:px-6 lg:px-10">
      <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
        <div>
          <div className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">Connect with our team</div>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Talk to an expert today
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Get tailored recommendations, schedule visits, and make confident decisions with support from our
            experts.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white">
              Book a Call
            </button>
            <button type="button" className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700">
              WhatsApp
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
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
    </section>
  )
}
