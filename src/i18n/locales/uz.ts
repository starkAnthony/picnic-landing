import type { Translations } from '../types'

const uz: Translations = {
  brand: 'Sevinc Picnic',
  meta: {
    title: 'Sevinc Picnic — Bayramingiz uchun atmosfera',
    description:
      'Piknik dizaynida foto zona, ochiq havoda bayramlar uchun bezak va tashkillashtirish, piknik buyumlarini ijaraga berish.',
  },
  nav: {
    packages: 'Xizmatlar',
    gallery: 'Galereya',
    news: 'Yangiliklar',
    howItWorks: 'Qanday ishlaydi',
    reviews: 'Sharhlar',
    book: 'Bron',
    reserve: 'Bog‘lanish',
    openMenu: 'Menyuni ochish',
    closeMenu: 'Menyuni yopish',
  },
  hero: {
    eyebrow: 'Bayramingiz uchun atmosfera',
    title: 'Ochiq havoda',
    titleEmphasis: ' sehrli bayramlar',
    text: 'Piknik uslubida bezakli foto zona, tug‘ilgan kun va takliflar uchun shaxsiy dizayn hamda piknik buyumlarini ijaraga beramiz. Siz g‘oyangizni ayting — biz manzarani yaratamiz.',
    bookCta: 'Buyurtma berish',
    packagesCta: 'Xizmatlarni ko‘rish',
    statGuests: 'Instagram postlar',
    statRating: 'Obunachilar',
    statLocations: 'Asosiy xizmatlar',
    cardBadge: 'Asosiy xizmat',
    cardTitle: 'Bezakli foto zona',
    cardPrice: 'Narxlar — kelishuv asosida',
    imageAlt: 'Sevinc Picnic — bezakli ochiq havoda foto zona',
  },
  gallery: {
    label: 'Galereya',
    title: 'Bizning ishlarimiz',
    subtitle:
      'Foto zonalar, bayram bezaklari va piknik tadbirlari. Ko‘proq surat va videolar Instagramda.',
    viewMore: 'Instagramda ko‘rish',
    loading: 'Yuklanmoqda…',
    prev: 'Oldingi suratlar',
    next: 'Keyingi suratlar',
    slide: 'Slayd',
  },
  instagram: {
    title: 'Instagramdan',
    subtitle: 'So‘nggi surat va videolar — jonli lenta (sozlanganida).',
    loading: 'Yuklanmoqda…',
    notConnected: 'Instagram API ulanmagan. Hozircha profilingizga o‘ting:',
    viewMore: 'Instagramda ko‘rish',
  },
  news: {
    label: 'Yangiliklar',
    title: 'Yangiliklar va tadbirlar',
    news: 'Yangilik',
    event: 'Tadbir',
    loading: 'Yuklanmoqda…',
  },
  packages: {
    label: 'Xizmatlar',
    title: 'Biz nima taklif qilamiz',
    subtitle:
      'Sevinc Picnic — ochiq havoda uchrashuvlar, bayramlar va maxsus lahzalar uchun bezak, tashkillashtirish va ijaraga berish.',
    popularBadge: 'Eng ko‘p buyurtma',
    priceOnRequest: 'Narx — kelishuv asosida',
    select: 'Buyurtma berish',
    loading: 'Yuklanmoqda…',
    items: [
      {
        name: 'Bezakli foto zona',
        description:
          'Piknik dizaynida surat va video uchun tayyorlangan foto zona — adyolalar, gullar, shamollar va sizning mavzuingizga mos bezak.',
        features: [
          'Piknik uslubida to‘liq bezak',
          'Surat/video uchun tayyor muhit',
          'Mavzu va ranglar bo‘yicha moslashtirish',
          'Joylashtirish va yig‘ish',
        ],
        popular: true,
      },
      {
        name: 'Tadbir dizayni va tashkillashtirish',
        description:
          'Tug‘ilgan kun, «Menga turmushga chiq», uchrashuvlar va boshqa ochiq havoda bayramlar uchun shaxsiy g‘oya, bezak va tashkil etish.',
        features: [
          'Tug‘ilgan kun va yubiley',
          'Taklif (marry me) va romantik tadbirlar',
          'Uchrashuvlar va oilaviy bayramlar',
          'Shaxsiy dizayn va dekor',
        ],
      },
      {
        name: 'Piknik buyumlarini ijaraga berish',
        description:
          'O‘z tadbiringiz uchun piknik stoli, adyolalar, idish-tovoq, shamdonlar va boshqa aksessuarlarni ijaraga oling.',
        features: [
          'Adyollar va yostiqchalar',
          'Stol va piknik idishlari',
          'Shamdon va dekor elementlari',
          'Muddat va miqdor bo‘yicha moslash',
        ],
      },
    ],
  },
  howItWorks: {
    label: 'Qanday ishlaydi',
    title: 'G‘oyadan tayyor bayramgacha',
    subtitle:
      'Instagram sahifamizdagi ishlarimizdan ilhom oling — har bir loyiha sizning tadbiringiz uchun alohida yaratiladi.',
    steps: [
      {
        title: 'Biz bilan bog‘laning',
        text: 'Tadbir turi, sana, mehmonlar soni va istaklaringizni yozing. Instagram orqali ham murojaat qilishingiz mumkin.',
      },
      {
        title: 'Dizayn va tayyorgarlik',
        text: 'Bezak, foto zona yoki to‘liq tadbir konsepsiyasini tayyorlaymiz. Kerak bo‘lsa, ijaraga buyumlar tanlanadi.',
      },
      {
        title: 'Bayram va yig‘ish',
        text: 'Joyda hammasi tayyor. Siz zavqlanasiz — o‘rnatish va yig‘ishni biz bajaramiz (ijara bo‘yicha qaytarish ham shu jumladan).',
      },
    ],
  },
  testimonials: {
    label: 'Sharhlar',
    title: 'Mijozlarimiz nima deydi',
    starsLabel: '5 dan 5 yulduz',
    items: [
      {
        quote:
          'Tug‘ilgan kun uchun foto zona buyurtma qildik — bezak ajoyib edi, suratlar Instagramga mos keldi. Hammaga yoqdi!',
        name: 'Dilnoza K.',
        occasion: 'Tug‘ilgan kun',
      },
      {
        quote:
          '«Menga turmushga chiq» uchun tashkillashtirishdi. Har narsa vaqtida, romantik va juda chiroyli bo‘ldi. Rahmat, Sevinc!',
        name: 'Kamola va Sardor',
        occasion: 'Taklif',
      },
      {
        quote:
          'Piknik stoli va adyollalarni ijaraga oldik — o‘zimiz ham tez bezadik. Sifat yaxshi, qaytarish oson bo‘ldi.',
        name: 'Nilufar A.',
        occasion: 'Ijara',
      },
    ],
  },
  booking: {
    label: 'Buyurtma',
    title: 'Tadbiringizni rejalashtiramizmi?',
    subtitle:
      'Quyidagi formani to‘ldiring yoki Instagramda yozing — tez orada javob beramiz va narxni kelishamiz.',
    viewInstagram: 'Ishlarimizni Instagramda ko‘ring',
    perks: [
      'Har bir tadbir uchun alohida dizayn',
      'Tug‘ilgan kun, taklif, uchrashuv va boshqa bayramlar',
      'Foto zona va piknik buyumlari ijarasi',
    ],
    successTitle: 'Rahmat!',
    successText:
      'So‘rovingiz qabul qilindi. Tez orada Telegram orqali bog‘lanamiz.',
    submitting: 'Yuborilmoqda…',
    errorNotConfigured:
      'Telegram bot sozlanmagan. Vercel-da TELEGRAM_BOT_TOKEN va TELEGRAM_CHAT_ID qo‘ying.',
    errorNoApi:
      'Bu funksiya faqat internetdagi saytda ishlaydi (npm run dev emas). Vercel manzilini oching yoki npx vercel dev ishlating.',
    errorChatNotFound:
      'TELEGRAM_CHAT_ID noto‘g‘ri. Guruh uchun: botni guruhga qo‘shing, guruhda xabar yozing, getUpdates dan -100... id oling. Shaxsiy chat uchun: botda Start bosing. Vercel-da yangilab Redeploy qiling.',
    errorGroupUpgraded:
      'Telegram guruh “supergroup” ga o‘zgardi — eski chat id ishlamaydi. Guruhda xabar yozing, getUpdates dan yangi -100... id ni Vercel TELEGRAM_CHAT_ID ga qo‘ying va Redeploy qiling.',
    errorBadToken: 'Bot token noto‘g‘ri. Vercel-dagi TELEGRAM_BOT_TOKEN ni tekshiring.',
    errorFailed: 'Yuborishda xatolik. Birozdan keyin qayta urinib ko‘ring yoki telefon orqali bog‘laning.',
    errorNetwork: 'Internet yoki server bilan aloqa yo‘q. Qayta urinib ko‘ring.',
    name: 'Ism',
    namePlaceholder: 'Ismingiz',
    email: 'Telefon yoki Telegram',
    emailPlaceholder: '+998 99 442 60 30',
    package: 'Xizmat',
    packagePlaceholder: 'Xizmatni tanlang',
    packageOptions: [
      { value: 'photo-zone', label: 'Bezakli foto zona' },
      { value: 'event-design', label: 'Tadbir dizayni va tashkillashtirish' },
      { value: 'rental', label: 'Piknik buyumlarini ijaraga berish' },
      { value: 'combo', label: 'Bir nechta xizmat (kombinatsiya)' },
    ],
    date: 'Tadbir sanasi',
    guests: 'Mehmonlar soni',
    decors: 'Qo‘shimcha bezaklar',
    decorsLabel: 'Qo‘shimcha bezaklar',
    decorsHint: 'Kerakli bezaklarni tanlang (ixtiyoriy). Narx so‘rov bo‘yicha kelishiladi.',
    decorViewLarge: 'Kattaroq ko‘rish',
    decorPreviewClose: 'Yopish',
    decorPreviewSelect: 'Tanlash',
    decorPreviewSelected: 'Tanlangan',
    notes: 'Qo‘shimcha ma’lumot',
    notesPlaceholder: 'Tadbir turi, mavzu, joy, maxsus istaklar...',
    submit: 'So‘rov yuborish',
  },
  footer: {
    tagline: 'Bayramingiz uchun atmosfera — piknik dizayni, foto zona va ochiq havoda tadbirlar.',
    explore: 'Bo‘limlar',
    connect: 'Aloqa',
    phone: 'Telefon',
    telegram: 'Telegram',
    instagram: 'Instagram',
    rights: 'Barcha huquqlar himoyalangan.',
  },
}

export default uz
