import { useState } from 'react';
import blogService from '../services/blogs';

function Blog({ blog, handleLikeCallback, handleDeleteCallback }) {
  const [open, setOpen] = useState(false);

  const handleLike = () => {
    blogService.update(blog.id, {
      ...blog,
      likes: blog.likes + 1,
    });
    handleLikeCallback(blog.id);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      blogService.delete(blog.id);
      handleDeleteCallback(blog.id);
    }
  };

  return (
    <div
      style={{
        padding: '4px',
        border: '1px solid black',
      }}
    >
      <div
        id='title'
        style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
      >
        <p>{blog.title}</p>
        <button
          style={{
            height: '20px',
          }}
          onClick={() => setOpen(!open)}
        >
          {open ? 'hide' : 'view'}
        </button>
      </div>
      {open && (
        <div id='detail'>
          <p>url: {blog.url}</p>
          <div style={{ display: 'flex' }}>
            <p>likes: {blog.likes}</p>
            <button onClick={handleLike}>like</button>
          </div>
          <p>author: {blog.author}</p>
          <button onClick={handleDelete}>delete</button>
        </div>
      )}
    </div>
  );
}

export default Blog;
