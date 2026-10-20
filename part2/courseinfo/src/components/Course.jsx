const Header = ({ name }) => <h2>{name}</h2>
const Part = ({ part }) => <li className="row"><span>{part.name}</span><span className="badge">{part.exercises}</span></li>
const Content = ({ parts }) => <ul className="list">{parts.map(part => <Part key={part.id} part={part} />)}</ul>
const Total = ({ parts }) => <p className="total"><span>Total exercises</span><span>{parts.reduce((sum, part) => sum + part.exercises, 0)}</span></p>

export default function Course({ course }) {
  return <section className="card"><Header name={course.name} /><Content parts={course.parts} /><Total parts={course.parts} /></section>
}
