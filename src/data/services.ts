import type { Service } from '../types/content'

/** Default cards when Supabase has no services yet */
export const staticServices: Service[] = [
  {
    id: 'static-photo-zone',
    name: 'Bezakli foto zona',
    description:
      'Piknik dizaynida surat va video uchun tayyorlangan foto zona — adyolalar, gullar, shamollar va sizning mavzuingizga mos bezak.',
    price_text: 'Kelishuv asosida',
    price_amount: null,
    features: [
      'Piknik uslubida to‘liq bezak',
      'Surat/video uchun tayyor muhit',
      'Mavzu va ranglar bo‘yicha moslashtirish',
      'Joylashtirish va yig‘ish',
    ],
    is_popular: true,
    is_custom: false,
    sort_order: 0,
  },
  {
    id: 'static-event-design',
    name: 'Tadbir dizayni va tashkillashtirish',
    description:
      'Tug‘ilgan kun, taklif va boshqa ochiq havoda bayramlar uchun shaxsiy g‘oya, bezak va tashkil etish.',
    price_text: 'Kelishuv asosida',
    price_amount: null,
    features: [
      'Tug‘ilgan kun va yubiley',
      'Taklif va romantik tadbirlar',
      'Uchrashuvlar va oilaviy bayramlar',
      'Shaxsiy dizayn va dekor',
    ],
    is_popular: false,
    is_custom: false,
    sort_order: 1,
  },
  {
    id: 'static-rental',
    name: 'Piknik buyumlarini ijaraga berish',
    description:
      'Piknik stoli, adyolalar, idish-tovoq, shamdonlar va boshqa aksessuarlarni ijaraga oling.',
    price_text: 'Kelishuv asosida',
    price_amount: null,
    features: [
      'Adyollar va yostiqchalar',
      'Stol va piknik idishlari',
      'Shamdon va dekor elementlari',
      'Muddat va miqdor bo‘yicha moslash',
    ],
    is_popular: false,
    is_custom: false,
    sort_order: 2,
  },
  {
    id: 'static-custom',
    name: 'Individual loyiha / maxsus dizayn',
    description:
      'O‘z qoidalaringiz, mavzu va dizayningiz bo‘yicha to‘liq moslashtirilgan marosim — bezak, joylash va tafsilotlarni birga rejalashtiramiz.',
    price_text: 'Kelishuv asosida',
    price_amount: null,
    features: [
      'Shaxsiy mavzu va ranglar',
      'Maxsus bezak va joylash rejalari',
      'Taklif, tug‘ilgan kun, uchrashuv va boshqalar',
      'Maslahat va narx — loyiha bo‘yicha',
    ],
    is_popular: false,
    is_custom: true,
    sort_order: 3,
  },
]
