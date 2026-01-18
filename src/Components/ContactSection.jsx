import { FiMail, FiMapPin, FiPhone } from 'react-icons/fi'

export default function ContactSection() {
  return (
    <section className="mx-auto max-w-[1400px] px-3 py-12 sm:px-6 lg:px-10">
      <div className="grid gap-6 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 lg:grid-cols-2">
        <div>
          <div className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">Get in touch with us</div>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">Contact</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Share your requirements and we’ll reach out quickly with the best matching options.
          </p>

          <form className="mt-6 space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <input className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none" placeholder="Full name" />
              <input className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none" placeholder="Phone number" />
            </div>
            <input className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none" placeholder="Email address" />
            <textarea
              className="min-h-28 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
              placeholder="Tell us what you are looking for..."
            />
            <button type="button" className="w-full rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white sm:w-auto">
              Send message
            </button>
          </form>
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
              src="https://images.unsplash.com/photo-1502920514313-52581002a659?auto=format&fit=crop&w=1600&q=80"
              alt="City skyline"
              className="h-52 w-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
