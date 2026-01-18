import { motion } from 'framer-motion'
import { FiBarChart2, FiHome, FiKey, FiMapPin } from 'react-icons/fi'

const expertise = [
  { title: 'Local Insights', description: 'Know the best areas to invest and live.', icon: FiMapPin },
  { title: 'Verified Listings', description: 'Quality checks for clear decision making.', icon: FiHome },
  { title: 'Rental Support', description: 'From viewing to agreement, end-to-end help.', icon: FiKey },
  { title: 'Market Trends', description: 'Smart pricing guidance backed by data.', icon: FiBarChart2 },
]

export default function ExpertiseSection() {
  return (
    <section className="bg-slate-950 py-12">
      <div className="mx-auto max-w-[1400px] px-3 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">Expertise</div>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Make confident property decisions
            </h2>
          </div>
          <button type="button" className="w-fit rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-900">
            Explore expertise
          </button>
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {expertise.map((e, index) => {
            const Icon = e.icon
            return (
              <motion.div
                key={e.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                className="rounded-3xl border border-white/10 bg-white/5 p-5 text-white"
              >
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10">
                  <Icon />
                </div>
                <div className="mt-4 text-sm font-bold">{e.title}</div>
                <div className="mt-2 text-xs leading-relaxed text-white/70">{e.description}</div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
