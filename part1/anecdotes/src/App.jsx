import { useState } from 'react'

const anecdotes = [
  'A useful error message explains the next step, not just the last failure.',
  'Small changes leave fewer places for a bug to hide.',
  'A variable name is a tiny piece of documentation that gets read often.',
  'The quickest fix still needs a reason why it works.',
  'A passing test is evidence about a case, not a promise about every case.',
  'A clear function is easier to improve than a clever mystery.',
  'An empty list is data too; give it a sensible screen.',
  'If an interface needs a long explanation, try a simpler interface.',
]

const Anecdote = ({ text, votes }) => (
  <div>
    <p>{text}</p>
    <p>has {votes} votes</p>
  </div>
)

const App = () => {
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0))
  const highestVotes = Math.max(...votes)
  const mostVoted = votes.indexOf(highestVotes)

  const vote = () => {
    setVotes(current => {
      const updated = [...current]
      updated[selected] += 1
      return updated
    })
  }

  const next = () => {
    setSelected(Math.floor(Math.random() * anecdotes.length))
  }

  return (
    <main>
      <section aria-labelledby="current-heading">
        <h1 id="current-heading">Anecdote of the day</h1>
        <Anecdote text={anecdotes[selected]} votes={votes[selected]} />
        <button type="button" onClick={vote}>vote</button>
        <button type="button" onClick={next}>next anecdote</button>
      </section>
      <section aria-labelledby="popular-heading">
        <h2 id="popular-heading">Anecdote with most votes</h2>
        <Anecdote text={anecdotes[mostVoted]} votes={highestVotes} />
      </section>
    </main>
  )
}

export default App
