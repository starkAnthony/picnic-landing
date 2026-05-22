export type Locale = 'uz' | 'ru' | 'en'

export const defaultLocale: Locale = 'uz'

export const locales: Locale[] = ['uz', 'ru', 'en']

export const localeLabels: Record<Locale, string> = {
  uz: 'UZ',
  ru: 'RU',
  en: 'EN',
}

export type PackageItem = {
  name: string
  description: string
  features: string[]
  popular?: boolean
}

export type StepItem = {
  title: string
  text: string
}

export type ReviewItem = {
  quote: string
  name: string
  occasion: string
}

export type Translations = {
  meta: {
    title: string
    description: string
  }
  nav: {
    packages: string
    gallery: string
    news: string
    howItWorks: string
    reviews: string
    book: string
    reserve: string
    openMenu: string
    closeMenu: string
  }
  hero: {
    eyebrow: string
    title: string
    titleEmphasis: string
    text: string
    bookCta: string
    packagesCta: string
    statGuests: string
    statRating: string
    statLocations: string
    cardBadge: string
    cardTitle: string
    cardPrice: string
    imageAlt: string
  }
  gallery: {
    label: string
    title: string
    subtitle: string
    viewMore: string
    loading: string
    prev: string
    next: string
    slide: string
  }
  instagram: {
    title: string
    subtitle: string
    loading: string
    notConnected: string
    viewMore: string
  }
  news: {
    label: string
    title: string
    news: string
    event: string
    loading: string
  }
  packages: {
    label: string
    title: string
    subtitle: string
    popularBadge: string
    priceOnRequest: string
    select: string
    loading: string
    items: PackageItem[]
  }
  howItWorks: {
    label: string
    title: string
    subtitle: string
    steps: StepItem[]
  }
  testimonials: {
    label: string
    title: string
    starsLabel: string
    items: ReviewItem[]
  }
  booking: {
    label: string
    title: string
    subtitle: string
    viewInstagram: string
    perks: string[]
    successTitle: string
    successText: string
    submitting: string
    submit: string
    errorNotConfigured: string
    errorNoApi: string
    errorChatNotFound: string
    errorBadToken: string
    errorFailed: string
    errorNetwork: string
    name: string
    namePlaceholder: string
    email: string
    emailPlaceholder: string
    package: string
    packagePlaceholder: string
    packageOptions: { value: string; label: string }[]
    date: string
    guests: string
    notes: string
    notesPlaceholder: string
  }
  footer: {
    tagline: string
    explore: string
    connect: string
    phone: string
    telegram: string
    instagram: string
    rights: string
  }
  brand: string
}
