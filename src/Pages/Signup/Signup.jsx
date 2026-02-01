import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../../Components/Navbar'
import FooterSection from '../../Components/FooterSection'
import Container from '../../Components/Container'
import useAuth from '../../hooks/useAuth'

export default function Signup() {
  const { signup, verifyOtp } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState('details')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)

  useEffect(() => {
    if (resendCooldown <= 0) return undefined
    const timer = window.setInterval(() => {
      setResendCooldown((sec) => (sec > 0 ? sec - 1 : 0))
    }, 1000)
    return () => window.clearInterval(timer)
  }, [resendCooldown])

  const onResendOtp = async () => {
    if (isSubmitting || isResending || resendCooldown > 0) return
    setIsResending(true)
    setError('')
    setInfo('')
    try {
      const result = await signup({ name, email, phone, password })
      if (!result.ok) {
        setError(result.message || 'Resend OTP failed.')
        return
      }

      if (result.next === 'otp') {
        setStep('otp')
        setInfo(result.message || 'OTP sent.')
        setResendCooldown(30)
        return
      }

      navigate('/', { replace: true })
    } finally {
      setIsResending(false)
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    setInfo('')
    try {
      if (step === 'details') {
        const result = await signup({ name, email, phone, password })
        if (!result.ok) {
          setError(result.message || 'Signup failed.')
          return
        }

        if (result.next === 'otp') {
          setStep('otp')
          setInfo(result.message || 'OTP sent.')
          setResendCooldown(30)
          return
        }

        navigate('/', { replace: true })
        return
      }

      const result = await verifyOtp({ email, otp, flow: 'signup' })
      if (!result.ok) {
        setError(result.message || 'OTP verification failed.')
        return
      }
      navigate('/', { replace: true })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-50">
      <Navbar />
      <main className="py-10">
        <Container className="grid items-center">
        <div className="mx-auto w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
          <div className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">Create account</div>
          <div className="mt-2 text-sm font-semibold text-slate-600">Sign up to save properties and track activity.</div>

          {!!error && (
            <div className="mt-5 rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-semibold text-orange-800">
              {error}
            </div>
          )}

          {!!info && (
            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
              {info}
            </div>
          )}

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            {step === 'details' && (
              <div>
                <div className="text-xs font-extrabold text-slate-700">Full name</div>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  autoComplete="name"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none focus:border-brand-900"
                  placeholder="Your name"
                  required
                />
              </div>
            )}

            <div>
              <div className="text-xs font-extrabold text-slate-700">Email</div>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                autoComplete="email"
                disabled={step === 'otp'}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none focus:border-brand-900"
                placeholder="you@example.com"
                required
              />
            </div>

            {step === 'details' && (
              <div>
                <div className="text-xs font-extrabold text-slate-700">Phone</div>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none focus:border-brand-900"
                  placeholder="Enter phone number"
                  required
                />
              </div>
            )}

            {step === 'details' ? (
              <div>
                <div className="text-xs font-extrabold text-slate-700">Password</div>
                <div className="relative mt-2">
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-20 text-sm font-semibold text-slate-900 outline-none focus:border-brand-900"
                    placeholder="Min 6 characters"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-slate-100 px-3 py-1 text-xs font-extrabold text-slate-700 hover:bg-slate-200"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="text-xs font-extrabold text-slate-700">OTP</div>
                <input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none focus:border-brand-900"
                  placeholder="Enter OTP"
                  required
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-2xl bg-brand-900 px-5 py-3 text-sm font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {step === 'otp' ? 'Verify OTP' : 'Sign up'}
            </button>

            {step === 'otp' && (
              <button
                type="button"
                disabled={isSubmitting || isResending || resendCooldown > 0}
                onClick={onResendOtp}
                className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-extrabold text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {resendCooldown > 0 ? `Resend OTP (${resendCooldown}s)` : 'Resend OTP'}
              </button>
            )}

            {step === 'otp' && (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => {
                  setStep('details')
                  setOtp('')
                  setError('')
                  setInfo('')
                  setResendCooldown(0)
                }}
                className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-extrabold text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Back
              </button>
            )}
          </form>

          <div className="mt-6 text-center text-sm font-semibold text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="font-extrabold text-brand-900">
              Login
            </Link>
          </div>
        </div>
        </Container>
      </main>
      <FooterSection />
    </div>
  )
}
