import { test, expect } from '@playwright/test'

// Smoke test: exercise a core BitstringStatusList round-trip in a real browser.
// The Node vitest suite (test/node) carries the full coverage; this only
// confirms the library loads and runs under chromium.
test('BitstringStatusList round-trips in the browser', async ({ page }) => {
  await page.goto('/test/index.html')
  const result = await page.evaluate(async () => {
    const { createList, decodeList, BitstringStatusList } =
      await import('/src/index.ts')
    const list = await createList({ length: 8 })
    list.setStatus(2, true)
    const encodedList = await list.encode()
    const decodedViaList = await decodeList({ encodedList })
    const decodedViaClass = await BitstringStatusList.decode({ encodedList })
    return {
      length: list.length,
      startsWithU: encodedList.startsWith('u'),
      status2: decodedViaList.getStatus(2),
      status3: decodedViaList.getStatus(3),
      status2FromClass: decodedViaClass.getStatus(2)
    }
  })
  expect(result.length).toBe(8)
  expect(result.startsWithU).toBe(true)
  expect(result.status2).toBe(true)
  expect(result.status3).toBe(false)
  expect(result.status2FromClass).toBe(true)
})
