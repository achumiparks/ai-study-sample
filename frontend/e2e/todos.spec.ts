import { test, expect } from '@playwright/test'

// NavRail 필터 클릭 헬퍼 (div 요소이므로 role=button 사용 불가)
function navItem(page: Parameters<Parameters<typeof test>[1]>[0], text: string) {
  return page.locator('span').filter({ hasText: new RegExp(`^${text}$`) }).first()
}

test.describe('Todo 앱 기본 기능', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/?mode=app')
    // 앱 모드에서 /todos로 리다이렉트 대기
    await page.waitForURL('**/todos**')
  })

  test('페이지 로드 및 레이아웃 확인', async ({ page }) => {
    // TopAppBar 타이틀
    await expect(page.getByText('My Todos')).toBeVisible()

    // NavRail 필터 메뉴 (span 안의 텍스트)
    await expect(navItem(page, '전체')).toBeVisible()
    await expect(navItem(page, '오늘')).toBeVisible()
    await expect(navItem(page, '다음 7일')).toBeVisible()

    // 샘플 할일 목록
    await expect(page.getByText('프로젝트 기획서 작성')).toBeVisible()
    await expect(page.getByText('주간 회의 준비')).toBeVisible()
  })

  test('할일 클릭 시 상세 패널 표시', async ({ page }) => {
    await page.getByText('프로젝트 기획서 작성').click()

    await expect(page.getByText('상세 편집')).toBeVisible()
    // 제목 input (name="title")
    await expect(page.locator('input[name="title"]')).toHaveValue('프로젝트 기획서 작성')
    // 설명 textarea (name="description")
    await expect(page.locator('textarea[name="description"]')).toHaveValue('다음 분기 프로젝트 기획서를 작성하고 팀장에게 제출한다.')
  })

  test('할일 제목 수정 및 저장', async ({ page }) => {
    await page.getByText('코드 리뷰').click()

    const titleInput = page.locator('input[name="title"]')
    await titleInput.clear()
    await titleInput.fill('코드 리뷰 완료')

    await page.getByRole('button', { name: '저장' }).click()

    await expect(page.getByText('코드 리뷰 완료')).toBeVisible()
  })

  test('새 할일 추가', async ({ page }) => {
    await page.getByRole('button', { name: '+ 새 할일 추가' }).click()

    // 목록에 '새 할일' 표시 (정확히 일치하는 p 요소)
    await expect(page.locator('p').filter({ hasText: /^새 할일$/ })).toBeVisible()
    await expect(page.getByText('상세 편집')).toBeVisible()
  })

  test('완료 토글', async ({ page }) => {
    const checkboxes = page.locator('input[type="checkbox"]')
    const firstCheckbox = checkboxes.first()

    const initialState = await firstCheckbox.isChecked()
    await firstCheckbox.click()
    await expect(firstCheckbox).toBeChecked({ checked: !initialState })
  })

  test('필터 - 오늘', async ({ page }) => {
    await navItem(page, '오늘').click()
    await expect(page).toHaveURL(/filter=today/)
  })

  test('필터 - 다음 7일', async ({ page }) => {
    await navItem(page, '다음 7일').click()
    await expect(page).toHaveURL(/filter=next7days/)
  })

  test('검색 필터링', async ({ page }) => {
    const searchInput = page.getByPlaceholder('검색...')
    await searchInput.fill('코드')

    await expect(page.getByText('코드 리뷰')).toBeVisible()
    await expect(page.getByText('프로젝트 기획서 작성')).not.toBeVisible()
  })

  test('완료 상태 드롭다운 필터', async ({ page }) => {
    await page.selectOption('select', '완료')

    await expect(page.getByText('주간 회의 준비')).toBeVisible()
    await expect(page.getByText('프로젝트 기획서 작성')).not.toBeVisible()
  })

  test('할일 삭제', async ({ page }) => {
    await page.getByText('분기 보고서 제출').click()
    await page.getByRole('button', { name: '삭제' }).click()

    await expect(page.getByText('분기 보고서 제출')).not.toBeVisible()
  })

  test('언어 전환 (ko → en)', async ({ page }) => {
    await page.getByRole('button', { name: 'EN' }).click()

    await expect(page.getByText('My Todos')).toBeVisible()
    // NavRail의 'All' span (정확히)
    await expect(page.locator('span').filter({ hasText: /^All$/ }).first()).toBeVisible()
    await expect(page.locator('span').filter({ hasText: /^Today$/ }).first()).toBeVisible()
    await expect(page.getByPlaceholder('Search...')).toBeVisible()
  })
})

test.describe('DevShell 카탈로그', () => {
  test('DevShell 로드 (기본 dev 모드)', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByText('DevShell')).toBeVisible()
    await expect(page.getByText('Component Catalog')).toBeVisible()
    await expect(page.getByText('PAGES')).toBeVisible()
    await expect(page.getByText('COMPONENTS')).toBeVisible()
  })

  test('DevShell - 페이지 트리에 Todos 표시', async ({ page }) => {
    await page.goto('/')

    // '▸Todos' 형태로 표시되므로 부분 텍스트 매칭
    await expect(page.locator('div').filter({ hasText: /^▸?Todos$/ }).first()).toBeVisible()
  })

  test('DevShell - App으로 이동 버튼', async ({ page }) => {
    await page.goto('/')

    await page.getByText('→ App으로 이동').click()
    await expect(page).toHaveURL(/\/todos/)
  })
})
