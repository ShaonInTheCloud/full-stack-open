import { useEffect, useRef, useState } from 'react'
import {
  Link,
  NavLink,
  Navigate,
  Route,
  Routes,
  useNavigate,
  useParams,
} from 'react-router-dom'
import { api } from './services/api'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import BlogDetails from './components/BlogDetails'
import {
  Actions,
  Button,
  Card,
  Footer,
  GlobalStyle,
  Nav,
  Notice,
  Page,
} from './styles'
const sessionKey = 'readingRoomUser'
function readUser() {
  try {
    const saved = JSON.parse(localStorage.getItem(sessionKey))
    return saved?.token && saved?.username ? saved : null
  } catch {
    return null
  }
}
function DetailRoute({ blogs, loading, error, ...props }) {
  const { id } = useParams()
  if (loading) return <p role="status">Loading article…</p>
  if (error)
    return (
      <p role="alert">
        Unable to load this article. Please reload to try again.
      </p>
    )
  const blog = blogs.find((item) => item.id === id)
  return (
    <>
      <Link to="/">← All blogs</Link>
      {blog ? <BlogDetails blog={blog} {...props} /> : <h1>Blog not found</h1>}
    </>
  )
}
export default function App() {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(readUser)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [notice, setNotice] = useState(null)
  const [busy, setBusy] = useState(false)
  const timer = useRef(null)
  const mutation = useRef(false)
  const navigate = useNavigate()
  useEffect(() => {
    let active = true
    api
      .list()
      .then((data) => {
        if (active) setBlogs(data)
      })
      .catch(() => {
        if (active) setLoadError(true)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])
  useEffect(() => () => clearTimeout(timer.current), [])
  function notify(message, error = false) {
    clearTimeout(timer.current)
    setNotice({ message, error })
    timer.current = setTimeout(() => setNotice(null), 5000)
  }
  function logout() {
    localStorage.removeItem(sessionKey)
    setUser(null)
    navigate('/')
  }
  function failure(error) {
    if (error.status === 401) {
      logout()
      notify('Your session expired. Please log in again.', true)
    } else
      notify(error.message || 'Something went wrong. Please try again.', true)
  }
  async function login(credentials) {
    try {
      const loggedIn = await api.login(credentials)
      localStorage.setItem(sessionKey, JSON.stringify(loggedIn))
      setUser(loggedIn)
      navigate('/')
      notify(`Welcome, ${loggedIn.name || loggedIn.username}.`)
    } catch (error) {
      notify(
        error.status === 401
          ? 'Incorrect username or password.'
          : 'Unable to log in. Please try again.',
        true,
      )
    }
  }
  async function create(data) {
    try {
      const saved = await api.create(data, user.token)
      setBlogs((previous) => [
        ...previous,
        {
          ...saved,
          user: { id: user.id, name: user.name, username: user.username },
        },
      ])
      navigate('/')
      notify(`Added “${saved.title}”.`)
      return true
    } catch (error) {
      failure(error)
      return false
    }
  }
  async function like(blog) {
    if (!user || mutation.current) return
    mutation.current = true
    setBusy(true)
    try {
      const updated = await api.like(blog, user.token)
      setBlogs((previous) =>
        previous.map((item) =>
          item.id === blog.id ? { ...updated, user: item.user } : item,
        ),
      )
    } catch (error) {
      failure(error)
    } finally {
      mutation.current = false
      setBusy(false)
    }
  }
  async function remove(blog) {
    if (
      !window.confirm(
        `Delete “${blog.title}” by ${blog.author || 'Unknown author'}?`,
      )
    )
      return
    if (mutation.current) return
    mutation.current = true
    setBusy(true)
    try {
      await api.remove(blog.id, user.token)
      setBlogs((previous) => previous.filter((item) => item.id !== blog.id))
      navigate('/')
      notify('Blog deleted.')
    } catch (error) {
      failure(error)
    } finally {
      mutation.current = false
      setBusy(false)
    }
  }
  const sorted = [...blogs].sort(
    (a, b) => b.likes - a.likes || a.title.localeCompare(b.title),
  )
  return (
    <>
      <GlobalStyle />
      <Nav aria-label="Main navigation">
        <Link className="brand" to="/">
          Reading Room
        </Link>
        <NavLink to="/" end>
          All blogs
        </NavLink>
        {user ? (
          <>
            <NavLink to="/create">New blog</NavLink>
            <span>{user.name || user.username}</span>
            <Button onClick={logout}>Log out</Button>
          </>
        ) : (
          <NavLink to="/login">Log in</NavLink>
        )}
      </Nav>
      <Page>
        {notice && (
          <Notice
            $error={notice.error}
            role={notice.error ? 'alert' : 'status'}
          >
            {notice.message}
          </Notice>
        )}
        <Routes>
          <Route
            path="/"
            element={
              <>
                <p className="eyebrow">A place for good reads</p>
                <h1>Worth a bookmark.</h1>
                <p className="muted">
                  Share an article. Find a new perspective. Keep the good ones
                  close.
                </p>
                {loading ? (
                  <p role="status">Loading blogs…</p>
                ) : loadError ? (
                  <p role="alert">
                    Could not load blogs. Please reload to try again.
                  </p>
                ) : sorted.length === 0 ? (
                  <Card>
                    <h2>Your reading list starts here.</h2>
                    <p>No blogs yet. Log in to share the first one.</p>
                  </Card>
                ) : (
                  <section aria-label="Blogs">
                    {sorted.map((blog) => (
                      <Card key={blog.id} data-testid="blog-card">
                        <h2>
                          <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
                        </h2>
                        <p className="muted">
                          {blog.author || 'Unknown author'}
                        </p>
                        <span>{blog.likes} likes</span>
                      </Card>
                    ))}
                  </section>
                )}
              </>
            }
          />
          <Route
            path="/login"
            element={
              user ? (
                <Navigate to="/" replace />
              ) : (
                <>
                  <h1>Welcome back.</h1>
                  <p className="muted">Log in to add to the reading list.</p>
                  <LoginForm onLogin={login} />
                </>
              )
            }
          />
          <Route
            path="/create"
            element={
              user ? (
                <>
                  <h1>Share a good read.</h1>
                  <BlogForm onCreate={create} />
                  <Actions>
                    <Link to="/">Cancel</Link>
                  </Actions>
                </>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/blogs/:id"
            element={
              <DetailRoute
                blogs={blogs}
                loading={loading}
                error={loadError}
                user={user}
                onLike={like}
                onDelete={remove}
                busy={busy}
              />
            }
          />
          <Route
            path="*"
            element={
              <>
                <h1>Page not found</h1>
                <Link to="/">Back to all blogs</Link>
              </>
            }
          />
        </Routes>
      </Page>
      <Footer>Reading Room · Full Stack Open Blog List</Footer>
    </>
  )
}
