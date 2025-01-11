import { useState } from 'react';

function CreateBlogForm({ handleNewBlog }) {
  const [blogTitle, setBlogTitle] = useState('');
  const [blogAuthor, setBlogAuthor] = useState('');
  const [blogUrl, setBlogURL] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    handleNewBlog(blogTitle, blogAuthor, blogUrl);
    setBlogTitle('');
    setBlogAuthor('');
    setBlogURL('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className='flex'>
        <label htmlFor='title'>title:</label>
        <input
          type='text'
          value={blogTitle}
          name='title'
          id='title'
          onChange={({ target }) => setBlogTitle(target.value)}
        />
      </div>
      <div className='flex'>
        <label htmlFor='author'>author:</label>
        <input
          type='text'
          value={blogAuthor}
          name='author'
          id='author'
          onChange={({ target }) => setBlogAuthor(target.value)}
        />
      </div>
      <div className='flex'>
        <label htmlFor='url'>url:</label>
        <input
          type='text'
          value={blogUrl}
          name='url'
          id='url'
          onChange={({ target }) => setBlogURL(target.value)}
        />
      </div>
      <button type='submit'>create</button>
    </form>
  );
}

export default CreateBlogForm;
