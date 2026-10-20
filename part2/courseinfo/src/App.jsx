import Course from './components/Course'

const courses = [
  { id: 1, name: 'Half Stack application development', parts: [
    { id: 1, name: 'Fundamentals of React', exercises: 10 },
    { id: 2, name: 'Using props to pass data', exercises: 7 },
    { id: 3, name: 'State of a component', exercises: 14 },
    { id: 4, name: 'Redux', exercises: 11 },
  ] },
  { id: 2, name: 'Node.js', parts: [
    { id: 1, name: 'Routing', exercises: 3 },
    { id: 2, name: 'Middlewares', exercises: 7 },
  ] },
]

export default function App() {
  return <main><header><p className="eyebrow">Full Stack Open · Part 2</p><h1>Course information</h1><p className="intro">A clear overview of each course and its exercises.</p></header>
    {courses.map(course => <Course key={course.id} course={course} />)}
    <footer>Course data and exercise brief: <a href="https://fullstackopen.com/en/part2/rendering_a_collection_modules/">Full Stack Open</a></footer>
  </main>
}
