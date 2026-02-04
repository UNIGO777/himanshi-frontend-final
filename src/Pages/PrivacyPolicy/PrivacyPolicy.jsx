import { useEffect } from 'react'
import Navbar from '../../Components/Navbar'
import FooterSection from '../../Components/FooterSection'
import Container from '../../Components/Container'

function upsertMeta({ name, property }, content) {
  if (typeof document === 'undefined') return
  const key = name ? `meta[name="${name}"]` : `meta[property="${property}"]`
  let el = document.querySelector(key)
  if (!el) {
    el = document.createElement('meta')
    if (name) el.setAttribute('name', name)
    if (property) el.setAttribute('property', property)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertCanonical(href) {
  if (typeof document === 'undefined') return
  let el = document.querySelector('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

export default function PrivacyPolicy() {
  useEffect(() => {
    const url = `${window.location.origin}/privacy-policy`
    const title = 'Privacy Policy | Himanshi Properties'
    const description =
      'Read the privacy policy for Himanshi Properties, including information we collect, how we use it, and your choices.'
    document.title = title
    upsertCanonical(url)
    upsertMeta({ name: 'description' }, description)
    upsertMeta({ property: 'og:title' }, title)
    upsertMeta({ property: 'og:description' }, description)
    upsertMeta({ property: 'og:url' }, url)
    upsertMeta({ name: 'twitter:title' }, title)
    upsertMeta({ name: 'twitter:description' }, description)
  }, [])

  return (
    <div className="min-h-screen bg-brand-50">
      <Navbar />
      <main>
        <section className="py-10 md:py-14">
          <Container>
            <div className="mx-auto max-w-3xl">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
                <div className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Privacy Policy</div>
                <div className="mt-2 text-sm font-semibold text-slate-600">Last updated: {new Date().toLocaleDateString('en-IN')}</div>

                <div className="mt-6 space-y-6 text-sm leading-relaxed text-slate-700">
                  <div>
                    <div className="text-base font-extrabold text-slate-900">Overview</div>
                    <p className="mt-2">
                      This Privacy Policy explains how Himanshi Properties collects, uses, shares, and protects your information when you use our
                      website and services.
                    </p>
                  </div>

                  <div>
                    <div className="text-base font-extrabold text-slate-900">Information We Collect</div>
                    <div className="mt-2 grid gap-2">
                      <div className="rounded-2xl bg-slate-50 px-4 py-3">
                        <div className="font-bold text-slate-900">Information you provide</div>
                        <div className="mt-1">
                          Name, phone number, email address, city, enquiry details, and other information you submit via forms or contact methods.
                        </div>
                      </div>
                      <div className="rounded-2xl bg-slate-50 px-4 py-3">
                        <div className="font-bold text-slate-900">Usage information</div>
                        <div className="mt-1">Basic analytics such as pages visited, time on site, and interactions for improving user experience.</div>
                      </div>
                      <div className="rounded-2xl bg-slate-50 px-4 py-3">
                        <div className="font-bold text-slate-900">Device information</div>
                        <div className="mt-1">Browser type, device type, IP address, and approximate location inferred from your IP address.</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-base font-extrabold text-slate-900">How We Use Your Information</div>
                    <div className="mt-2 grid gap-2">
                      <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                        Responding to your enquiries and connecting you with relevant property listings or services.
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                        Improving the website, content, and user experience based on aggregated usage patterns.
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                        Communicating updates related to your request, site visits, negotiations, or documentation support.
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-base font-extrabold text-slate-900">Sharing of Information</div>
                    <p className="mt-2">
                      We may share information with trusted partners or service providers only as needed to provide services (for example, coordinating
                      site visits or processing listings). We do not sell your personal information.
                    </p>
                  </div>

                  <div>
                    <div className="text-base font-extrabold text-slate-900">Cookies</div>
                    <p className="mt-2">
                      We may use cookies and similar technologies to support site functionality and understand usage. You can control cookies through
                      your browser settings.
                    </p>
                  </div>

                  <div>
                    <div className="text-base font-extrabold text-slate-900">Data Security</div>
                    <p className="mt-2">
                      We use reasonable administrative and technical measures to protect information. However, no method of transmission or storage is
                      100% secure.
                    </p>
                  </div>

                  <div>
                    <div className="text-base font-extrabold text-slate-900">Your Choices</div>
                    <p className="mt-2">
                      You may request to access, update, or delete your personal information by contacting us. You can also opt out of non-essential
                      communications at any time.
                    </p>
                  </div>

                  <div>
                    <div className="text-base font-extrabold text-slate-900">Contact</div>
                    <p className="mt-2">
                      For privacy-related questions, contact us at <span className="font-bold text-slate-900">hello@himanshiproperties.com</span>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <FooterSection />
    </div>
  )
}
