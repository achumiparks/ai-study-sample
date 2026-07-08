import { useTranslation } from 'react-i18next'
import { Row } from '@/components/primitives'
import { Button } from '@/components/atoms'

interface TopAppBarProps {
  title: string
}

export default function TopAppBar({ title }: TopAppBarProps) {
  const { i18n } = useTranslation()

  function toggleLang() {
    i18n.changeLanguage(i18n.language === 'ko' ? 'en' : 'ko')
  }

  return (
    <Row
      justify="between"
      align="center"
      className="h-14 px-5 bg-white border-b border-gray-200 flex-shrink-0 shadow-sm"
    >
      <span className="text-base font-bold text-gray-800">{title}</span>
      <Button variant="ghost" onClick={toggleLang} className="text-xs px-2 py-1">
        {i18n.language === 'ko' ? 'EN' : '한'}
      </Button>
    </Row>
  )
}
