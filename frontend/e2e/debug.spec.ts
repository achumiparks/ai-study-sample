import { test, expect } from '@playwright/test'

test('DOM 구조 진단', async ({ page }) => {
  await page.goto('/todos')
  // TopAppBar가 실제로 화면에 보일 때까지 대기
  await expect(page.locator('.h-14')).toBeVisible({ timeout: 5000 })
  await page.screenshot({ path: '/tmp/debug-waited.png', fullPage: true })

  const info = await page.evaluate(() => {
    // DesktopFrame 내부 white box 찾기
    const whiteBox = document.querySelector('.bg-white.shadow-md') as HTMLElement
    const outlet = whiteBox?.firstElementChild as HTMLElement
    const todoPage = outlet?.firstElementChild as HTMLElement

    // My Todos 텍스트 element 찾기
    const myTodosEl = Array.from(document.querySelectorAll('*'))
      .find(el => el.textContent?.trim() === 'My Todos') as HTMLElement

    return {
      whiteBox: whiteBox ? {
        h: whiteBox.offsetHeight,
        w: whiteBox.offsetWidth,
        display: getComputedStyle(whiteBox).display,
        overflow: getComputedStyle(whiteBox).overflow,
      } : null,
      outlet: outlet ? {
        h: outlet.offsetHeight,
        w: outlet.offsetWidth,
        className: outlet.className,
      } : null,
      todoPage: todoPage ? {
        h: todoPage.offsetHeight,
        w: todoPage.offsetWidth,
        className: todoPage.className,
      } : null,
      myTodosEl: myTodosEl ? {
        tag: myTodosEl.tagName,
        rect: myTodosEl.getBoundingClientRect(),
        visible: myTodosEl.offsetHeight > 0,
      } : null,
      // TopAppBar 직접 찾기
      topAppBar: (() => {
        const el = document.querySelector('.h-14') as HTMLElement
        return el ? { rect: el.getBoundingClientRect(), h: el.offsetHeight } : null
      })(),
      // TodoPage Stack children 수
      todoPageChildren: todoPage?.children.length,
      // Suspense fallback 확인
      suspenseFallback: document.querySelector('.flex-1.flex.items-center.justify-center')?.textContent,
    }
  })
  console.log('White box:', JSON.stringify(info.whiteBox))
  console.log('Outlet:', JSON.stringify(info.outlet))
  console.log('TodoPage children:', info.todoPageChildren, '| h:', info.todoPage?.h)
  console.log('TopAppBar (.h-14):', JSON.stringify(info.topAppBar))
  console.log('Suspense fallback:', info.suspenseFallback)
  console.log('My Todos element:', JSON.stringify(info.myTodosEl))
})
