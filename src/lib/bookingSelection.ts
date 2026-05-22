export const BOOKING_SERVICE_KEY = 'booking-service'

export const BOOKING_SERVICE_EVENT = 'booking-select-service'

export function setBookingService(serviceId: string) {
  try {
    sessionStorage.setItem(BOOKING_SERVICE_KEY, serviceId)
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent(BOOKING_SERVICE_EVENT))
}

export function scrollToBooking() {
  document.getElementById('book')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

/** Apply saved id if it exists in allowed values; keeps storage until matched */
export function readPendingBookingService(allowedIds: string[]): string | null {
  try {
    const saved = sessionStorage.getItem(BOOKING_SERVICE_KEY)
    if (!saved || !allowedIds.includes(saved)) return null
    sessionStorage.removeItem(BOOKING_SERVICE_KEY)
    return saved
  } catch {
    return null
  }
}
