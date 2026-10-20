import { describe, expect, test, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogPreview from './BlogPreview'
import BlogDetails from './BlogDetails'
import BlogForm from './BlogForm'
const blog = {
  id: '1',
  title: 'A useful read',
  author: 'Alex Reader',
  url: 'https://example.com/read',
  likes: 7,
  user: { id: 'owner', username: 'alex', name: 'Alex' },
}
describe('Exercise-stage preview', () => {
  test('shows title and author but hides details initially', () => {
    render(<BlogPreview blog={blog} onLike={vi.fn()} />)
    expect(screen.getByText(blog.title)).toBeVisible()
    expect(screen.getByText(blog.author)).toBeVisible()
    expect(screen.queryByText(blog.url)).not.toBeInTheDocument()
    expect(screen.queryByText('7 likes')).not.toBeInTheDocument()
  })
  test('expands details and calls the like handler twice', async () => {
    const user = userEvent.setup()
    const like = vi.fn()
    render(<BlogPreview blog={blog} onLike={like} />)
    await user.click(screen.getByRole('button', { name: 'View' }))
    expect(screen.getByText(blog.url)).toBeVisible()
    expect(screen.getByText('7 likes')).toBeVisible()
    await user.click(screen.getByRole('button', { name: 'Like' }))
    await user.click(screen.getByRole('button', { name: 'Like' }))
    expect(like).toHaveBeenCalledTimes(2)
  })
})
describe('Routed blog details', () => {
  test('unauthenticated readers see details without buttons', () => {
    render(<BlogDetails blog={blog} />)
    expect(screen.getByText('7 likes')).toBeVisible()
    expect(screen.getByRole('link', { name: blog.url })).toHaveAttribute(
      'href',
      blog.url,
    )
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
  test('another user sees only Like', () => {
    render(
      <BlogDetails blog={blog} user={{ id: 'other', username: 'other' }} />,
    )
    expect(screen.getByRole('button', { name: 'Like' })).toBeVisible()
    expect(
      screen.queryByRole('button', { name: 'Delete blog' }),
    ).not.toBeInTheDocument()
  })
  test('the owner sees Like and Delete', () => {
    render(<BlogDetails blog={blog} user={blog.user} />)
    expect(screen.getByRole('button', { name: 'Like' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'Delete blog' })).toBeVisible()
  })
  test('unsafe URLs are never rendered as executable links', () => {
    render(<BlogDetails blog={{ ...blog, url: 'javascript:alert(1)' }} />)
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })
})
test('blog form sends the exact values to its parent', async () => {
  const user = userEvent.setup()
  const create = vi.fn().mockResolvedValue(true)
  render(<BlogForm onCreate={create} />)
  await user.type(screen.getByLabelText('Title'), 'New read')
  await user.type(screen.getByLabelText('Author'), 'Sam')
  await user.type(screen.getByLabelText('URL'), 'https://example.com/new')
  await user.click(screen.getByRole('button', { name: 'Create blog' }))
  expect(create).toHaveBeenCalledWith({
    title: 'New read',
    author: 'Sam',
    url: 'https://example.com/new',
  })
  expect(screen.getByLabelText('Title')).toHaveValue('')
})
test('a failed creation preserves entered values', async () => {
  const user = userEvent.setup()
  render(<BlogForm onCreate={vi.fn().mockResolvedValue(false)} />)
  await user.type(screen.getByLabelText('Title'), 'Keep this')
  await user.type(screen.getByLabelText('URL'), 'https://example.com/new')
  await user.click(screen.getByRole('button', { name: 'Create blog' }))
  expect(screen.getByLabelText('Title')).toHaveValue('Keep this')
})
