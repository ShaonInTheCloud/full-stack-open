const { test, describe, before, after, beforeEach } = require('node:test')
const assert = require('node:assert/strict')
const { randomBytes } = require('node:crypto')
process.env.SECRET = randomBytes(32).toString('hex')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const supertest = require('supertest')
const { MongoMemoryServer } = require('mongodb-memory-server')
const app = require('../app')
const User = require('../models/user')
const Blog = require('../models/blog')
const api = supertest(app)
let mongo, owner, token, blog
const newBlog = { title: 'Learning React', author: 'Sample Author', url: 'https://example.com/react', likes: 5 }
before(async () => {
  mongo = await MongoMemoryServer.create()
  await mongoose.connect(mongo.getUri(), { dbName: 'bloglist_test' })
  await User.init()
})
after(async () => { await mongoose.disconnect(); if (mongo) await mongo.stop() })
beforeEach(async () => {
  await Blog.deleteMany({}); await User.deleteMany({})
  owner = await User.create({ username: 'reader', name: 'Test Reader', passwordHash: await bcrypt.hash('testing-password', 4) })
  token = jwt.sign({ id: owner.id, username: owner.username }, process.env.SECRET, { expiresIn: '1h' })
  blog = await Blog.create({ ...newBlog, user: owner._id })
})
describe('blog API', () => {
  test('GET returns JSON, public IDs and populated creators without a token', async () => {
    const { body } = await api.get('/api/blogs').expect(200).expect('Content-Type', /json/)
    assert.equal(body.length, 1); assert.equal(body[0].id, blog.id); assert.equal(body[0]._id, undefined)
    assert.equal(body[0].user.username, 'reader'); assert.equal(body[0].user.passwordHash, undefined)
  })
  test('POST persists a blog and ignores a spoofed creator', async () => {
    const { body } = await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send({ ...newBlog, user: new mongoose.Types.ObjectId().toString() }).expect(201)
    assert.equal(await Blog.countDocuments({}), 2)
    const saved = await Blog.findById(body.id)
    assert.equal(saved.title, newBlog.title); assert.equal(saved.user.toString(), owner.id)
  })
  test('missing likes defaults to zero', async () => {
    const { likes: _likes, ...withoutLikes } = newBlog
    const result = await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(withoutLikes).expect(201)
    assert.equal(result.body.likes, 0)
  })
  test('missing title or URL fails without inserting data', async () => {
    for (const key of ['title', 'url']) {
      const input = { ...newBlog }; delete input[key]
      await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(input).expect(400)
    }
    assert.equal(await Blog.countDocuments({}), 1)
  })
  test('missing, invalid and expired tokens cannot create a blog', async () => {
    await api.post('/api/blogs').send(newBlog).expect(401)
    for (const value of ['broken', jwt.sign({ id: owner.id }, 'wrong-secret'), jwt.sign({ id: owner.id }, process.env.SECRET, { expiresIn: -1 })]) {
      await api.post('/api/blogs').set('Authorization', `Bearer ${value}`).send(newBlog).expect(401)
    }
    assert.equal(await Blog.countDocuments({}), 1)
  })
  test('token of a deleted user is rejected', async () => {
    await User.findByIdAndDelete(owner.id)
    await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(newBlog).expect(401)
  })
  test('only the creator can delete and population stays consistent', async () => {
    await api.delete(`/api/blogs/${blog.id}`).expect(401)
    const other = await User.create({ username: 'another', passwordHash: 'not-used-for-login' })
    const otherToken = jwt.sign({ id: other.id }, process.env.SECRET)
    await api.delete(`/api/blogs/${blog.id}`).set('Authorization', `Bearer ${otherToken}`).expect(403)
    assert.equal(await Blog.countDocuments({}), 1)
    await api.delete(`/api/blogs/${blog.id}`).set('Authorization', `Bearer ${token}`).expect(204)
    assert.equal(await Blog.countDocuments({}), 0)
    const users = await api.get('/api/users').expect(200)
    assert.equal(users.body.find(user => user.id === owner.id).blogs.length, 0)
    await api.delete(`/api/blogs/${blog.id}`).set('Authorization', `Bearer ${token}`).expect(404)
  })
  test('PUT changes likes but cannot transfer ownership', async () => {
    const result = await api.put(`/api/blogs/${blog.id}`).send({ likes: 12, user: new mongoose.Types.ObjectId().toString(), title: 'Tampered' }).expect(200)
    assert.equal(result.body.likes, 12); assert.equal(result.body.user, owner.id); assert.equal(result.body.title, newBlog.title)
    assert.equal((await Blog.findById(blog.id)).likes, 12)
    for (const likes of [-1, 1.5, '3']) await api.put(`/api/blogs/${blog.id}`).send({ likes }).expect(400)
  })
  test('malformed and missing IDs return appropriate responses', async () => {
    await api.put('/api/blogs/bad').send({ likes: 1 }).expect(400)
    await api.delete('/api/blogs/bad').set('Authorization', `Bearer ${token}`).expect(400)
    await api.put(`/api/blogs/${new mongoose.Types.ObjectId()}`).send({ likes: 1 }).expect(404)
  })
})
describe('users and login', () => {
  test('creates a user, hashes the password and never returns hashes', async () => {
    const result = await api.post('/api/users').send({ username: 'newreader', name: 'New Reader', password: 'new-test-password' }).expect(201)
    assert.equal(result.body.passwordHash, undefined); assert.equal(result.body.password, undefined)
    const saved = await User.findById(result.body.id).select('+passwordHash')
    assert.notEqual(saved.passwordHash, 'new-test-password')
    assert.ok(await bcrypt.compare('new-test-password', saved.passwordHash))
    const users = await api.get('/api/users').expect(200)
    assert.equal(users.body.length, 2)
    assert.ok(users.body.every(user => !user.passwordHash && !user.password))
    assert.equal(users.body.find(user => user.id === owner.id).blogs[0].title, newBlog.title)
  })
  test('invalid and duplicate users are rejected without insertion', async () => {
    for (const input of [{}, { username: 'ab', password: 'valid' }, { username: 'valid', password: 'ab' }, { username: 'reader', password: 'valid' }, { username: 'valid' }, { password: 'valid' }, { username: 'valid', password: 'x'.repeat(73) }]) {
      const result = await api.post('/api/users').send(input).expect(400)
      assert.ok(result.body.error)
    }
    assert.equal(await User.countDocuments({}), 1)
  })
  test('simultaneous duplicate usernames yield one success', async () => {
    const results = await Promise.all([1, 2].map(() => api.post('/api/users').send({ username: 'concurrent', password: 'testing' })))
    assert.deepEqual(results.map(result => result.status).sort(), [201, 400])
    assert.equal(await User.countDocuments({ username: 'concurrent' }), 1)
  })
  test('login issues a valid token and rejects bad credentials', async () => {
    const result = await api.post('/api/login').send({ username: 'reader', password: 'testing-password' }).expect(200)
    assert.equal(jwt.verify(result.body.token, process.env.SECRET).id, owner.id)
    assert.equal(result.body.passwordHash, undefined)
    await api.post('/api/login').send({ username: 'reader', password: 'wrong' }).expect(401)
    await api.post('/api/login').send({ username: 'missing', password: 'wrong' }).expect(401)
    await api.post('/api/login').send({}).expect(401)
  })
  test('bad JSON and unknown routes return JSON errors', async () => {
    await api.post('/api/login').set('Content-Type', 'application/json').send('{bad').expect(400)
    await api.get('/missing').expect(404).expect('Content-Type', /json/)
  })
})
