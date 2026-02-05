import { useState } from 'react'
import Container from '../../../Components/Container'

export default function SellPropertySection() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    city: '',
    propertyType: '',
    expectedPrice: '',
    message: '',
  })
  const [status, setStatus] = useState('')

  const buildMessage = () => {
    const cleanName = form.name.trim()
    const cleanPhone = form.phone.trim()
    const cleanCity = form.city.trim()
    const cleanType = form.propertyType.trim()
    const cleanPrice = form.expectedPrice.trim()
    const cleanMessage = form.message.trim()

    return (
      `Sell Property Enquiry\n\n` +
      `Name: ${cleanName}\n` +
      `Phone: ${cleanPhone}\n` +
      `City: ${cleanCity}\n` +
      `Property Type: ${cleanType}\n` +
      `Expected Price: ${cleanPrice}\n\n` +
      `Details:\n${cleanMessage}\n`
    )
  }

  const validate = () => {
    const cleanName = form.name.trim()
    const cleanPhone = form.phone.trim()
    if (!cleanName || !cleanPhone) {
      setStatus('Please enter your name and phone number.')
      return false
    }
    return true
  }

  const onWhatsApp = () => {
    if (!validate()) return
    const text = buildMessage()
    window.open(`https://wa.me/919111111397?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer')
    setStatus('Opening WhatsApp…')
  }

  const onEmail = () => {
    if (!validate()) return
    const subject = encodeURIComponent('Sell property enquiry')
    const body = encodeURIComponent(buildMessage())
    window.location.href = `mailto:Contact@himanshiproperties.com?subject=${subject}&body=${body}`
    setStatus('Opening email app…')
  }

  return (
    <section className="py-6 md:py-10">
      <Container>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
          <div className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">Sell your property</div>
          <div className="mt-1 text-sm font-semibold text-slate-600">
            Share basic details and we’ll reach out with the next steps.
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2 lg:items-start">
            <div className="grid gap-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  value={form.name}
                  onChange={(e) => {
                    setForm((cur) => ({ ...cur, name: e.target.value }))
                    if (status) setStatus('')
                  }}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                  placeholder="Full name"
                />
                <input
                  value={form.phone}
                  onChange={(e) => {
                    setForm((cur) => ({ ...cur, phone: e.target.value }))
                    if (status) setStatus('')
                  }}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                  placeholder="Phone number"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  value={form.city}
                  onChange={(e) => {
                    setForm((cur) => ({ ...cur, city: e.target.value }))
                    if (status) setStatus('')
                  }}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                  placeholder="City"
                />
                <input
                  value={form.propertyType}
                  onChange={(e) => {
                    setForm((cur) => ({ ...cur, propertyType: e.target.value }))
                    if (status) setStatus('')
                  }}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                  placeholder="Property type (Apartment/Villa/Land...)"
                />
              </div>

              <input
                value={form.expectedPrice}
                onChange={(e) => {
                  setForm((cur) => ({ ...cur, expectedPrice: e.target.value }))
                  if (status) setStatus('')
                }}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                placeholder="Expected price (optional)"
              />

              <textarea
                value={form.message}
                onChange={(e) => {
                  setForm((cur) => ({ ...cur, message: e.target.value }))
                  if (status) setStatus('')
                }}
                className="min-h-28 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                placeholder="Location, size, ownership type, and any other details..."
              />

              {!!status && <div className="text-xs font-semibold text-slate-600">{status}</div>}
            </div>

            <div className="rounded-3xl bg-brand-50 p-6">
              <div className="text-sm font-extrabold text-slate-900">Send your query</div>
              <div className="mt-2 text-sm font-semibold text-slate-600">
                Choose WhatsApp for a quick response, or email for detailed documents.
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={onWhatsApp}
                  className="rounded-2xl bg-brand-900 px-5 py-3 text-sm font-extrabold text-white"
                >
                  Send on WhatsApp
                </button>
                <button
                  type="button"
                  onClick={onEmail}
                  className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-extrabold text-slate-800"
                >
                  Send on Email
                </button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
