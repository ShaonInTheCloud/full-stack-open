async function request(path, { token, body, ...options } = {}) {
  const response = await fetch(`/api${path}`, {
    ...options,
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })
  if (response.status === 204) return null
  const data = await response.json().catch(() => null)
  if (!response.ok) {
    const error = new Error(
      data?.error || `Request failed (${response.status})`,
    )
    error.status = response.status
    throw error
  }
  return data
}
export const api = {
  list: () => request('/blogs'),
  login: (credentials) =>
    request('/login', { method: 'POST', body: credentials }),
  create: (body, token) => request('/blogs', { method: 'POST', body, token }),
  like: (blog, token) =>
    request(`/blogs/${blog.id}`, {
      method: 'PUT',
      body: { likes: blog.likes + 1 },
      token,
    }),
  remove: (id, token) => request(`/blogs/${id}`, { method: 'DELETE', token }),
}
