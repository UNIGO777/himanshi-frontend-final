import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../../Components/Navbar'
import FooterSection from '../../Components/FooterSection'
import Container from '../../Components/Container'
import useAuth from '../../hooks/useAuth'

const AUTH_BG =
  "https://images.unsplash.com/photo-1728856493580-43ad68cd850b?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"

export default function Login() {
  const { login, verifyOtp } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState('credentials')
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
      const result = await login({ email, phone, password })
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
      if (step === 'credentials') {
        const result = await login({ email, phone, password })
        if (!result.ok) {
          setError(result.message || 'Login failed.')
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

      const result = await verifyOtp({ email, otp, flow: 'login' })
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
    <div className="flex min-h-screen flex-col bg-brand-50">
      <Navbar />
      <main className="relative flex flex-1 items-center justify-center py-10">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url("${AUTH_BG}")` }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-50/70 via-slate-950/60 to-brand-50/70" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <span className="absolute left-[6%] top-[22%] text-2xl font-light text-white/35">+</span>
          <span className="absolute right-[10%] top-[16%] text-2xl font-light text-white/35">+</span>
          <span className="absolute left-[16%] top-[54%] text-2xl font-light text-white/30">+</span>
          <span className="absolute right-[22%] top-[52%] text-2xl font-light text-white/30">+</span>
        </div>
        <Container className="relative w-full">
          <div className="mx-auto w-full max-w-lg rounded-3xl border border-white/25 bg-white/75 p-6 shadow-2xl backdrop-blur sm:p-8">
            <div className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">Welcome back</div>
            <div className="mt-2 text-sm font-semibold text-slate-600">Login to manage your wishlist and profile.</div>

          {!!error && (
            <div className="mt-5 rounded-2xl border border-orange-200/60 bg-orange-50/80 px-4 py-3 text-sm font-semibold text-orange-900 backdrop-blur">
              {error}
            </div>
          )}

          {!!info && (
            <div className="mt-5 rounded-2xl border border-slate-200/60 bg-white/60 px-4 py-3 text-sm font-semibold text-slate-800 backdrop-blur">
              {info}
            </div>
          )}

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <div className="text-xs font-extrabold text-slate-700">Email</div>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                autoComplete="email"
                disabled={step === 'otp'}
                className="mt-2 w-full rounded-2xl border border-white/20 bg-brand-900/10 px-4 py-3 text-sm font-semibold text-slate-900 outline-none backdrop-blur placeholder:text-slate-600 focus:border-brand-900 focus:ring-2 focus:ring-brand-900/20"
                placeholder="you@example.com"
                required
              />
            </div>

            {step === 'credentials' && (
              <div>
                <div className="text-xs font-extrabold text-slate-700">Phone</div>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  className="mt-2 w-full rounded-2xl border border-white/20 bg-brand-900/10 px-4 py-3 text-sm font-semibold text-slate-900 outline-none backdrop-blur placeholder:text-slate-600 focus:border-brand-900 focus:ring-2 focus:ring-brand-900/20"
                  placeholder="Enter phone number"
                />
              </div>
            )}

            {step === 'credentials' ? (
              <div>
                <div className="text-xs font-extrabold text-slate-700">Password</div>
                <div className="relative mt-2">
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    className="w-full rounded-2xl border border-white/20 bg-brand-900/10 px-4 py-3 pr-20 text-sm font-semibold text-slate-900 outline-none backdrop-blur placeholder:text-slate-600 focus:border-brand-900 focus:ring-2 focus:ring-brand-900/20"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-white/25 bg-white/70 px-3 py-1 text-xs font-extrabold text-slate-800 backdrop-blur hover:bg-white"
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
                  className="mt-2 w-full rounded-2xl border border-white/20 bg-brand-900/10 px-4 py-3 text-sm font-semibold text-slate-900 outline-none backdrop-blur placeholder:text-slate-600 focus:border-brand-900 focus:ring-2 focus:ring-brand-900/20"
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
              {step === 'otp' ? 'Verify OTP' : 'Login'}
            </button>

            {step === 'otp' && (
              <button
                type="button"
                disabled={isSubmitting || isResending || resendCooldown > 0}
                onClick={onResendOtp}
                className="w-full rounded-2xl border border-white/25 bg-white/70 px-5 py-3 text-sm font-extrabold text-slate-900 backdrop-blur disabled:cursor-not-allowed disabled:opacity-60"
              >
                {resendCooldown > 0 ? `Resend OTP (${resendCooldown}s)` : 'Resend OTP'}
              </button>
            )}

            {step === 'otp' && (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => {
                  setStep('credentials')
                  setOtp('')
                  setError('')
                  setInfo('')
                  setResendCooldown(0)
                }}
                className="w-full rounded-2xl border border-white/25 bg-white/70 px-5 py-3 text-sm font-extrabold text-slate-900 backdrop-blur disabled:cursor-not-allowed disabled:opacity-60"
              >
                Back
              </button>
            )}
          </form>

            <div className="mt-6 text-center text-sm font-semibold text-slate-600">
              Don&apos;t have an account?{' '}
              <Link to="/signup" className="font-extrabold text-brand-900">
                Sign up
              </Link>
            </div>
          </div>
        </Container>
      </main>
      <FooterSection />
    </div>
  )
}
