import { motion } from 'framer-motion'
import { FiCheck } from 'react-icons/fi'
import Container from '../../../Components/Container'
import { SERVICES } from './servicesContent'

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

export default function ServicesIncludesSection() {
  return (
    <section className="py-6 md:py-10">
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
  )
}
