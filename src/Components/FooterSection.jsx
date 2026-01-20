import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function FooterSection() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('')

  const onSubscribe = () => {
    const cleanEmail = typeof email === 'string' ? email.trim() : ''
    if (!cleanEmail) {
      setStatus('Please enter your email.')
      return
    }

    const subject = encodeURIComponent('Newsletter subscription')
    const body = encodeURIComponent(`Please subscribe this email to the newsletter: ${cleanEmail}`)
    window.location.href = `mailto:hello@himanshiproperties.com?subject=${subject}&body=${body}`
    setStatus('Opening email app…')
  }

  return (
    <footer className="bg-slate-950 text-white">
      <div className="mx-auto max-w-[1400px] px-3 py-12 sm:px-6 lg:px-10">
        <div className="rounded-3xl bg-white/5 p-6 sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="text-2xl font-extrabold tracking-tight sm:text-3xl">Subscribe newsletter</div>
              <div className="mt-2 text-sm font-semibold text-white/70">
                Get updates on new listings, offers, and market insights.
              </div>
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row lg:max-w-xl">
              <input
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (status) setStatus('')
                }}
                className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-white/50"
                placeholder="Enter your email"
              />
              <button
                type="button"
                onClick={onSubscribe}
                className="rounded-2xl bg-white px-5 py-3 text-sm font-extrabold text-slate-950"
              >
                Subscribe
              </button>
            </div>
          </div>
          {!!status && <div className="mt-3 text-xs font-semibold text-white/70">{status}</div>}
        </div>

        <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-slate-950">HP</div>
              <div>
                <div className="text-sm font-extrabold">Himanshi Properties</div>
                <div className="text-xs font-semibold text-white/60">Find your dream property</div>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              Verified listings, expert advice, and transparent service to help you buy, sell, or rent with confidence.
            </p>
          </div>

          <div>
            <div className="text-sm font-extrabold">Company</div>
            <div className="mt-4 space-y-3 text-sm font-semibold text-white/70">
              <Link className="block hover:text-white" to="/about">
                About
              </Link>
              <Link className="block hover:text-white" to="/services">
                Services
              </Link>
              <a className="block hover:text-white" href="mailto:hello@himanshiproperties.com?subject=Careers">
                Careers
              </a>
            </div>
          </div>

          <div>
            <div className="text-sm font-extrabold">Support</div>
            <div className="mt-4 space-y-3 text-sm font-semibold text-white/70">
              <Link className="block hover:text-white" to="/#contact">
                Contact
              </Link>
              <Link className="block hover:text-white" to="/#faq">
                FAQs
              </Link>
              <a className="block hover:text-white" href="mailto:hello@himanshiproperties.com?subject=Privacy%20Policy">
                Privacy Policy
              </a>
            </div>
          </div>

          <div>
            <div className="text-sm font-extrabold">Office</div>
            <div className="mt-4 space-y-3 text-sm font-semibold text-white/70">
              <div>Mon–Sat: 10:00 AM – 7:00 PM</div>
              <div>hello@himanshiproperties.com</div>
              <div>+91 90000 00000</div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs font-semibold text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <div>© {new Date().getFullYear()} Himanshi Properties. All rights reserved.</div>
          <div>Made with Vite + React</div>
        </div>
      </div>
    </footer>
  )
}
