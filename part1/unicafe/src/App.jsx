import { useState } from 'react'

const Button = ({ onClick, text }) => (
  <button type="button" onClick={onClick}>{text}</button>
)

const StatisticLine = ({ text, value }) => (
  <tr><th scope="row">{text}</th><td>{value}</td></tr>
)

const Statistics = ({ good, neutral, bad }) => {
  const total = good + neutral + bad

  if (total === 0) return <p>No feedback given</p>

  return (
    <table>
      <tbody>
        <StatisticLine text="good" value={good} />
        <StatisticLine text="neutral" value={neutral} />
        <StatisticLine text="bad" value={bad} />
        <StatisticLine text="all" value={total} />
        <StatisticLine text="average" value={(good - bad) / total} />
        <StatisticLine text="positive" value={`${(good / total) * 100} %`} />
      </tbody>
    </table>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <main>
      <h1>give feedback</h1>
      <Button text="good" onClick={() => setGood(count => count + 1)} />
      <Button text="neutral" onClick={() => setNeutral(count => count + 1)} />
      <Button text="bad" onClick={() => setBad(count => count + 1)} />
      <h2>statistics</h2>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </main>
  )
}

export default App
