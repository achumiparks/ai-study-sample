export type FilterKey = 'all' | 'today' | 'next7days'

export interface FilterSection {
  key: FilterKey
  i18nKey: string
}

export const TODO_FILTERS: FilterSection[] = [
  { key: 'all', i18nKey: 'todos:filter.all' },
  { key: 'today', i18nKey: 'todos:filter.today' },
  { key: 'next7days', i18nKey: 'todos:filter.next7days' },
]
