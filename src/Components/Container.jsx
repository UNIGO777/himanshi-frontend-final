export default function Container({ children, className = '' }) {
  return <div className={`mx-auto w-full  px-3 sm:px-6 lg:px-10 ${className}`}>{children}</div>
}
