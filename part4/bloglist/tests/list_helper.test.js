const { test, describe } = require('node:test')
const assert = require('node:assert/strict')
const helper = require('../utils/list_helper')
const blogs = [
  { title: 'One', author: 'Ada', likes: 3 },
  { title: 'Two', author: 'Grace', likes: 8 },
  { title: 'Three', author: 'Ada', likes: 6 },
]
test('dummy returns one for empty and populated lists', () => {
  assert.equal(helper.dummy([]), 1); assert.equal(helper.dummy(blogs), 1)
})
describe('totalLikes', () => {
  test('empty list', () => assert.equal(helper.totalLikes([]), 0))
  test('one blog', () => assert.equal(helper.totalLikes([blogs[0]]), 3))
  test('several blogs', () => assert.equal(helper.totalLikes(blogs), 17))
})
describe('favoriteBlog', () => {
  test('empty list', () => assert.equal(helper.favoriteBlog([]), null))
  test('highest likes', () => assert.deepEqual(helper.favoriteBlog(blogs), blogs[1]))
  test('stable tie', () => assert.deepEqual(helper.favoriteBlog([blogs[1], { ...blogs[0], likes: 8 }]), blogs[1]))
})
describe('mostBlogs', () => {
  test('empty list', () => assert.equal(helper.mostBlogs([]), null))
  test('groups by author', () => assert.deepEqual(helper.mostBlogs(blogs), { author: 'Ada', blogs: 2 }))
  test('ties return the first author', () => assert.deepEqual(helper.mostBlogs(blogs.slice(0, 2)), { author: 'Ada', blogs: 1 }))
})
describe('mostLikes', () => {
  test('empty list', () => assert.equal(helper.mostLikes([]), null))
  test('sums by author', () => assert.deepEqual(helper.mostLikes(blogs), { author: 'Ada', likes: 9 }))
  test('zero likes still has a winner', () => assert.deepEqual(helper.mostLikes([{ author: 'Ada', likes: 0 }]), { author: 'Ada', likes: 0 }))
})
