import { motion } from 'framer-motion'
import { FiArrowUpRight, FiSearch } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import Container from './Container'

export default function ServicesHighlightsSection() {
  const navigate = useNavigate()

  return (
    <section className="py-10">
      <Container>
      <div className="text-center">
        <div className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          Everything you need for a smooth deal closure
        </div>
        <p className="mt-2 text-sm font-semibold text-slate-500">
          Bhopal Land Experts: Seamless Land Deals With No Hassles
        </p>
      </div>

      <div className="mt-8 w-full rounded-3xl border border-slate-900/10 bg-white/70 p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.4 }}
          className="overflow-hidden rounded-3xl border border-slate-900/10 bg-white/80"
        >
          <div className="grid items-center gap-6 p-5 sm:p-6 md:grid-cols-2">
            <div className="overflow-hidden rounded-3xl bg-brand-900/5">
              <img
                className="h-48 w-full object-cover sm:h-56"
                src="https://images.unsplash.com/photo-1758210784345-96fc36926234?auto=format&fit=crop&w=1400&q=80"
                alt="Modern residential building in Gurugram, India"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="text-left">
              <div className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
                Property Insurance
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                We provide coverage for your property to protect your significant investment.
              </p>
            </div>
          </div>
        </motion.div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="flex min-h-[280px] flex-col justify-between overflow-hidden rounded-3xl border border-slate-900/10 bg-white/80 p-5 sm:p-6"
          >
            <div className="text-left">
              <div className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
               Legal support
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
               Our team handles all the legalities involved in the documentation of properties
              </p>
            </div>
            <div className="mt-6 flex items-end justify-between gap-6">
              <button
                type="button"
                onClick={() => navigate('/services')}
                className="inline-flex items-center gap-2 text-lg font-extrabold text-slate-900"
              >
                <FiArrowUpRight className="text-xl" />
                Visit site
              </button>
              <img
                className="h-24 w-28 object-contain opacity-90 sm:h-28 sm:w-32"
                src="https://images.unsplash.com/photo-1735547876935-7be80eae1c88?auto=format&fit=crop&w=900&q=80"
                alt="House keys"
                aria-hidden="true"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="relative flex min-h-[280px] flex-col justify-between overflow-hidden rounded-3xl bg-brand-900 p-5 text-white sm:p-6"
          >
            <div className="text-left">
              <div className="text-xl font-extrabold tracking-tight sm:text-2xl">Transparent pricing</div>
              <p className="mt-3 text-sm leading-relaxed text-white/85">
               From brokerage to commission, we believe in communicating everything clearly.
              </p>
            </div>

            <div className="mt-6 flex items-end justify-between gap-6">
              <img
                className="h-24 w-40 object-cover opacity-95 sm:h-28 sm:w-48"
                src="https://images.unsplash.com/photo-1706543441691-431be00ed3da?auto=format&fit=crop&w=1200&q=80"
                alt="Residential township skyline in Mumbai, India"
                aria-hidden="true"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <button
                type="button"
                aria-label="Open"
                onClick={() => navigate('/properties/search')}
                className="grid h-12 w-12 place-items-center rounded-full bg-white/85 text-slate-900"
              >
                <FiSearch className="text-lg" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
      </Container>
    </section>
  )
}
