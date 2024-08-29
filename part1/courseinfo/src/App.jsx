import PropTypes from 'prop-types';

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  );
};

const Header = ({ courseName }) => <h1>{courseName}</h1>;

Header.propTypes = {
  courseName: PropTypes.string.isRequired,
};

const Content = ({ parts }) => (
  <div>
    {parts.map((part) => (
      <Part key={part.name} name={part.name} exercises={part.exercises} />
    ))}
  </div>
);

Content.propTypes = {
  parts: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      exercises: PropTypes.number.isRequired,
    })
  ).isRequired,
};

const Part = ({ name, exercises }) => (
  <p>
    {name} {exercises}
  </p>
);

Part.propTypes = {
  name: PropTypes.string.isRequired,
  exercises: PropTypes.number.isRequired,
};

const Total = ({ parts }) => {
  const total = parts.reduce((sum, part) => sum + part.exercises, 0);
  return <p>Number of exercises {total}</p>;
};

Total.propTypes = {
  parts: PropTypes.arrayOf(
    PropTypes.shape({
      exercises: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default App;
