import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDiscountPercent(price: number, compareAtPrice?: number | null) {
  if (!compareAtPrice || compareAtPrice <= price) return null
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
}
