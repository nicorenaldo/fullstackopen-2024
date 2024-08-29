import PropTypes from 'prop-types';
import { useState } from 'react';

const getAverage = (good, neutral, bad) => {
  return (good - bad) / (good + neutral + bad);
};

const getPositive = (good, neutral, bad) => {
  return (good / (good + neutral + bad)) * 100;
};

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  return (
    <div>
      <h1>give feedback</h1>
      <div
        style={{
          display: 'flex',
          gap: '10px',
        }}
      >
        <Button text='good' onClick={() => setGood(good + 1)} />
        <Button text='neutral' onClick={() => setNeutral(neutral + 1)} />
        <Button text='bad' onClick={() => setBad(bad + 1)} />
      </div>

      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  );
};

const Button = ({ text, onClick }) => {
  Button.propTypes = {
    text: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
  };

  return <button onClick={onClick}>{text}</button>;
};

const Statistics = ({ good, neutral, bad }) => {
  Statistics.propTypes = {
    good: PropTypes.number.isRequired,
    neutral: PropTypes.number.isRequired,
    bad: PropTypes.number.isRequired,
  };

  const empty = good + neutral + bad === 0;

  const average = getAverage(good, neutral, bad);
  const positive = getPositive(good, neutral, bad);

  return (
    <div>
      <h1>statistics</h1>
      {empty ? (
        <p>No feedback given</p>
      ) : (
        <table>
          <tbody>
            <StatisticLine text='good' value={good} />
            <StatisticLine text='neutral' value={neutral} />
            <StatisticLine text='bad' value={bad} />
            <StatisticLine text='average' value={average} />
            <StatisticLine text='positive' value={positive + ' %'} />
          </tbody>
        </table>
      )}
    </div>
  );
};

const StatisticLine = ({ text, value }) => {
  StatisticLine.propTypes = {
    text: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  };

  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  );
};

export default App;
