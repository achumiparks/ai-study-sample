import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import type { Resource } from 'i18next'

// Vite glob import for all locale JSON files
const localeModules = import.meta.glob('./locales/**/*.json', { eager: true })

const resources: Resource = {}

for (const path in localeModules) {
  // path: ./locales/ko/common.json
  const parts = path.replace('./locales/', '').replace('.json', '').split('/')
  const lng = parts[0]!
  const ns = parts[1]!
  if (!resources[lng]) resources[lng] = {}
  resources[lng][ns] = (localeModules[path] as { default: Record<string, string> }).default
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ko',
    fallbackLng: 'ko',
    defaultNS: 'common',
    ns: ['common', 'todos'],
    interpolation: { escapeValue: false },
  })

export default i18n
