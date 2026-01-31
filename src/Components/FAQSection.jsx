import { useMemo, useState } from 'react'
import { FiChevronDown } from 'react-icons/fi'
import Container from './Container'

export default function FAQSection() {
  const faqs = useMemo(
    () => [
      {
        q: 'What to consider when looking for a property?',
        a: "Consider your budget, the purchase's purpose, the property's requirements, the location, and a renowned agent/broker.",
      },
      {
        q: 'Do agents only help with sightseeing or documentation, too?',
        a: 'As experienced agents, we offer end-to-end solutions, helping you from finding the property to signing the property registry.',
      },
      {
        q: 'Can you help in finding agricultural land?',
        a: 'Yes, we have years of experience in dealing with agricultural land acquisition.',
      },
      {
        q: 'How much do agents charge?',
        a: "The agent's commission depends on various factors involved in the deal. Connect with us, and we will guide you through our transparent and fair pricing policy.",
      },
    ],
    [],
  )

  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section id="faq" className="py-10">
      <Container>
      <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
        <div className="space-y-6">
          <div>
            <div className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">We can address all your doubts and queries precisely.</div>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              FAQS:
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Here are quick answers to the most common questions about buying, renting, and selling.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((item, idx) => {
              const isOpen = idx === openIndex
              return (
                <div
                  key={item.q}
                  className={`overflow-hidden rounded-3xl border ${
                    isOpen ? 'border-slate-900 bg-slate-900' : 'border-slate-200 bg-white'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex((prev) => (prev === idx ? -1 : idx))}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <div className={`text-sm font-semibold ${isOpen ? 'text-white' : 'text-slate-900'}`}>{item.q}</div>
                    <FiChevronDown
                      className={`shrink-0 transition ${
                        isOpen ? 'rotate-180 text-white/80' : 'text-slate-600'
                      }`}
                    />
                  </button>
                  <div className={`${isOpen ? 'block' : 'hidden'} px-5 pb-5 text-sm leading-relaxed ${isOpen ? 'text-white/80' : 'text-slate-600'}`}>
                    {item.a}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-slate-900/10 bg-slate-900/5">
          <img
            className="h-[360px] w-full object-cover sm:h-[420px]"
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
            alt="Luxury home exterior"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-x-5 bottom-5 rounded-3xl bg-white/85 p-5 backdrop-blur">
            <div className="text-sm font-extrabold text-slate-900">Need help choosing a property?</div>
            <div className="mt-1 text-xs font-semibold text-slate-600">
              Get verified listings and expert guidance.
            </div>
          </div>
        </div>
      </div>
      </Container>
    </section>
  )
}
