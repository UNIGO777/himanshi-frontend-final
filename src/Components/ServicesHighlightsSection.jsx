import { motion } from 'framer-motion'
import { FiArrowUpRight, FiSearch } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

export default function ServicesHighlightsSection() {
  const navigate = useNavigate()

  return (
    <section className="mx-auto max-w-[1400px] px-3 py-10 sm:px-6 lg:px-10">
      <div className="text-center">
        <div className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          All Your Content, In One Place
        </div>
        <p className="mt-2 text-sm font-semibold text-slate-500">
          Making it an ideal choice for renting a home.
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
            <div className="overflow-hidden rounded-3xl bg-slate-900/5">
              <img
                className="h-48 w-full object-cover sm:h-56"
                src="https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1400&q=80"
                alt="Property insurance"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="text-left">
              <div className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
                Property Insurance
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Your home is often the largest investment. We ensure you&#39;re covered for the unexpected.
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
                Lowest Commission
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                We offer competitive fees to provide our clients with a premium selling experience.
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
                src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=900&q=80"
                alt=""
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
            className="relative flex min-h-[280px] flex-col justify-between overflow-hidden rounded-3xl bg-gray-900 p-5 text-white sm:p-6"
          >
            <div className="text-left">
              <div className="text-xl font-extrabold tracking-tight sm:text-2xl">Tax Advantage</div>
              <p className="mt-3 text-sm leading-relaxed text-white/85">
                We stand by the buyer, so we advise you and your home buying costs so we can give you the solution.
              </p>
            </div>

            <div className="mt-6 flex items-end justify-between gap-6">
              <img
                className="h-24 w-40 object-cover opacity-95 sm:h-28 sm:w-48"
                src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80"
                alt=""
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
    </section>
  )
}
