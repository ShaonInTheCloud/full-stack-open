import { useState } from 'react'
import { Button, Form } from '../styles'
export default function LoginForm({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  async function submit(event) {
    event.preventDefault()
    setBusy(true)
    try {
      await onLogin({ username, password })
    } finally {
      setBusy(false)
      setPassword('')
    }
  }
  return (
    <Form onSubmit={submit} aria-label="Log in">
      <label>
        Username
        <input
          autoComplete="username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </label>
      <label>
        Password
        <input
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <Button disabled={busy}>{busy ? 'Logging in…' : 'Log in'}</Button>
    </Form>
  )
}
