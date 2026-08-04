import { createI18n } from 'vue-i18n'
import en from './locales/en'
import vi from './locales/vi'

export const i18n = createI18n({
  legacy: false, // use Composition API
  locale: localStorage.getItem('lang') || 'en',
  fallbackLocale: 'vi',
  messages: {
    en,
    vi
  }
})
