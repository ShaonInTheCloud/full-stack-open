const assert = require('node:assert/strict')
const path = require('node:path')
const fs = require('node:fs')
const { createRequire } = require('node:module')
const { JSDOM } = require('jsdom')
const esbuild = require('esbuild')

async function check(name) {
  const folder = path.join(__dirname, 'part1', name)
  const requireApp = createRequire(path.join(folder, 'package.json'))
  const dom = new JSDOM('<!doctype html><div id="root"></div>', { url: 'http://localhost' })
  global.window = dom.window
  global.document = dom.window.document
  Object.defineProperty(global, 'navigator', { value: dom.window.navigator, configurable: true })
  global.IS_REACT_ACT_ENVIRONMENT = true
  const React = requireApp('react')
  const { createRoot } = requireApp('react-dom/client')
  const outfile = path.join(folder, '.check', 'App.cjs')
  await esbuild.build({ entryPoints: [path.join(folder, 'src/App.jsx')], bundle: true, platform: 'node', format: 'cjs', jsx: 'automatic', external: ['react', 'react/jsx-runtime'], outfile })
  const App = require(outfile).default
  const root = createRoot(document.getElementById('root'))
  const click = async text => {
    const button = [...document.querySelectorAll('button')].find(b => b.textContent === text)
    assert.ok(button, `Button exists: ${text}`)
    await React.act(async () => button.dispatchEvent(new window.MouseEvent('click', { bubbles: true })))
  }
  const errors = []
  const previousError = console.error
  const random = Math.random
  console.error = (...args) => errors.push(args.join(' '))
  try {
    await React.act(async () => root.render(React.createElement(App)))
    if (name === 'courseinfo') {
      assert.equal(document.querySelector('h1').textContent, 'Half Stack application development')
      const rows = [...document.querySelectorAll('main p')].map(p => p.textContent)
      assert.deepEqual(rows, ['Fundamentals of React 10', 'Using props to pass data 7', 'State of a component 14', 'Number of exercises 31'])
    } else if (name === 'unicafe') {
      assert.match(document.body.textContent, /No feedback given/)
      assert.equal(document.querySelector('table'), null)
      const value = label => [...document.querySelectorAll('tr')].find(tr => tr.querySelector('th').textContent === label).querySelector('td').textContent
      await click('bad')
      assert.equal(value('average'), '-1')
      assert.equal(value('positive'), '0 %')
      await click('good')
      await click('good')
      await click('neutral')
      assert.deepEqual(['good','neutral','bad','all','average','positive'].map(value), ['2','1','1','4','0.25','50 %'])
    } else {
      const current = () => [...document.querySelectorAll('section')][0]
      const popular = () => [...document.querySelectorAll('section')][1]
      const content = section => section.querySelector('p').textContent
      const count = section => section.querySelectorAll('p')[1].textContent
      const first = content(current())
      assert.equal(count(current()), 'has 0 votes')
      await click('vote')
      await click('vote')
      assert.equal(count(popular()), 'has 2 votes')
      Math.random = () => 0.999999
      await click('next anecdote')
      const last = content(current())
      assert.notEqual(first, last)
      assert.equal(count(current()), 'has 0 votes')
      await click('vote')
      await click('vote')
      assert.equal(content(popular()), first)
      await click('vote')
      assert.equal(content(popular()), last)
      assert.equal(count(popular()), 'has 3 votes')
      Math.random = () => 0
      await click('next anecdote')
      assert.equal(content(current()), first)
      assert.equal(count(current()), 'has 2 votes')
    }
    await React.act(async () => root.unmount())
    const fresh = createRoot(document.getElementById('root'))
    await React.act(async () => fresh.render(React.createElement(App)))
    if (name === 'unicafe') assert.match(document.body.textContent, /No feedback given/)
    if (name === 'anecdotes') assert.match(document.body.textContent, /has 0 votes/)
    await React.act(async () => fresh.unmount())
    assert.deepEqual(errors, [], 'No React errors')
    console.log(`PASS ${name}: rendering, expected values, interactions and fresh-session state`)
  } finally {
    console.error = previousError
    Math.random = random
    dom.window.close()
    fs.rmSync(path.join(folder, '.check'), { recursive: true, force: true })
  }
}
(async () => { for (const name of ['courseinfo', 'unicafe', 'anecdotes']) await check(name) })().catch(error => { console.error(error); process.exitCode = 1 })
