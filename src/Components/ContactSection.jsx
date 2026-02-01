import { FiMail, FiMapPin, FiPhone } from 'react-icons/fi'
import { useState } from 'react'
import Container from './Container'

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' })
  const [status, setStatus] = useState('')

  const onSubmit = (e) => {
    e.preventDefault()
    const cleanName = form.name.trim()
    const cleanPhone = form.phone.trim()
    const cleanEmail = form.email.trim()
    const cleanMessage = form.message.trim()

    if (!cleanName || !cleanMessage) {
      setStatus('Please enter your name and message.')
      return
    }

    const subject = encodeURIComponent('Property enquiry')
    const body = encodeURIComponent(
      `Name: ${cleanName}\nPhone: ${cleanPhone}\nEmail: ${cleanEmail}\n\nMessage:\n${cleanMessage}\n`,
    )
    window.location.href = `mailto:hello@himanshiproperties.com?subject=${subject}&body=${body}`
    setStatus('Opening email app…')
  }

  return (
    <section id="contact" className="py-12">
      <Container>
      <div className="grid gap-6 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 lg:grid-cols-2">
        <div>
          <div className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">Get in touch with us</div>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">Enquire now!</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Tell us what you are looking for, and we will find the best possible real estate solution for you.
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                value={form.name}
                onChange={(e) => setForm((cur) => ({ ...cur, name: e.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                placeholder="Full name"
              />
              <input
                value={form.phone}
                onChange={(e) => setForm((cur) => ({ ...cur, phone: e.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                placeholder="Phone number"
              />
            </div>
            <input
              value={form.email}
              onChange={(e) => setForm((cur) => ({ ...cur, email: e.target.value }))}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
              placeholder="Email address"
            />
            <textarea
              value={form.message}
              onChange={(e) => setForm((cur) => ({ ...cur, message: e.target.value }))}
              className="min-h-28 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
              placeholder="Tell us what you are looking for..."
            />
            <button type="submit" className="w-full rounded-2xl bg-brand-900 px-5 py-3 text-sm font-semibold text-white sm:w-auto">
              Send message
            </button>
          </form>
          {!!status && <div className="mt-3 text-xs font-semibold text-slate-600">{status}</div>}
        </div>

        <div className="rounded-3xl bg-slate-50 p-5">
          <div className="text-sm font-bold text-slate-900">Contact details</div>
          <div className="mt-4 space-y-3 text-sm text-slate-700">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-slate-900">
                <FiPhone />
              </div>
              <div>
                <div className="text-xs text-slate-500">Phone</div>
                <div className="font-semibold">+91 90000 00000</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-slate-900">
                <FiMail />
              </div>
              <div>
                <div className="text-xs text-slate-500">Email</div>
                <div className="font-semibold">hello@himanshiproperties.com</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-slate-900">
                <FiMapPin />
              </div>
              <div>
                <div className="text-xs text-slate-500">Office</div>
                <div className="font-semibold">Your City, India</div>
              </div>
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-3xl">
            <img
              src="https://images.unsplash.com/photo-1726390731971-463ce97cc5b0?ixlib=rb-4.1.0&q=85&fm=jpg&crop=entropy&cs=srgb&dl=zoshua-colah-wUmTjqhTtyo-unsplash.jpg"
              alt="Indian city skyline"
              className="h-52 w-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>
      </Container>
    </section>
  )
}
