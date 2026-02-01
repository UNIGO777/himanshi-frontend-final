import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { FiX } from 'react-icons/fi'
import { createSellPropertyRequest } from '../api/properties'
import { uploadImages, uploadVideo } from '../api/uploads'

const SellPropertyModalContext = createContext(null)

function cleanString(value) {
  if (value === undefined || value === null) return ''
  return String(value).trim()
}

function cleanNumber(value) {
  const raw = cleanString(value).replace(/,/g, '')
  if (!raw) return undefined
  const n = Number(raw)
  return Number.isFinite(n) ? n : undefined
}

function SellPropertyModal({ isOpen, onClose }) {
  const MAX_IMAGE_COUNT = 5
  const MAX_IMAGE_SIZE = 4 * 1024 * 1024
  const MAX_IMAGES_TOTAL_SIZE = 20 * 1024 * 1024
  const MAX_VIDEO_SIZE = 10 * 1024 * 1024

  const formatBytes = (bytes) => {
    const n = typeof bytes === 'number' && Number.isFinite(bytes) ? bytes : 0
    if (n >= 1024 * 1024 * 1024) return `${(n / (1024 * 1024 * 1024)).toFixed(1)} GB`
    if (n >= 1024 * 1024) return `${(n / (1024 * 1024)).toFixed(1)} MB`
    if (n >= 1024) return `${Math.round(n / 1024)} KB`
    return `${Math.max(0, Math.round(n))} B`
  }

  const [form, setForm] = useState({
    ownerName: '',
    ownerPhone: '',
    ownerEmail: '',
    title: '',
    description: '',
    price: '',
    city: '',
    state: '',
  })
  const [imageFiles, setImageFiles] = useState([])
  const [videoFile, setVideoFile] = useState(null)
  const [videoUrlInput, setVideoUrlInput] = useState('')
  const [status, setStatus] = useState({ type: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [progress, setProgress] = useState({ percent: 0, label: '' })

  const imagePreviews = useMemo(() => {
    return imageFiles.map((file) => ({ file, url: URL.createObjectURL(file) }))
  }, [imageFiles])

  useEffect(() => {
    return () => {
      imagePreviews.forEach((p) => URL.revokeObjectURL(p.url))
    }
  }, [imagePreviews])

  const videoPreviewUrl = useMemo(() => {
    if (!videoFile) return ''
    return URL.createObjectURL(videoFile)
  }, [videoFile])

  useEffect(() => {
    return () => {
      if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl)
    }
  }, [videoPreviewUrl])

  const canSubmit = useMemo(() => {
    const ownerName = cleanString(form.ownerName)
    const ownerPhone = cleanString(form.ownerPhone)
    const title = cleanString(form.title)
    const description = cleanString(form.description)
    return ownerName && ownerPhone && title && description && !submitting
  }, [form, submitting])

  if (!isOpen) return null

  const imagesBytes = imageFiles.reduce((sum, f) => sum + (f && typeof f.size === 'number' ? f.size : 0), 0)
  const videoBytes = videoFile && typeof videoFile.size === 'number' ? videoFile.size : 0
  const requestBytes = 50 * 1024
  const totalBytes = Math.max(1, imagesBytes + videoBytes + requestBytes)

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white/80 backdrop-blur">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <div className="text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">Sell my property</div>
            <div className="mt-0.5 text-xs font-semibold text-slate-600">Submit details and we’ll contact you.</div>
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

        <div className="max-h-[calc(90vh-70px)] overflow-auto p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              value={form.ownerName}
              onChange={(e) => {
                setForm((cur) => ({ ...cur, ownerName: e.target.value }))
                if (status.message) setStatus({ type: '', message: '' })
              }}
              className="w-full rounded-2xl border border-brand-900/20 bg-brand-900/10 px-4 py-3 text-sm font-semibold text-slate-900 outline-none focus:border-brand-900"
              placeholder="Your name *"
            />
            <input
              value={form.ownerPhone}
              onChange={(e) => {
                setForm((cur) => ({ ...cur, ownerPhone: e.target.value }))
                if (status.message) setStatus({ type: '', message: '' })
              }}
              className="w-full rounded-2xl border border-brand-900/20 bg-brand-900/10 px-4 py-3 text-sm font-semibold text-slate-900 outline-none focus:border-brand-900"
              placeholder="Phone number *"
            />
            <input
              value={form.ownerEmail}
              onChange={(e) => {
                setForm((cur) => ({ ...cur, ownerEmail: e.target.value }))
                if (status.message) setStatus({ type: '', message: '' })
              }}
              className="w-full rounded-2xl border border-brand-900/20 bg-brand-900/10 px-4 py-3 text-sm font-semibold text-slate-900 outline-none focus:border-brand-900"
              placeholder="Email (optional)"
            />
            <input
              value={form.title}
              onChange={(e) => {
                setForm((cur) => ({ ...cur, title: e.target.value }))
                if (status.message) setStatus({ type: '', message: '' })
              }}
              className="w-full rounded-2xl border border-brand-900/20 bg-brand-900/10 px-4 py-3 text-sm font-semibold text-slate-900 outline-none focus:border-brand-900"
              placeholder="Property name/title *"
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
            <input
              value={form.state}
              onChange={(e) => {
                setForm((cur) => ({ ...cur, state: e.target.value }))
                if (status.message) setStatus({ type: '', message: '' })
              }}
              className="w-full rounded-2xl border border-brand-900/20 bg-brand-900/10 px-4 py-3 text-sm font-semibold text-slate-900 outline-none focus:border-brand-900"
              placeholder="State (optional)"
            />
            <input
              value={form.price}
              onChange={(e) => {
                setForm((cur) => ({ ...cur, price: e.target.value }))
                if (status.message) setStatus({ type: '', message: '' })
              }}
              className="w-full rounded-2xl border border-brand-900/20 bg-brand-900/10 px-4 py-3 text-sm font-semibold text-slate-900 outline-none focus:border-brand-900"
              placeholder="Expected price (optional)"
            />
          </div>

          <textarea
            value={form.description}
            onChange={(e) => {
              setForm((cur) => ({ ...cur, description: e.target.value }))
              if (status.message) setStatus({ type: '', message: '' })
            }}
            className="mt-3 min-h-32 w-full rounded-2xl border border-brand-900/20 bg-brand-900/10 px-4 py-3 text-sm font-semibold text-slate-900 outline-none focus:border-brand-900"
            placeholder="Property description *"
          />

          <div className="mt-4 grid gap-3">
            <div className="rounded-3xl border border-slate-200 bg-white/70 p-4">
              <div className="text-sm font-extrabold text-slate-900">Photos</div>
              <div className="mt-1 text-xs font-semibold text-slate-600">
                Upload up to {MAX_IMAGE_COUNT} images (max {formatBytes(MAX_IMAGE_SIZE)} each, {formatBytes(MAX_IMAGES_TOTAL_SIZE)} total).
              </div>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <input
                  id="sell-property-images"
                  type="file"
                  accept="image/*"
                  multiple
                  disabled={submitting}
                  onChange={(e) => {
                    const list = Array.from(e.target.files || [])
                    e.target.value = ''
                    if (!list.length) return

                    let message = ''
                    let type = ''

                    setImageFiles((cur) => {
                      const current = Array.isArray(cur) ? cur : []
                      const next = [...current]
                      let total = next.reduce((sum, f) => sum + (f && typeof f.size === 'number' ? f.size : 0), 0)

                      for (const file of list) {
                        if (!file) continue
                        if (next.length >= MAX_IMAGE_COUNT) {
                          message = `You can upload up to ${MAX_IMAGE_COUNT} photos.`
                          type = 'error'
                          break
                        }
                        if (typeof file.size === 'number' && file.size > MAX_IMAGE_SIZE) {
                          message = `Each photo must be <= ${formatBytes(MAX_IMAGE_SIZE)}.`
                          type = 'error'
                          continue
                        }
                        const size = typeof file.size === 'number' ? file.size : 0
                        if (total + size > MAX_IMAGES_TOTAL_SIZE) {
                          message = `Total photo size must be <= ${formatBytes(MAX_IMAGES_TOTAL_SIZE)}.`
                          type = 'error'
                          break
                        }
                        next.push(file)
                        total += size
                      }
                      return next
                    })

                    if (message) setStatus({ type, message })
                    else if (status.message) setStatus({ type: '', message: '' })
                  }}
                  className="hidden"
                />
                <label
                  htmlFor="sell-property-images"
                  className={`inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-extrabold text-slate-800 ${
                    submitting ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                  }`}
                >
                  Select photos
                </label>
                <button
                  type="button"
                  disabled={imageFiles.length === 0 || submitting}
                  onClick={() => setImageFiles([])}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-extrabold text-slate-800 disabled:opacity-50"
                >
                  Clear
                </button>
                <div className="text-xs font-semibold text-slate-600 sm:ml-auto sm:text-right">
                  {imageFiles.length}/{MAX_IMAGE_COUNT} selected
                </div>
              </div>

              {imagePreviews.length > 0 && (
                <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {imagePreviews.map((p, idx) => (
                    <div
                      key={p.url}
                      className="relative aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
                    >
                      <img src={p.url} alt={`Selected ${idx + 1}`} className="h-full w-full object-cover" loading="lazy" />
                      <button
                        type="button"
                        onClick={() => setImageFiles((cur) => cur.filter((_, i) => i !== idx))}
                        className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-900/10 bg-white/90 text-slate-900"
                        aria-label="Remove photo"
                      >
                        <FiX className="text-sm" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white/70 p-4">
              <div className="text-sm font-extrabold text-slate-900">Video</div>
              <div className="mt-1 text-xs font-semibold text-slate-600">Upload a video (max {formatBytes(MAX_VIDEO_SIZE)}) or paste a video URL.</div>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <input
                  id="sell-property-video"
                  type="file"
                  accept="video/*"
                  disabled={submitting}
                  onChange={(e) => {
                    const file = (e.target.files && e.target.files[0]) || null
                    e.target.value = ''
                    if (!file) return
                    if (typeof file.size === 'number' && file.size > MAX_VIDEO_SIZE) {
                      setStatus({ type: 'error', message: `Video must be <= ${formatBytes(MAX_VIDEO_SIZE)}.` })
                      return
                    }
                    setVideoFile(file)
                    if (status.message) setStatus({ type: '', message: '' })
                  }}
                  className="hidden"
                />
                <label
                  htmlFor="sell-property-video"
                  className={`inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-extrabold text-slate-800 ${
                    submitting ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                  }`}
                >
                  Select video
                </label>
                <button
                  type="button"
                  disabled={!videoFile || submitting}
                  onClick={() => setVideoFile(null)}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-extrabold text-slate-800 disabled:opacity-50"
                >
                  Clear
                </button>
                <div className="text-xs font-semibold text-slate-600 sm:ml-auto sm:text-right">
                  {videoFile ? videoFile.name : 'No file'}
                </div>
              </div>
              <input
                value={videoUrlInput}
                onChange={(e) => {
                  setVideoUrlInput(e.target.value)
                  if (status.message) setStatus({ type: '', message: '' })
                }}
                disabled={!!videoFile || submitting}
                className={`mt-3 w-full rounded-2xl border border-brand-900/20 bg-brand-900/10 px-4 py-3 text-sm font-semibold text-slate-900 outline-none focus:border-brand-900 ${
                  videoFile || submitting ? 'opacity-60' : ''
                }`}
                placeholder="Video URL (optional)"
              />

              {(videoPreviewUrl || cleanString(videoUrlInput)) && (
                <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-black">
                  <video
                    controls
                    className="h-48 w-full object-contain sm:h-56"
                    src={videoPreviewUrl || cleanString(videoUrlInput)}
                  />
                </div>
              )}
            </div>
          </div>

          {submitting && (
            <div className="mt-4 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <div className="truncate">{progress.label || 'Uploading…'}</div>
                <div className="ml-3 tabular-nums">{Math.max(0, Math.min(100, progress.percent))}%</div>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full bg-brand-900 transition-[width] duration-150"
                  style={{ width: `${Math.max(0, Math.min(100, progress.percent))}%` }}
                />
              </div>
            </div>
          )}

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
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!canSubmit}
              onClick={async () => {
                const ownerName = cleanString(form.ownerName)
                const ownerPhone = cleanString(form.ownerPhone)
                const ownerEmail = cleanString(form.ownerEmail) || undefined
                const title = cleanString(form.title)
                const description = cleanString(form.description)
                const city = cleanString(form.city) || undefined
                const state = cleanString(form.state) || undefined
                const price = cleanNumber(form.price)

                if (!ownerName || !ownerPhone || !title || !description) {
                  setStatus({ type: 'error', message: 'Please fill all required fields.' })
                  return
                }

                setSubmitting(true)
                setProgress({ percent: 0, label: 'Preparing…' })
                setStatus({ type: '', message: '' })
                try {
                  let images = []
                  if (imageFiles.length > 0) {
                    const uploaded = await uploadImages(imageFiles, {
                      onProgress: ({ percent }) => {
                        const loaded = imagesBytes * (Math.max(0, Math.min(100, percent)) / 100)
                        const overall = Math.round((loaded / totalBytes) * 100)
                        setProgress((cur) => ({
                          percent: Math.max(cur.percent, overall),
                          label: `Uploading photos (${imageFiles.length} files)…`,
                        }))
                      },
                    })
                    images = Array.isArray(uploaded?.files)
                      ? uploaded.files.map((f) => (f && typeof f.url === 'string' ? f.url : '')).filter(Boolean)
                      : []
                    setProgress((cur) => ({
                      percent: Math.max(cur.percent, Math.round((imagesBytes / totalBytes) * 100)),
                      label: 'Photos uploaded.',
                    }))
                  }

                  let videoUrl = cleanString(videoUrlInput) || undefined
                  if (videoFile) {
                    const uploadedVideo = await uploadVideo(videoFile, {
                      onProgress: ({ percent }) => {
                        const loadedVideo = videoBytes * (Math.max(0, Math.min(100, percent)) / 100)
                        const overall = Math.round(((imagesBytes + loadedVideo) / totalBytes) * 100)
                        setProgress((cur) => ({
                          percent: Math.max(cur.percent, overall),
                          label: 'Uploading video…',
                        }))
                      },
                    })
                    if (uploadedVideo && typeof uploadedVideo.url === 'string' && uploadedVideo.url.trim()) {
                      videoUrl = uploadedVideo.url.trim()
                    }
                    setProgress((cur) => ({
                      percent: Math.max(cur.percent, Math.round(((imagesBytes + videoBytes) / totalBytes) * 100)),
                      label: 'Video uploaded.',
                    }))
                  }

                  setProgress((cur) => ({
                    percent: Math.max(cur.percent, Math.round(((imagesBytes + videoBytes) / totalBytes) * 100)),
                    label: 'Submitting details…',
                  }))
                  await createSellPropertyRequest({
                    ownerName,
                    ownerPhone,
                    ownerEmail,
                    title,
                    description,
                    expectedPrice: price,
                    city,
                    state,
                    images,
                    videoUrl,
                  })

                  setProgress({ percent: 100, label: 'Done.' })
                  setStatus({ type: 'success', message: 'Submitted successfully. We will contact you soon.' })
                  setForm({
                    ownerName: '',
                    ownerPhone: '',
                    ownerEmail: '',
                    title: '',
                    description: '',
                    price: '',
                    city: '',
                    state: '',
                  })
                  setImageFiles([])
                  setVideoFile(null)
                  setVideoUrlInput('')
                } catch (err) {
                  const message = err && typeof err.message === 'string' && err.message.trim() ? err.message.trim() : 'Failed to submit.'
                  setStatus({ type: 'error', message })
                } finally {
                  setSubmitting(false)
                  setProgress({ percent: 0, label: '' })
                }
              }}
              className="rounded-2xl bg-brand-900 px-5 py-3 text-sm font-extrabold text-white disabled:opacity-60"
            >
              {submitting ? 'Submitting…' : 'Submit'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function SellPropertyModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)
  const value = useMemo(
    () => ({
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      isOpen,
    }),
    [isOpen],
  )

  return (
    <SellPropertyModalContext.Provider value={value}>
      {children}
      <SellPropertyModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </SellPropertyModalContext.Provider>
  )
}

export function SellPropertyModalTrigger({ children }) {
  const ctx = useContext(SellPropertyModalContext)
  const safe = ctx || { open: () => {}, close: () => {}, isOpen: false }
  return typeof children === 'function' ? children(safe) : children
}

export default SellPropertyModal
