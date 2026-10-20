import { useState } from 'react'
import { Button, Form } from '../styles'
export default function BlogForm({ onCreate }) {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [busy, setBusy] = useState(false)
  async function submit(event) {
    event.preventDefault()
    setBusy(true)
    try {
      const saved = await onCreate({
        title: title.trim(),
        author: author.trim(),
        url: url.trim(),
      })
      if (saved !== false) {
        setTitle('')
        setAuthor('')
        setUrl('')
      }
    } finally {
      setBusy(false)
    }
  }
  return (
    <Form onSubmit={submit} aria-label="Create blog">
      <label>
        Title
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>
      <label>
        Author
        <input value={author} onChange={(e) => setAuthor(e.target.value)} />
      </label>
      <label>
        URL
        <input
          type="url"
          required
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/article"
        />
      </label>
      <Button disabled={busy}>{busy ? 'Saving…' : 'Create blog'}</Button>
    </Form>
  )
}
