import { Actions, Button, Card } from '../styles'
export default function BlogDetails({
  blog,
  user,
  onLike,
  onDelete,
  busy = false,
}) {
  const owner = blog.user?.id || blog.user
  const canDelete =
    user && (owner === user.id || blog.user?.username === user.username)
  let safeUrl = null
  try {
    const parsed = new URL(blog.url)
    if (['https:', 'http:'].includes(parsed.protocol)) safeUrl = parsed.href
  } catch {
    /* Render invalid URLs as text. */
  }
  return (
    <Card>
      <p className="eyebrow">Saved article</p>
      <h1>{blog.title}</h1>
      <p>By {blog.author || 'Unknown author'}</p>
      <p>
        {safeUrl ? (
          <a href={safeUrl} target="_blank" rel="noopener noreferrer">
            {blog.url}
          </a>
        ) : (
          blog.url
        )}
      </p>
      <p data-testid="likes">{blog.likes} likes</p>
      <p className="muted">
        Added by {blog.user?.name || blog.user?.username || 'a reader'}
      </p>
      {user && (
        <Actions>
          <Button disabled={busy} onClick={() => onLike(blog)}>
            Like
          </Button>
          {canDelete && (
            <Button $secondary disabled={busy} onClick={() => onDelete(blog)}>
              Delete blog
            </Button>
          )}
        </Actions>
      )}
    </Card>
  )
}
