const assert = require('node:assert/strict')
const path = require('node:path')
const fs = require('node:fs')
const { createRequire } = require('node:module')
const { JSDOM } = require('jsdom')
const esbuild = require('esbuild')

async function main() {
  const folder = path.join(__dirname, 'part3/phonebook/frontend')
  const requireApp = createRequire(path.join(folder, 'package.json'))
  const dom = new JSDOM('<div id="root"></div>', { url: 'http://localhost' })
  global.window = dom.window; global.document = dom.window.document
  Object.defineProperty(global, 'navigator', { value: dom.window.navigator, configurable: true })
  global.IS_REACT_ACT_ENVIRONMENT = true
  const React = requireApp('react')
  const { createRoot } = requireApp('react-dom/client')
  const axios = requireApp('axios').default
  let reject = true
  axios.defaults.adapter = async config => {
    assert.equal(config.url, '/api/persons')
    if (config.method === 'get') return { data: [], status: 200, config, headers: {} }
    if (reject) throw { response: { status: 400, data: { error: 'Number must contain at least 8 characters' } } }
    return { data: { ...JSON.parse(config.data), id: 'saved' }, status: 201, config, headers: {} }
  }
  const outfile = path.join(folder, '.check/App.cjs')
  await esbuild.build({ entryPoints: [path.join(folder, 'src/App.jsx')], bundle: true, platform: 'node', format: 'cjs', jsx: 'automatic', external: ['react', 'react/jsx-runtime', 'axios'], outfile })
  const App = require(outfile).default
  const root = createRoot(document.getElementById('root'))
  try {
    await React.act(async () => root.render(React.createElement(App)))
    const input = async (id, value) => React.act(async () => {
      const element = document.getElementById(id)
      Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set.call(element, value)
      element.dispatchEvent(new window.Event('input', { bubbles: true }))
    })
    const submit = async () => React.act(async () => document.querySelector('form').dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true })))
    await input('name', 'Grace Hopper'); await input('number', '09-1'); await submit()
    assert.match(document.querySelector('[role="alert"]').textContent, /at least 8 characters/)
    assert.equal(document.getElementById('name').value, 'Grace Hopper')
    reject = false; await input('number', '09-1234567'); await submit()
    assert.match(document.body.textContent, /Added Grace Hopper/)
    assert.equal(document.getElementById('name').value, '')
    console.log('PASS Part 3 frontend: validation feedback, preserved inputs, corrected retry')
  } finally {
    await React.act(async () => root.unmount())
    dom.window.close(); fs.rmSync(path.join(folder, '.check'), { recursive: true, force: true })
  }
}
main().catch(error => { console.error(error); process.exitCode = 1 })
