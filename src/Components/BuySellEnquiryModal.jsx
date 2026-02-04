import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { FiX } from 'react-icons/fi'

const BuySellEnquiryModalContext = createContext(null)

function cleanString(value) {
  if (value === undefined || value === null) return ''
  return String(value).trim()
}

function BuySellEnquiryModal({ isOpen, onClose, initialTab = 'buy' }) {
  const [tab, setTab] = useState(() => (initialTab === 'sell' ? 'sell' : 'buy'))
  const [status, setStatus] = useState({ type: '', message: '' })
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    buyType: '',
    buyBudget: '',
    sellTitle: '',
    sellExpectedPrice: '',
    message: '',
  })

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen, onClose])

  const canSubmit = useMemo(() => {
    const name = cleanString(form.name)
    const phone = cleanString(form.phone)
    const message = cleanString(form.message)
    if (!name || !phone || !message) return false

    if (tab === 'buy') {
      const buyType = cleanString(form.buyType)
      return !!buyType
    }
    const sellTitle = cleanString(form.sellTitle)
    return !!sellTitle
  }, [form, tab])

  if (!isOpen) return null

  const label = tab === 'buy' ? 'Buy enquiry' : 'Sell enquiry'

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="max-h-[90vh] w-full max-w-xl overflow-hidden rounded-3xl border border-slate-200 bg-white/80 backdrop-blur">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <div className="text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">Enquiry form</div>
            <div className="mt-0.5 text-xs font-semibold text-slate-600">Choose buy or sell and submit details.</div>
          </div>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-900/10 bg-white text-slate-900"
            aria-label="Close"
            onClick={onClose}
          >
            <FiX className="text-lg" />
          </button>
        </div>

        <div className="border-b border-slate-200 px-5 py-3">
          <div className="inline-flex rounded-2xl border border-slate-200 bg-white p-1">
            <button
              type="button"
              onClick={() => {
                setTab('buy')
                if (status.message) setStatus({ type: '', message: '' })
              }}
              className={`rounded-2xl px-4 py-2 text-sm font-extrabold ${
                tab === 'buy' ? 'bg-brand-900 text-white' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              Buy
            </button>
            <button
              type="button"
              onClick={() => {
                setTab('sell')
                if (status.message) setStatus({ type: '', message: '' })
              }}
              className={`rounded-2xl px-4 py-2 text-sm font-extrabold ${
                tab === 'sell' ? 'bg-brand-900 text-white' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              Sell
            </button>
          </div>
        </div>

        <div className="max-h-[calc(90vh-150px)] overflow-auto p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              value={form.name}
              onChange={(e) => {
                setForm((cur) => ({ ...cur, name: e.target.value }))
                if (status.message) setStatus({ type: '', message: '' })
              }}
              className="w-full rounded-2xl border border-brand-900/20 bg-brand-900/10 px-4 py-3 text-sm font-semibold text-slate-900 outline-none focus:border-brand-900"
              placeholder="Full name *"
            />
            <input
              value={form.phone}
              onChange={(e) => {
                setForm((cur) => ({ ...cur, phone: e.target.value }))
                if (status.message) setStatus({ type: '', message: '' })
              }}
              className="w-full rounded-2xl border border-brand-900/20 bg-brand-900/10 px-4 py-3 text-sm font-semibold text-slate-900 outline-none focus:border-brand-900"
              placeholder="Phone number *"
            />
            <input
              value={form.email}
              onChange={(e) => {
                setForm((cur) => ({ ...cur, email: e.target.value }))
                if (status.message) setStatus({ type: '', message: '' })
              }}
              className="w-full rounded-2xl border border-brand-900/20 bg-brand-900/10 px-4 py-3 text-sm font-semibold text-slate-900 outline-none focus:border-brand-900"
              placeholder="Email (optional)"
            />
            <input
              value={form.city}
              onChange={(e) => {
                setForm((cur) => ({ ...cur, city: e.target.value }))
                if (status.message) setStatus({ type: '', message: '' })
              }}
              className="w-full rounded-2xl border border-brand-900/20 bg-brand-900/10 px-4 py-3 text-sm font-semibold text-slate-900 outline-none focus:border-brand-900"
              placeholder="City (optional)"
            />
          </div>

          {tab === 'buy' ? (
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <input
                value={form.buyType}
                onChange={(e) => {
                  setForm((cur) => ({ ...cur, buyType: e.target.value }))
                  if (status.message) setStatus({ type: '', message: '' })
                }}
                className="w-full rounded-2xl border border-brand-900/20 bg-brand-900/10 px-4 py-3 text-sm font-semibold text-slate-900 outline-none focus:border-brand-900"
                placeholder="Looking to buy (e.g., 2BHK, plot) *"
              />
              <input
                value={form.buyBudget}
                onChange={(e) => {
                  setForm((cur) => ({ ...cur, buyBudget: e.target.value }))
                  if (status.message) setStatus({ type: '', message: '' })
                }}
                className="w-full rounded-2xl border border-brand-900/20 bg-brand-900/10 px-4 py-3 text-sm font-semibold text-slate-900 outline-none focus:border-brand-900"
                placeholder="Budget (optional)"
              />
            </div>
          ) : (
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <input
                value={form.sellTitle}
                onChange={(e) => {
                  setForm((cur) => ({ ...cur, sellTitle: e.target.value }))
                  if (status.message) setStatus({ type: '', message: '' })
                }}
                className="w-full rounded-2xl border border-brand-900/20 bg-brand-900/10 px-4 py-3 text-sm font-semibold text-slate-900 outline-none focus:border-brand-900"
                placeholder="Property title/name *"
              />
              <input
                value={form.sellExpectedPrice}
                onChange={(e) => {
                  setForm((cur) => ({ ...cur, sellExpectedPrice: e.target.value }))
                  if (status.message) setStatus({ type: '', message: '' })
                }}
                className="w-full rounded-2xl border border-brand-900/20 bg-brand-900/10 px-4 py-3 text-sm font-semibold text-slate-900 outline-none focus:border-brand-900"
                placeholder="Expected price (optional)"
              />
            </div>
          )}

          <textarea
            value={form.message}
            onChange={(e) => {
              setForm((cur) => ({ ...cur, message: e.target.value }))
              if (status.message) setStatus({ type: '', message: '' })
            }}
            className="mt-3 min-h-28 w-full rounded-2xl border border-brand-900/20 bg-brand-900/10 px-4 py-3 text-sm font-semibold text-slate-900 outline-none focus:border-brand-900"
            placeholder={tab === 'buy' ? 'Your requirements *' : 'Property details *'}
          />

          {!!status.message && (
            <div
              className={`mt-4 rounded-2xl px-4 py-3 text-sm font-semibold ${
                status.type === 'error' ? 'bg-red-50 text-red-800' : 'bg-emerald-50 text-emerald-900'
              }`}
            >
              {status.message}
            </div>
          )}

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-extrabold text-slate-800"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!canSubmit}
              onClick={() => {
                const name = cleanString(form.name)
                const phone = cleanString(form.phone)
                const email = cleanString(form.email)
                const city = cleanString(form.city)
                const message = cleanString(form.message)

                if (!name || !phone || !message) {
                  setStatus({ type: 'error', message: 'Please fill all required fields.' })
                  return
                }

                if (tab === 'buy') {
                  const buyType = cleanString(form.buyType)
                  const buyBudget = cleanString(form.buyBudget)
                  if (!buyType) {
                    setStatus({ type: 'error', message: 'Please enter what you want to buy.' })
                    return
                  }
                  const subject = encodeURIComponent('Buy property enquiry')
                  const body = encodeURIComponent(
                    `Type: BUY\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\nCity: ${city}\nLooking to buy: ${buyType}\nBudget: ${buyBudget}\n\nMessage:\n${message}\n`,
                  )
                  window.location.href = `mailto:hello@himanshiproperties.com?subject=${subject}&body=${body}`
                  setStatus({ type: 'success', message: `${label} generated. Opening email app…` })
                  return
                }

                const sellTitle = cleanString(form.sellTitle)
                const sellExpectedPrice = cleanString(form.sellExpectedPrice)
                if (!sellTitle) {
                  setStatus({ type: 'error', message: 'Please enter your property title/name.' })
                  return
                }
                const subject = encodeURIComponent('Sell property enquiry')
                const body = encodeURIComponent(
                  `Type: SELL\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\nCity: ${city}\nProperty title: ${sellTitle}\nExpected price: ${sellExpectedPrice}\n\nMessage:\n${message}\n`,
                )
                window.location.href = `mailto:hello@himanshiproperties.com?subject=${subject}&body=${body}`
                setStatus({ type: 'success', message: `${label} generated. Opening email app…` })
              }}
              className="rounded-2xl bg-brand-900 px-5 py-3 text-sm font-extrabold text-white disabled:opacity-60"
            >
              Generate enquiry
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function BuySellEnquiryModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)
  const [initialTab, setInitialTab] = useState('buy')

  const open = useCallback((tab) => {
    setInitialTab(tab === 'sell' ? 'sell' : 'buy')
    setIsOpen(true)
  }, [])

  const close = useCallback(() => setIsOpen(false), [])

  const value = useMemo(
    () => ({
      open,
      close,
      isOpen,
    }),
    [close, isOpen, open],
  )

  return (
    <BuySellEnquiryModalContext.Provider value={value}>
      {children}
      <BuySellEnquiryModal key={`${initialTab}-${isOpen ? 1 : 0}`} isOpen={isOpen} initialTab={initialTab} onClose={close} />
    </BuySellEnquiryModalContext.Provider>
  )
}

export function BuySellEnquiryModalTrigger({ children }) {
  const ctx = useContext(BuySellEnquiryModalContext)
  const safe = ctx || { open: () => {}, close: () => {}, isOpen: false }
  return typeof children === 'function' ? children(safe) : children
}

export default BuySellEnquiryModal
