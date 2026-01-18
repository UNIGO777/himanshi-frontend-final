import { createContext } from 'react'

export const STORAGE_KEY = 'hp_wishlist_v1'

export function safeParseWishlist(raw) {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function normalizeWishlistItem(item) {
  if (!item || typeof item !== 'object') return null
  if (typeof item.id !== 'string' || item.id.trim().length === 0) return null

  return {
    id: item.id,
    title: typeof item.title === 'string' ? item.title : '',
    image: typeof item.image === 'string' ? item.image : '',
    price: typeof item.price === 'string' ? item.price : '',
    location: typeof item.location === 'string' ? item.location : '',
  }
}

export const WishlistContext = createContext(null)

export function loadWishlistItems() {
  if (typeof window === 'undefined') return []
  return safeParseWishlist(window.localStorage.getItem(STORAGE_KEY))
    .map(normalizeWishlistItem)
    .filter(Boolean)
}
