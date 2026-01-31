import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Container from './Container'

const stats = [
  { label: 'Cases Realised', value: '200k' },
  { label: 'Happy Customers', value: '65k' },
  { label: 'Properties', value: '150k' },
]

export default function TrustedPartnerSection() {
  const navigate = useNavigate()

  return (
    <section className="py-10">
      <Container>
      <div className="rounded-3xl bg-[#f4f1ea] p-6 sm:p-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              Built on trust,
              <br />
              transparency
              <br />
              and experience
            </h2>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.45 }}
              className="mt-6 overflow-hidden rounded-3xl border border-slate-900/10 bg-white/70"
            >
              <img
                className="h-56 w-full object-cover sm:h-64"
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
                alt="Modern luxury home"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4 sm:gap-6">
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                    {s.value}
                  </div>
                  <div className="mt-1 text-[11px] font-semibold text-slate-500">{s.label}</div>
                </div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.45 }}
              className="rounded-3xl bg-slate-900 p-6 text-white sm:p-7"
            >
              <div className="text-lg font-extrabold sm:text-xl">
                Hot-Selling Real Estate Plots And Projects Handpicked For You
              </div>
              <p className="mt-3 text-sm leading-relaxed text-white/75">
                From helping you explore different properties to registering the land, Himanshi Properties does it all with you to make the experience smooth. With 23 years of experience, our primary focus is YOU and YOUR VISION.
              </p>
              <button
                type="button"
                onClick={() => navigate('/properties/search')}
                className="mt-5 inline-flex rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-900"
              >
                Choose Your Property
              </button>
            </motion.div>
          </div>
        </div>
      </div>
      </Container>
    </section>
  )
}
