import PropTypes from 'prop-types';

const Notification = ({ errorMessage, successMessage }) => {
  Notification.propTypes = {
    errorMessage: PropTypes.string,
    successMessage: PropTypes.string,
  };

  const errorStyle = {
    color: 'red',
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px',
  };

  const successStyle = {
    color: 'green',
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px',
  };

  if (errorMessage) {
    return <div style={errorStyle}>{errorMessage}</div>;
  }

  if (successMessage) {
    return <div style={successStyle}>{successMessage}</div>;
  }

  return null;
};

export default Notification;
