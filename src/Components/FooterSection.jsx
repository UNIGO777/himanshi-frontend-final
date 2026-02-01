import { Link } from 'react-router-dom'
import logo from '../assets/logo_himashi_properties-removebg-preview (1).png'
import Container from './Container'

export default function FooterSection() {
  return (
    <footer className="bg-white text-slate-900">
      <Container className="py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="grid h-16 w-16 place-items-center overflow-hidden rounded-2xl bg-white p-1">
                <img src={logo} alt="Himanshi Properties" className="h-full w-full object-contain" loading="lazy" />
              </div>
              <div>
                <div className="text-sm font-extrabold">Himanshi Properties</div>
                <div className="text-xs font-semibold text-slate-600">Find your dream property</div>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">
             Buy, sell, or rent, as we offer you transformative experiences through a strong local network of real estate experts.
            </p>
          </div>

          <div>
            <div className="text-sm font-extrabold">Quick links</div>
            <div className="mt-4 space-y-3 text-sm font-semibold text-slate-600">
              <Link className="block hover:text-slate-900" to="/">
                Home
              </Link>
              <Link className="block hover:text-slate-900" to="/properties">
                Properties
              </Link>
              <Link className="block hover:text-slate-900" to="/services">
                Services
              </Link>
              <Link className="block hover:text-slate-900" to="/about">
                About
              </Link>
            </div>
          </div>

          <div>
            <div className="text-sm font-extrabold">Support</div>
            <div className="mt-4 space-y-3 text-sm font-semibold text-slate-600">
              <Link className="block hover:text-slate-900" to="/#contact">
                Contact
              </Link>
              <Link className="block hover:text-slate-900" to="/#faq">
                FAQs
              </Link>
              <Link className="block hover:text-slate-900" to="/wishlist">
                Wishlist
              </Link>
              <a className="block hover:text-slate-900" href="mailto:hello@himanshiproperties.com?subject=Privacy%20Policy">
                Privacy Policy
              </a>
            </div>
          </div>

          <div>
            <div className="text-sm font-extrabold">Address</div>
            <div className="mt-4 space-y-3 text-sm font-semibold text-slate-600">
              <div>Himanshi Properties</div>
              <div>Your City, India</div>
              <div>Mon–Sat: 10:00 AM – 7:00 PM</div>
              <div>hello@himanshiproperties.com</div>
              <div>+91 90000 00000</div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-slate-200 pt-6 text-xs font-semibold text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <div>© {new Date().getFullYear()} Himanshi Properties. All rights reserved.</div>
          <div>Made with Vite + React</div>
        </div>
      </Container>
    </footer>
  )
}
