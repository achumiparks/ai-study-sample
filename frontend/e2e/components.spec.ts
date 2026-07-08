import { test, expect } from '@playwright/test'

/**
 * 레지스트리에 등록된 모든 컴포넌트를 DevShell에서 순회하며
 * 1) 사이드바에 이름과 파일명이 표시되는지
 * 2) /dev/components/:name 프리뷰가 에러 없이 렌더링되는지
 * 확인한다.
 */

const COMPONENTS = [
  // organisms
  { name: 'Header',          file: 'TopAppBar.tsx' },
  { name: 'NavRail',         file: 'NavRail.tsx' },
  { name: 'TodosView',       file: 'TodosView.tsx' },
  // panels
  { name: 'TodoListPanel',   file: 'TodoListPanel.tsx' },
  { name: 'TodoDetailPanel', file: 'TodoDetailPanel.tsx' },
  // atoms
  { name: 'Button',          file: 'Button.tsx' },
  { name: 'TextField',       file: 'TextField.tsx' },
  { name: 'Select',          file: 'Select.tsx' },
  { name: 'Checkbox',        file: 'Checkbox.tsx' },
  // primitives
  { name: 'Box',             file: 'Box.tsx' },
  { name: 'Stack',           file: 'Stack.tsx' },
  { name: 'Row',             file: 'Row.tsx' },
  { name: 'Text',            file: 'Text.tsx' },
]

test.describe('DevShell 사이드바 - 파일명 표시', () => {
  test('COMPONENTS 섹션에 모든 컴포넌트 이름과 파일명이 표시된다', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('COMPONENTS')).toBeVisible()

    for (const comp of COMPONENTS) {
      // 이름 확인 (정확히 매칭)
      await expect(
        page.locator('span').filter({ hasText: new RegExp(`^${comp.name}$`) }).first()
      ).toBeVisible()

      // 파일명 확인 (font-mono 스타일의 sublabel)
      await expect(
        page.locator('span.font-mono').filter({ hasText: `(${comp.file})` }).first()
      ).toBeVisible()
    }
  })
})

test.describe('DevShell 컴포넌트 프리뷰 - 렌더링 오류 없음', () => {
  for (const comp of COMPONENTS) {
    test(`${comp.name} (${comp.file}) 프리뷰가 정상 렌더링된다`, async ({ page }) => {
      // 콘솔 에러 수집
      const errors: string[] = []
      page.on('console', msg => {
        if (msg.type() === 'error') errors.push(msg.text())
      })
      page.on('pageerror', err => errors.push(err.message))

      await page.goto(`/dev/components/${comp.name}`)

      // Vite HMR 에러 오버레이가 없어야 함
      await expect(page.locator('vite-error-overlay')).toHaveCount(0)

      // 컴포넌트 이름이 프리뷰 헤더에 표시됨
      await expect(
        page.locator('h3').filter({ hasText: comp.name }).first()
      ).toBeVisible()

      // React 런타임 에러가 없어야 함
      const reactErrors = errors.filter(e =>
        e.includes('Error') && !e.includes('favicon') && !e.includes('ResizeObserver')
      )
      expect(reactErrors, `${comp.name}: 콘솔 에러 발생\n${reactErrors.join('\n')}`).toHaveLength(0)
    })
  }
})
