import type { Locale, Translations } from '../types'
import en from './en'
import ru from './ru'
import uz from './uz'

export const translations: Record<Locale, Translations> = {
  uz,
  ru,
  en,
}
