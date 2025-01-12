import { useDispatch } from 'react-redux';
import { createAnecdote } from '../reducers/anecdoteReducer';

const AnecdoteForm = () => {
  const dispatch = useDispatch();

  const onSubmit = async (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    if (content.length > 0) {
      dispatch(createAnecdote(content));
      event.target.anecdote.value = '';
    }
  };
  return (
    <form onSubmit={onSubmit}>
      <input name='anecdote' />
      <button>create</button>
    </form>
  );
};

export default AnecdoteForm;
