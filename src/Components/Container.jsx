export default function Container({ children, className = '' }) {
  return <div className={`mx-auto w-full max-w-screen-2xl px-3 sm:px-6 lg:px-10 ${className}`}>{children}</div>
}
