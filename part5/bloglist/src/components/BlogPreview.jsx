import { useState } from 'react'
import { Button, Card } from '../styles'
// Preserved exercise-stage component for 5.7 and 5.13–5.15; routed views use BlogDetails.
export default function BlogPreview({ blog, onLike }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <Card>
      <h2>{blog.title}</h2>
      <p>{blog.author}</p>
      <Button onClick={() => setExpanded(!expanded)}>
        {expanded ? 'Hide' : 'View'}
      </Button>
      {expanded && (
        <div>
          <p>{blog.url}</p>
          <p>{blog.likes} likes</p>
          <Button onClick={() => onLike(blog)}>Like</Button>
        </div>
      )}
    </Card>
  )
}
