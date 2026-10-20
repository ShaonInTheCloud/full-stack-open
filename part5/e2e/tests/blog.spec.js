import { test, expect } from '@playwright/test'
const backend = 'http://127.0.0.1:3003'
const owner = {
  username: 'reader',
  name: 'Test Reader',
  password: 'test-only-password',
}
async function login(
  page,
  username = owner.username,
  password = owner.password,
) {
  await page.goto('/login')
  await page.getByLabel('Username').fill(username)
  await page.getByLabel('Password').fill(password)
  await page.getByRole('button', { name: 'Log in', exact: true }).click()
}
async function add(page, title = 'A browser-tested blog') {
  await page.getByRole('link', { name: 'New blog', exact: true }).click()
  await page.getByLabel('Title').fill(title)
  await page.getByLabel('Author').fill('Test Author')
  await page.getByLabel('URL').fill('https://example.com/article')
  await page.getByRole('button', { name: 'Create blog', exact: true }).click()
  await expect(
    page.getByRole('link', { name: title, exact: true }),
  ).toBeVisible()
}
test.beforeEach(async ({ request, page }) => {
  expect((await request.post(`${backend}/api/testing/reset`)).status()).toBe(
    204,
  )
  expect(
    (await request.post(`${backend}/api/users`, { data: owner })).status(),
  ).toBe(201)
  await page.goto('/')
})
test('login form and incorrect credentials', async ({ page }) => {
  await login(page, owner.username, 'wrong-password')
  await expect(page.getByRole('alert')).toHaveText(
    'Incorrect username or password.',
  )
  await expect(page.getByLabel('Username')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Log out' })).toHaveCount(0)
})
test('login persists on refresh and logout clears it', async ({ page }) => {
  await login(page)
  await expect(page.getByRole('button', { name: 'Log out' })).toBeVisible()
  await page.reload()
  await expect(page.getByRole('button', { name: 'Log out' })).toBeVisible()
  await page.getByRole('button', { name: 'Log out' }).click()
  await page.reload()
  await expect(
    page.getByRole('link', { name: 'Log in', exact: true }),
  ).toBeVisible()
})
test('create, like twice, retain author, reload detail and delete', async ({
  page,
}) => {
  await login(page)
  await add(page)
  await page
    .getByRole('link', { name: 'A browser-tested blog', exact: true })
    .click()
  await page.getByRole('button', { name: 'Like', exact: true }).click()
  await expect(page.getByTestId('likes')).toHaveText('1 likes')
  await page.getByRole('button', { name: 'Like', exact: true }).click()
  await expect(page.getByTestId('likes')).toHaveText('2 likes')
  await expect(page.getByText('Added by Test Reader')).toBeVisible()
  await page.reload()
  await expect(page.getByTestId('likes')).toHaveText('2 likes')
  page.once('dialog', (dialog) => dialog.accept())
  await page.getByRole('button', { name: 'Delete blog' }).click()
  await expect(
    page.getByRole('link', { name: 'A browser-tested blog', exact: true }),
  ).toHaveCount(0)
  await expect(page.getByText('Blog deleted.')).toBeVisible()
})
test('non-owners cannot delete; anonymous readers cannot mutate', async ({
  page,
  request,
}) => {
  await login(page)
  await add(page)
  await page.getByRole('button', { name: 'Log out' }).click()
  await page
    .getByRole('link', { name: 'A browser-tested blog', exact: true })
    .click()
  await expect(page.getByTestId('likes')).toBeVisible()
  await expect(
    page.getByRole('button', { name: 'Like', exact: true }),
  ).toHaveCount(0)
  await request.post(`${backend}/api/users`, {
    data: {
      username: 'other',
      name: 'Other Reader',
      password: 'another-test-password',
    },
  })
  await login(page, 'other', 'another-test-password')
  await page
    .getByRole('link', { name: 'A browser-tested blog', exact: true })
    .click()
  await expect(
    page.getByRole('button', { name: 'Like', exact: true }),
  ).toBeVisible()
  await expect(page.getByRole('button', { name: 'Delete blog' })).toHaveCount(0)
})
test('blog list sorts by likes', async ({ page, request }) => {
  const auth = await (
    await request.post(`${backend}/api/login`, {
      data: { username: owner.username, password: owner.password },
    })
  ).json()
  for (const [title, likes] of [
    ['Middle', 2],
    ['First', 5],
    ['Last', 0],
  ]) {
    await request.post(`${backend}/api/blogs`, {
      data: { title, likes, author: 'Author', url: 'https://example.com' },
      headers: { Authorization: `Bearer ${auth.token}` },
    })
  }
  await page.reload()
  await expect(page.getByTestId('blog-card').getByRole('heading')).toHaveText([
    'First',
    'Middle',
    'Last',
  ])
})
