import Navbar from '../../Components/Navbar'
import FooterSection from '../../Components/FooterSection'
import Container from '../../Components/Container'
import ExpertiseSection from '../../Components/ExpertiseSection'
import TestimonialsSection from '../../Components/TestimonialsSection'
import FAQSection from '../../Components/FAQSection'
import TeamConnectSection from '../../Components/TeamConnectSection'
import ContactSection from '../../Components/ContactSection'

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <section className="py-10">
          <Container>
          <div className="grid gap-6 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">About</div>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Himanshi Properties
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-slate-600">
                We help you shortlist verified homes, schedule visits, negotiate confidently, and close smoothly. Our focus is simple: clear guidance, transparent process, and the right options for your needs.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-3xl bg-slate-50 p-4">
                  <div className="text-lg font-extrabold text-slate-900">Verified</div>
                  <div className="mt-1 text-xs font-semibold text-slate-600">Shortlist quality listings</div>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4">
                  <div className="text-lg font-extrabold text-slate-900">Support</div>
                  <div className="mt-1 text-xs font-semibold text-slate-600">From visit to paperwork</div>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4">
                  <div className="text-lg font-extrabold text-slate-900">Transparent</div>
                  <div className="mt-1 text-xs font-semibold text-slate-600">Clear communication always</div>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl bg-slate-900/5">
              <img
                className="h-64 w-full object-cover sm:h-72"
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1400&q=80"
                alt="About Himanshi Properties"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          </Container>
        </section>

        <ExpertiseSection />
        <TestimonialsSection />
        <FAQSection />
        <TeamConnectSection />
        <ContactSection />
      </main>
      <FooterSection />
    </div>
  )
}
