import { FaWhatsapp } from 'react-icons/fa'

const DEFAULT_WHATSAPP_NUMBER = '919000000000'

function normalizePhoneNumber(value) {
  return String(value || '').replace(/[^\d]/g, '')
}

export default function WhatsAppFloatingButton({ phoneNumber = DEFAULT_WHATSAPP_NUMBER, message = '' }) {
  const digits = normalizePhoneNumber(phoneNumber)
  const baseUrl = digits ? `https://wa.me/${digits}` : 'https://wa.me/'
  const href = message ? `${baseUrl}?text=${encodeURIComponent(message)}` : baseUrl

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#36d46b] text-white shadow-lg shadow-black/10 transition-colors  focus:outline-none focus:ring-2 hover:scale-[1.1] focus:ring-offset-2 focus:ring-offset-white sm:bottom-6 sm:right-6"
    >
      <FaWhatsapp className="text-3xl" />
      <span className="sr-only">WhatsApp</span>
    </a>
  )
}
