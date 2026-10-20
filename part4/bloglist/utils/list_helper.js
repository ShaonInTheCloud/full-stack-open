const dummy = _blogs => 1
const totalLikes = blogs => blogs.reduce((total, blog) => total + (blog.likes || 0), 0)
const favoriteBlog = blogs => blogs.reduce((best, blog) => !best || blog.likes > best.likes ? blog : best, null)
const topAuthor = (blogs, field, value) => {
  const totals = new Map()
  for (const blog of blogs) totals.set(blog.author, (totals.get(blog.author) || 0) + value(blog))
  let best = null
  for (const [author, count] of totals) if (!best || count > best[field]) best = { author, [field]: count }
  return best
}
const mostBlogs = blogs => topAuthor(blogs, 'blogs', () => 1)
const mostLikes = blogs => topAuthor(blogs, 'likes', blog => blog.likes || 0)
module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }
