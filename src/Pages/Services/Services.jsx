import { motion } from 'framer-motion'
import { FiCheck, FiCheckCircle, FiFileText, FiHome, FiKey, FiPieChart, FiSearch, FiShield, FiUsers } from 'react-icons/fi'
import Navbar from '../../Components/Navbar'
import FooterSection from '../../Components/FooterSection'
import ExpertiseSection from '../../Components/ExpertiseSection'
import TestimonialsSection from '../../Components/TestimonialsSection'
import FAQSection from '../../Components/FAQSection'
import TeamConnectSection from '../../Components/TeamConnectSection'
import ContactSection from '../../Components/ContactSection'

const SERVICES = [
  {
    title: 'Verified Shortlisting',
    description: 'We filter options based on budget, location, and priorities.',
    icon: FiSearch,
    points: ['Verified listings', 'Clear pricing guidance', 'Fast matching options'],
  },
  {
    title: 'Site Visits & Scheduling',
    description: 'Hassle-free visit planning with location and time coordination.',
    icon: FiHome,
    points: ['Shortlist-based visits', 'Neighborhood insights', 'On-spot comparisons'],
  },
  {
    title: 'Negotiation Support',
    description: 'We help you negotiate confidently with market context.',
    icon: FiPieChart,
    points: ['Market rate checks', 'Offer strategy', 'Terms & inclusions'],
  },
  {
    title: 'Documentation Help',
    description: 'Assistance with paperwork, verification, and next steps.',
    icon: FiFileText,
    points: ['Agreement support', 'Document checklist', 'Process guidance'],
  },
  {
    title: 'Safe & Transparent Process',
    description: 'A simple flow with clarity at every stage of the journey.',
    icon: FiShield,
    points: ['No hidden surprises', 'Clear timelines', 'Verified partners'],
  },
  {
    title: 'Move-in / Handover',
    description: 'Support for keys, handover, and final checks.',
    icon: FiKey,
    points: ['Handover checklist', 'Final walkthrough', 'Utility guidance'],
  },
]

const STEPS = [
  {
    title: 'Tell us your needs',
    description: 'Share budget, preferred areas, and must-have features.',
    icon: FiUsers,
  },
  {
    title: 'Shortlist & visit',
    description: 'We shortlist options and schedule site visits quickly.',
    icon: FiHome,
  },
  {
    title: 'Negotiate & finalize',
    description: 'We help you negotiate and confirm terms confidently.',
    icon: FiCheckCircle,
  },
  {
    title: 'Documentation & move-in',
    description: 'We support paperwork and smooth handover.',
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
        <div className="absolute -right-14 -top-14 h-48 w-48 rounded-full bg-slate-900/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-slate-900/10 blur-3xl" />
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
              <div className="grid h-5 w-5 place-items-center rounded-full bg-slate-900 text-white">
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
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-slate-900/10 blur-3xl" />
      </div>

      <div className="relative">
        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-3xl bg-slate-900/5 text-slate-900">
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

export default function Services() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <section className="mx-auto max-w-[1400px] px-3 py-10 sm:px-6 lg:px-10">
          <div className="overflow-hidden rounded-3xl bg-slate-900">
            <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-12 lg:items-center">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="lg:col-span-7"
              >
                <div className="text-xs font-bold uppercase tracking-[0.22em] text-white/70">Services</div>
                <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  End-to-end property support, made simple
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/70">
                  Shortlisting, visits, negotiation, and documentation — we help you move faster with a transparent, guided process.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <StatPill value="Verified" label="Quality options only" />
                  <StatPill value="Fast" label="Quick shortlists" />
                  <StatPill value="Clear" label="Transparent support" />
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
                  src="https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=1400&q=80"
                  alt="Services"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/60 via-slate-900/10 to-transparent" />
              </motion.div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1400px] px-3 py-10 sm:px-6 lg:px-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">What we do</div>
              <div className="mt-1 text-sm font-semibold text-slate-600">
                Services designed for buying, renting, and selling — with support at each step.
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
        </section>

        <section className="mx-auto max-w-[1400px] px-3 py-10 sm:px-6 lg:px-10">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
            <div className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">How it works</div>
            <div className="mt-1 text-sm font-semibold text-slate-600">
              A simple, step-by-step flow to help you make the right decision.
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
