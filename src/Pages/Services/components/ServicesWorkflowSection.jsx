import { motion } from 'framer-motion'
import Container from '../../../Components/Container'
import { STEPS } from './servicesContent'

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

export default function ServicesWorkflowSection() {
  return (
    <section className="py-6 md:py-10">
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
  )
}
