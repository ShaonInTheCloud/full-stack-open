import styled, { createGlobalStyle } from 'styled-components'
export const GlobalStyle = createGlobalStyle`
  * { box-sizing: border-box; } body { margin: 0; color: #193c36; background: #f5f4ef; font-family: system-ui, sans-serif; line-height: 1.6; }
  h1,h2,h3 { line-height: 1.2; } h1 { font-family: Georgia, serif; font-size: clamp(2rem,5vw,3.5rem); letter-spacing: -.035em; }
  a { color: #175b4d; text-underline-offset: .2em; overflow-wrap: anywhere; } button,input { font: inherit; } :focus-visible { outline: 3px solid #b47d32; outline-offset: 4px; }
  label { display: grid; gap: .35rem; font-weight: 600; } input { width: 100%; border: 1px solid #9aaea5; border-radius: 8px; padding: .7rem; background: white; color: #193c36; }
  button { cursor: pointer; } button:disabled { opacity: .6; cursor: wait; } p { overflow-wrap: anywhere; } .muted { color: #536c63; } .eyebrow { font-size: .75rem; text-transform: uppercase; letter-spacing: .15em; }
`
export const Page = styled.main`
  max-width: 940px;
  margin: 3rem auto;
  padding: 0 1.25rem;
  min-height: 65vh;
`
export const Nav = styled.nav`
  background: #163d37;
  color: white;
  padding: 1rem max(1.25rem, calc((100vw - 900px) / 2));
  display: flex;
  align-items: center;
  gap: 1.25rem;
  flex-wrap: wrap;
  a {
    color: white;
    text-decoration: none;
    padding: 0.35rem;
  }
  a:hover,
  a.active {
    text-decoration: underline;
  }
  .brand {
    font-family: Georgia, serif;
    font-size: 1.3rem;
    margin-right: auto;
  }
`
export const Button = styled.button`
  border: 1px solid #175b4d;
  color: ${(p) => (p.$secondary ? '#175b4d' : 'white')};
  background: ${(p) => (p.$secondary ? 'transparent' : '#175b4d')};
  padding: 0.55rem 1rem;
  border-radius: 7px;
  font-weight: 650;
  &:hover:not(:disabled) {
    background: ${(p) => (p.$secondary ? '#e6ede8' : '#103e34')};
  }
`
export const Card = styled.article`
  background: white;
  border: 1px solid #d5dfd8;
  border-radius: 14px;
  padding: clamp(1rem, 3vw, 2rem);
  margin: 1rem 0;
  box-shadow: 0 5px 20px #193c3606;
  h2 {
    margin-top: 0;
  }
`
export const Form = styled.form`
  display: grid;
  gap: 1.2rem;
  max-width: 520px;
  background: white;
  border: 1px solid #d5dfd8;
  border-radius: 14px;
  padding: 1.5rem;
  button {
    justify-self: start;
  }
`
export const Notice = styled.div`
  border-left: 4px solid ${(p) => (p.$error ? '#a62929' : '#287a51')};
  background: ${(p) => (p.$error ? '#fff0ed' : '#e8f3eb')};
  padding: 1rem;
  margin-bottom: 1.5rem;
  color: ${(p) => (p.$error ? '#7a2020' : '#17452c')};
  border-radius: 5px;
`
export const Actions = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 1rem;
`
export const Footer = styled.footer`
  max-width: 940px;
  padding: 1.5rem 1.25rem;
  margin: auto;
  border-top: 1px solid #d5dfd8;
  color: #536c63;
  font-size: 0.85rem;
`
