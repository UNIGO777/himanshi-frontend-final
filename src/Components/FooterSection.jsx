import { Link } from 'react-router-dom'
import Container from './Container'

export default function FooterSection() {
  return (
    <footer className="bg-slate-950 text-white">
      <Container className="py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-slate-950">HP</div>
              <div>
                <div className="text-sm font-extrabold">Himanshi Properties</div>
                <div className="text-xs font-semibold text-white/60">Find your dream property</div>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-white/70">
             Buy, sell, or rent, as we offer you transformative experiences through a strong local network of real estate experts.
            </p>
          </div>

          <div>
            <div className="text-sm font-extrabold">Quick links</div>
            <div className="mt-4 space-y-3 text-sm font-semibold text-white/70">
              <Link className="block hover:text-white" to="/">
                Home
              </Link>
              <Link className="block hover:text-white" to="/properties">
                Properties
              </Link>
              <Link className="block hover:text-white" to="/services">
                Services
              </Link>
              <Link className="block hover:text-white" to="/about">
                About
              </Link>
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
              <Link className="block hover:text-white" to="/wishlist">
                Wishlist
              </Link>
              <a className="block hover:text-white" href="mailto:hello@himanshiproperties.com?subject=Privacy%20Policy">
                Privacy Policy
              </a>
            </div>
          </div>

          <div>
            <div className="text-sm font-extrabold">Address</div>
            <div className="mt-4 space-y-3 text-sm font-semibold text-white/70">
              <div>Himanshi Properties</div>
              <div>Your City, India</div>
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
      </Container>
    </footer>
  )
}
