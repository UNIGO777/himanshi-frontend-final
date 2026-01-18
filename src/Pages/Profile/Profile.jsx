import { motion } from 'framer-motion'
import { FiMail, FiMapPin, FiPhone, FiUser } from 'react-icons/fi'
import Navbar from '../../Components/Navbar'
import FooterSection from '../../Components/FooterSection'
import useWishlist from '../../hooks/useWishlist'
import useAuth from '../../hooks/useAuth'

export default function Profile() {
  const { items } = useWishlist()
  const { user, isAuthenticated } = useAuth()

  const email = typeof user?.email === 'string' ? user.email : ''
  const usernameBase = email.includes('@') ? email.split('@')[0] : ''
  const currentUser = user
    ? {
        name: typeof user.name === 'string' && user.name.trim().length > 0 ? user.name : 'User',
        username: usernameBase ? `@${usernameBase}` : '',
        email,
        phone: typeof user.phone === 'string' ? user.phone : '',
        city: '',
        bio: '',
      }
    : {
        name: 'Guest',
        username: '',
        email: '',
        phone: '',
        city: '',
        bio: 'Please log in to view your profile details.',
      }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="mx-auto max-w-[1400px] px-3 py-10 sm:px-6 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-[360px_1fr] lg:items-start">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-3xl border border-slate-200 bg-white p-6"
          >
            <div className="flex items-center gap-4">
              <div className="grid h-16 w-16 place-items-center rounded-3xl bg-slate-900 text-white">
                <FiUser className="text-2xl" />
              </div>
              <div className="min-w-0">
                <div className="truncate text-lg font-extrabold text-slate-900">{currentUser.name}</div>
                {!!currentUser.username && <div className="truncate text-sm font-semibold text-slate-500">{currentUser.username}</div>}
              </div>
            </div>

            {!!currentUser.bio && <div className="mt-5 text-sm leading-relaxed text-slate-600">{currentUser.bio}</div>}

            <div className="mt-6 space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-50 text-slate-900">
                  <FiMail />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-slate-500">Email</div>
                  <div className="truncate font-semibold text-slate-900">{currentUser.email || 'Not available'}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-50 text-slate-900">
                  <FiPhone />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-slate-500">Phone</div>
                  <div className="truncate font-semibold text-slate-900">{currentUser.phone || 'Not available'}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-50 text-slate-900">
                  <FiMapPin />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-slate-500">City</div>
                  <div className="truncate font-semibold text-slate-900">{currentUser.city || 'Not available'}</div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="rounded-3xl border border-slate-200 bg-white p-6"
            >
              <div className="text-lg font-extrabold text-slate-900">Account details</div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <input
                  disabled={!isAuthenticated}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none disabled:bg-slate-50"
                  defaultValue={currentUser.name}
                />
                <input
                  disabled={!isAuthenticated}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none disabled:bg-slate-50"
                  defaultValue={currentUser.email}
                />
                <input
                  disabled={!isAuthenticated}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none disabled:bg-slate-50"
                  defaultValue={currentUser.phone}
                />
                <input
                  disabled={!isAuthenticated}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none disabled:bg-slate-50"
                  defaultValue={currentUser.city}
                />
              </div>
              <button type="button" className="mt-4 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white">
                Save changes
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="rounded-3xl bg-slate-950 p-6 text-white"
            >
              <div className="text-lg font-extrabold">Your activity</div>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <div className="text-2xl font-extrabold">{items.length}</div>
                  <div className="mt-1 text-xs font-semibold text-white/70">Saved properties</div>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <div className="text-2xl font-extrabold">5</div>
                  <div className="mt-1 text-xs font-semibold text-white/70">Site visits</div>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <div className="text-2xl font-extrabold">3</div>
                  <div className="mt-1 text-xs font-semibold text-white/70">Active inquiries</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <FooterSection />
    </div>
  )
}
