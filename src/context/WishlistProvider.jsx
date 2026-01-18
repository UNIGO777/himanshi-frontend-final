import { useCallback, useEffect, useMemo, useState } from 'react'
import { loadWishlistItems, normalizeWishlistItem, STORAGE_KEY, WishlistContext } from './WishlistContext'

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(() => {
    if (typeof window === 'undefined') return []

    return loadWishlistItems()
  })

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const hasItem = useCallback((id) => items.some((i) => i.id === id), [items])

  const addItem = useCallback((item) => {
    const normalized = normalizeWishlistItem(item)
    if (!normalized) return
    setItems((prev) => (prev.some((i) => i.id === normalized.id) ? prev : [normalized, ...prev]))
  }, [])

  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }, [])

  const toggleItem = useCallback((item) => {
    const normalized = normalizeWishlistItem(item)
    if (!normalized) return
    setItems((prev) =>
      prev.some((i) => i.id === normalized.id) ? prev.filter((i) => i.id !== normalized.id) : [normalized, ...prev],
    )
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      toggleItem,
      hasItem,
      clear,
    }),
    [addItem, clear, hasItem, items, removeItem, toggleItem],
  )

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}
