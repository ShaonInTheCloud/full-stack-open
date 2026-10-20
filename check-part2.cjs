const assert = require('node:assert/strict')
const path = require('node:path')
const fs = require('node:fs')
const { createRequire } = require('node:module')
const { JSDOM } = require('jsdom')
const esbuild = require('esbuild')

async function check(name) {
  const folder = path.join(__dirname, 'part2', name)
  const requireApp = createRequire(path.join(folder, 'package.json'))
  const dom = new JSDOM('<!doctype html><div id="root"></div>', { url: 'http://localhost' })
  global.window = dom.window; global.document = dom.window.document
  Object.defineProperty(global, 'navigator', { value: dom.window.navigator, configurable: true })
  global.IS_REACT_ACT_ENVIRONMENT = true
  const React = requireApp('react')
  const { createRoot } = requireApp('react-dom/client')
  const outfile = path.join(folder, '.check', 'App.cjs')
  await esbuild.build({ entryPoints: [path.join(folder, 'src/App.jsx')], bundle: true, platform: 'node', format: 'cjs', jsx: 'automatic', external: ['react', 'react/jsx-runtime', 'axios'], outfile })
  const App = require(outfile).default
  let root = createRoot(document.getElementById('root'))
  const act = React.act
  const body = () => document.body.textContent
  const click = async selector => {
    const element = document.querySelector(selector)
    assert.ok(element, selector)
    await act(async () => element.dispatchEvent(new window.MouseEvent('click', { bubbles: true })))
  }
  const input = async (selector, value) => {
    const element = document.querySelector(selector)
    await act(async () => {
      Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set.call(element, value)
      element.dispatchEvent(new window.Event('input', { bubbles: true }))
    })
  }
  const submit = async () => { await act(async () => document.querySelector('form').dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }))) }
  const mount = async () => { await act(async () => root.render(React.createElement(App))) }
  const remount = async () => { await act(async () => root.unmount()); root = createRoot(document.getElementById('root')); await mount() }
  const errors = []; const oldError = console.error
  console.error = (...args) => errors.push(args.join(' '))
  try {
    if (name === 'courseinfo') {
      await mount()
      assert.deepEqual([...document.querySelectorAll('.total span:last-child')].map(e => e.textContent), ['42', '10'])
      assert.equal(document.querySelectorAll('.row').length, 6)
      const courseOut = path.join(folder, '.check', 'Course.cjs')
      await esbuild.build({ entryPoints: [path.join(folder, 'src/components/Course.jsx')], bundle: true, platform: 'node', format: 'cjs', jsx: 'automatic', external: ['react', 'react/jsx-runtime'], outfile: courseOut })
      const Course = require(courseOut).default
      await act(async () => root.render(React.createElement(Course, { course: { name: 'Empty course', parts: [] } })))
      assert.match(body(), /Total exercises0/)
    }
    if (name === 'phonebook') {
      const axios = requireApp('axios').default
      let people = [{id:'1',name:'Ada Lovelace',number:'123'}, {id:'2',name:'Arto Hellas',number:'456'}]
      let failure = 0; const requests = []
      axios.defaults.adapter = async config => {
        requests.push(config.method)
        if (failure) throw { response: { status: failure } }
        const id = config.url.split('/').at(-1)
        const payload = config.data ? JSON.parse(config.data) : null
        let data
        if (config.method === 'get') data = [...people]
        if (config.method === 'post') { data = {...payload,id:'3'}; people.push(data) }
        if (config.method === 'put') { data = payload; people = people.map(p => p.id === id ? data : p) }
        if (config.method === 'delete') people = people.filter(p => p.id !== id)
        return {data,status:200,statusText:'OK',headers:{},config}
      }
      window.confirm = () => true
      await mount(); assert.match(body(), /Ada Lovelace/)
      await input('#filter','ADA'); assert.equal(document.querySelectorAll('.row').length,1)
      await input('#filter',''); await input('#name','Grace Hopper'); await input('#number','789'); await submit()
      assert.match(body(), /Added Grace Hopper/); assert.equal(people.length,3); assert.equal(document.querySelector('#name').value,'')
      await input('#name','ada lovelace'); await input('#number','999')
      window.confirm = () => false; await submit(); assert.equal(people[0].number,'123')
      window.confirm = () => true; await submit(); assert.equal(people[0].number,'999'); assert.match(body(),/Updated Ada Lovelace/)
      window.confirm = () => false; await click('[aria-label="Delete Grace Hopper"]'); assert.equal(people.length,3)
      window.confirm = () => true; await click('[aria-label="Delete Grace Hopper"]'); assert.equal(people.length,2)
      failure = 404; await input('#name','Ada Lovelace'); await input('#number','000'); await submit()
      assert.match(document.querySelector('[role="alert"]').textContent,/already been removed/)
      assert.equal(document.querySelector('[aria-label="Delete Ada Lovelace"]'),null)
      assert.equal(document.querySelector('#name').value,'Ada Lovelace')
      failure = 500; await input('#name','New Person'); await submit(); assert.match(body(),/Could not save/)
      assert.equal(document.querySelector('#name').value,'New Person')
      await remount(); assert.match(body(), /Could not load contacts/); assert.ok(document.querySelector('button[type="submit"]').disabled)
      for (const method of ['get','post','put','delete']) assert.ok(requests.includes(method))
    }
    if (name === 'countries') {
      const axios = requireApp('axios').default
      const country = (name, code) => ({name:{common:name},cca3:code,capital:[name+' City'],area:123,languages:{eng:'English'},capitalInfo:{latlng:[1,2]},flags:{svg:'https://example.com/flag.svg'}})
      const data = [country('Finland','FIN'),country('Iceland','ISL'),...Array.from({length:11},(_,i)=>country('Example '+i,'X'+i)),{name:{common:'Nowhere'},cca3:'NOW'}]
      let failCountries = false; let failWeather = false; let hold = false; let resolveWeather
      axios.defaults.adapter = async config => {
        if (config.url.includes('restcountries')) {
          if (failCountries) throw new Error('Offline')
          return {data,config,status:200,headers:{}}
        }
        if (failWeather) throw new Error('Offline')
        assert.equal(config.params.wind_speed_unit,'ms')
        const result = {data:{current:{temperature_2m:12,wind_speed_10m:3,weather_code:0,time:'2026-10-20T12:00'},timezone:'UTC'},config,status:200,headers:{}}
        if (hold) return new Promise(resolve => { resolveWeather = () => resolve(result) })
        return result
      }
      await mount(); assert.match(body(),/Start typing/)
      await input('#country-search','Example'); assert.match(body(), /Too many matches/)
      await input('#country-search','zzzz'); assert.match(body(),/No countries found/)
      await input('#country-search','land'); assert.equal(document.querySelectorAll('.row').length,2)
      await click('[aria-label="Show Finland"]'); assert.match(body(),/Finland City/); assert.match(body(),/12 °C/); assert.match(body(),/Wind: 3 m\/s/)
      await input('#country-search','ICELAND'); assert.match(body(),/Iceland City/)
      await input('#country-search','Nowhere'); assert.match(body(),/Capital coordinates are unavailable/)
      failWeather = true; await input('#country-search','Finland'); assert.match(body(),/Weather could not be loaded/)
      failWeather = false; hold = true; await input('#country-search','Iceland'); assert.match(body(),/Loading weather/)
      await input('#country-search','Nowhere'); await act(async()=>resolveWeather()); assert.doesNotMatch(body(),/12 °C/)
      failCountries = true; await remount(); assert.match(body(), /Countries could not be loaded/)
    }
    await act(async () => root.unmount())
    assert.deepEqual(errors, [], 'No React errors')
    console.log(`PASS part2/${name}: rendering, interactions and error handling`)
  } finally { console.error = oldError; dom.window.close(); fs.rmSync(path.join(folder,'.check'),{recursive:true,force:true}) }
}
(async()=>{for(const name of ['courseinfo','phonebook','countries']) await check(name)})().catch(error=>{console.error(error);process.exitCode=1})
