import { motion } from 'framer-motion'
import Container from '../../../Components/Container'

function StatPill({ value, label }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/10 p-4">
      <div className="text-xl font-extrabold text-white">{value}</div>
      <div className="mt-1 text-xs font-semibold text-white/70">{label}</div>
    </div>
  )
}

export default function ServicesHeroSection() {
  return (
    <section className="py-6 md:py-10">
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
  )
}
