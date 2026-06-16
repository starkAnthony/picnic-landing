import type { Translations } from '../types'

const en: Translations = {
  brand: 'Sevinc Picnic',
  meta: {
    title: 'Sevinc Picnic — Atmosphere for your celebration',
    description:
      'Picnic-style photo zones, outdoor event styling and organization, and picnic equipment rental.',
  },
  nav: {
    packages: 'Services',
    gallery: 'Gallery',
    news: 'News',
    howItWorks: 'How It Works',
    reviews: 'Reviews',
    book: 'Book',
    reserve: 'Get in Touch',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
  },
  hero: {
    eyebrow: 'Atmosphere for your celebration',
    title: 'Outdoor celebrations',
    titleEmphasis: ' with style',
    text: 'Decorated picnic photo zones, personal design for birthdays and proposals, and picnic gear rental. Share your idea — we create the setting.',
    bookCta: 'Request a Quote',
    packagesCta: 'View Services',
    statGuests: 'Instagram posts',
    statRating: 'Followers',
    statLocations: 'Core services',
    cardBadge: 'Signature service',
    cardTitle: 'Decorated photo zone',
    cardPrice: 'Price on request',
    imageAlt: 'Sevinc Picnic — decorated outdoor photo zone',
  },
  gallery: {
    label: 'Gallery',
    title: 'Our work',
    subtitle: 'Photo zones, party décor, and picnic setups. More photos and videos on Instagram.',
    viewMore: 'View on Instagram',
    loading: 'Loading…',
    prev: 'Previous photos',
    next: 'Next photos',
    slide: 'Slide',
  },
  instagram: {
    title: 'From Instagram',
    subtitle: 'Latest photos and videos — live feed when connected.',
    loading: 'Loading…',
    notConnected: 'Instagram API not connected. Visit profile:',
    viewMore: 'View on Instagram',
  },
  news: {
    label: 'News',
    title: 'News & events',
    news: 'News',
    event: 'Event',
    loading: 'Loading…',
  },
  packages: {
    label: 'Services',
    title: 'What we offer',
    subtitle:
      'Sevinc Picnic — décor, planning, and rentals for outdoor gatherings, parties, and special moments.',
    popularBadge: 'Most booked',
    customBadge: 'Custom project',
    priceOnRequest: 'Price on request',
    select: 'Request this service',
    loading: 'Loading…',
    items: [
      {
        name: 'Decorated photo zone',
        description:
          'A picnic-themed setup for photos and video — blankets, florals, candles, and décor matched to your theme.',
        features: [
          'Full picnic-style styling',
          'Camera-ready scene',
          'Custom theme and colors',
          'Setup and teardown',
        ],
        popular: true,
      },
      {
        name: 'Event design & organization',
        description:
          'Personal styling and coordination for birthdays, “Marry me” proposals, meetups, and other outdoor celebrations.',
        features: [
          'Birthdays and anniversaries',
          'Proposals and romantic events',
          'Meetings and family gatherings',
          'Custom décor and concept',
        ],
      },
      {
        name: 'Picnic equipment rental',
        description:
          'Rent picnic tables, blankets, tableware, candle holders, and accessories for your own outdoor event.',
        features: [
          'Blankets and cushions',
          'Tables and picnic sets',
          'Candles and décor pieces',
          'Flexible duration and quantity',
        ],
      },
    ],
  },
  howItWorks: {
    label: 'How It Works',
    title: 'From idea to celebration',
    subtitle:
      'Browse our work on Instagram — every project is tailored to your occasion.',
    steps: [
      {
        title: 'Get in touch',
        text: 'Tell us the event type, date, guest count, and wishes. You can also message us on Instagram.',
      },
      {
        title: 'Design & preparation',
        text: 'We plan décor, the photo zone, or the full event concept. Rental items are selected if needed.',
      },
      {
        title: 'Celebrate — we wrap up',
        text: 'Everything is ready on site. You enjoy the moment — we handle setup, pack-down, and rental returns.',
      },
    ],
  },
  testimonials: {
    label: 'Reviews',
    title: 'What clients say',
    starsLabel: '5 out of 5 stars',
    items: [
      {
        quote:
          'We booked a photo zone for a birthday — the décor was stunning and perfect for Instagram. Everyone loved it!',
        name: 'Dilnoza K.',
        occasion: 'Birthday',
      },
      {
        quote:
          'They organized our “Marry me” surprise — everything was on time, romantic, and beautiful. Thank you, Sevinc!',
        name: 'Kamola & Sardor',
        occasion: 'Proposal',
      },
      {
        quote:
          'Rented a picnic table and blankets — we styled it quickly ourselves. Good quality and easy return.',
        name: 'Nilufar A.',
        occasion: 'Rental',
      },
    ],
  },
  booking: {
    label: 'Book',
    title: 'Planning your event?',
    subtitle:
      'Fill out the form or message us on Instagram — we will reply soon with availability and a quote.',
    viewInstagram: 'See our photos & videos on Instagram',
    perks: [
      'Custom design for every occasion',
      'Birthdays, proposals, meetups, and more',
      'Photo zones and equipment rental',
    ],
    successTitle: 'Thank you!',
    successText: 'Your request was received. We will contact you on Telegram soon.',
    submitting: 'Sending…',
    errorNotConfigured:
      'Telegram bot is not set up. Add TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID on Vercel.',
    errorNoApi:
      'This only works on the deployed site, not npm run dev. Open your Vercel URL or run npx vercel dev.',
    errorChatNotFound:
      'Wrong TELEGRAM_CHAT_ID. For a group: add the bot, send a message in the group, copy the -100... id from getUpdates. For DM: press Start in the bot. Update Vercel and Redeploy.',
    errorGroupUpgraded:
      'Your Telegram group became a supergroup — the old chat id no longer works. Send a message in the group, copy the new -100... id from getUpdates into Vercel TELEGRAM_CHAT_ID, then Redeploy.',
    errorBadToken: 'Invalid bot token. Check TELEGRAM_BOT_TOKEN on Vercel.',
    errorFailed: 'Could not send. Please try again or call us.',
    errorNetwork: 'Connection error. Please try again.',
    name: 'Name',
    namePlaceholder: 'Your name',
    email: 'Phone or Telegram',
    emailPlaceholder: '+998 99 442 60 30',
    package: 'Service',
    packagePlaceholder: 'Select a service',
    packageOptions: [
      { value: 'photo-zone', label: 'Decorated photo zone' },
      { value: 'event-design', label: 'Event design & organization' },
      { value: 'rental', label: 'Picnic equipment rental' },
      { value: 'custom', label: 'Custom project / bespoke design' },
      { value: 'combo', label: 'Multiple services (bundle)' },
    ],
    date: 'Event date',
    guests: 'Number of guests',
    decors: 'Extra décor',
    decorsLabel: 'Extra décor',
    decorsHint: 'Pick any add-ons you want (optional). Pricing is on request.',
    decorViewLarge: 'View larger',
    decorPreviewClose: 'Close',
    decorPreviewSelect: 'Select',
    decorPreviewSelected: 'Selected',
    notes: 'Additional details',
    notesPlaceholder: 'Event type, theme, location, special requests...',
    customBriefLabel: 'About your project',
    customBriefHint:
      'Describe your theme, colors, décor, location, and wishes — we will plan the design from this.',
    customBriefPlaceholder:
      'E.g. romantic proposal, white and blush, candles, by the river, 2 guests...',
    customRequired: 'Please describe your custom project.',
    customTelegramTag: 'CUSTOM PROJECT',
    submit: 'Send request',
  },
  footer: {
    tagline: 'Atmosphere for your celebration — picnic décor, photo zones, and outdoor events.',
    explore: 'Sections',
    connect: 'Connect',
    phone: 'Phone',
    telegram: 'Telegram',
    instagram: 'Instagram',
    rights: 'All rights reserved.',
  },
}

export default en
