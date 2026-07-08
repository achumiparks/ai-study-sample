import { useMemo } from 'react'

export type AppMode = 'dev' | 'app'

/**
 * 우선순위: (개발빌드 한정) URL ?mode= > 환경변수 VITE_APP_MODE > 기본 'dev'
 * PROD 빌드에서는 URL 오버라이드 무시 → VITE_APP_MODE=app 로 빌드
 */
export function useAppMode(): AppMode {
  return useMemo(() => {
    if (import.meta.env.DEV) {
      const m = new URLSearchParams(location.search).get('mode')
      if (m === 'dev' || m === 'app') return m
    }
    const env = import.meta.env.VITE_APP_MODE
    if (env === 'dev' || env === 'app') return env as AppMode
    return 'dev'
  }, [])
}
