import PropTypes from 'prop-types';

const Course = ({ course }) => {
  Course.propTypes = {
    course: PropTypes.shape({
      name: PropTypes.string.isRequired,
      parts: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          exercises: PropTypes.number.isRequired,
        })
      ).isRequired,
    }).isRequired,
  };

  return (
    <div>
      <Header courseName={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  );
};

const Header = ({ courseName }) => {
  Header.propTypes = {
    courseName: PropTypes.string.isRequired,
  };

  return <h2>{courseName}</h2>;
};

const Content = ({ parts }) => {
  Content.propTypes = {
    parts: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        exercises: PropTypes.number.isRequired,
      })
    ).isRequired,
  };

  return (
    <div>
      {parts.map((part) => (
        <Part key={part.name} name={part.name} exercises={part.exercises} />
      ))}
    </div>
  );
};

const Part = ({ name, exercises }) => {
  Part.propTypes = {
    name: PropTypes.string.isRequired,
    exercises: PropTypes.number.isRequired,
  };

  return (
    <p>
      {name} {exercises}
    </p>
  );
};

const Total = ({ parts }) => {
  Total.propTypes = {
    parts: PropTypes.arrayOf(
      PropTypes.shape({
        exercises: PropTypes.number.isRequired,
      })
    ).isRequired,
  };

  const total = parts.reduce((sum, part) => sum + part.exercises, 0);
  return (
    <p>
      <strong>total of {total} exercises</strong>{' '}
    </p>
  );
};

export default Course;
