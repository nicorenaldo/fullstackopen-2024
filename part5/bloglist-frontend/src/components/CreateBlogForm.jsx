import { useState } from 'react';
import blogService from '../services/blogs';

function CreateBlogForm({
  blogs,
  setBlogs,
  formRef,
  setErrorMessage,
  setSuccessMessage,
}) {
  const [blogTitle, setBlogTitle] = useState('');
  const [blogAuthor, setBlogAuthor] = useState('');
  const [blogUrl, setBlogURL] = useState('');

  const handleNewBlog = (event) => {
    event.preventDefault();
    const newBlog = {
      title: blogTitle,
      author: blogAuthor,
      url: blogUrl,
    };
    blogService
      .create(newBlog)
      .then((blog) => {
        formRef.current.toggleVisibility();
        setBlogs(blogs.concat(blog));
        setBlogTitle('');
        setBlogAuthor('');
        setBlogURL('');
        setSuccessMessage(`a new blog ${blog.title} by ${blog.author} added`);
        setTimeout(() => {
          setSuccessMessage(null);
        }, 5000);
      })
      .catch((error) => {
        setErrorMessage('Failed to create blog');
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      });
  };

  return (
    <form onSubmit={handleNewBlog}>
      <div className='flex'>
        <label htmlFor='title'>title:</label>
        <input
          type='text'
          value={blogTitle}
          name='title'
          onChange={({ target }) => setBlogTitle(target.value)}
        />
      </div>
      <div className='flex'>
        <label htmlFor='author'>author:</label>
        <input
          type='text'
          value={blogAuthor}
          name='author'
          onChange={({ target }) => setBlogAuthor(target.value)}
        />
      </div>
      <div className='flex'>
        <label htmlFor='url'>url:</label>
        <input
          type='text'
          value={blogUrl}
          name='url'
          onChange={({ target }) => setBlogURL(target.value)}
        />
      </div>
      <button type='submit'>create</button>
    </form>
  );
}

export default CreateBlogForm;
