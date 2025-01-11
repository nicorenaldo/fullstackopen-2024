import { useState } from 'react';

function Blog({ user, blog, handleLikeCallback, handleDeleteCallback }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      data-testid='blog-item'
      data-likes={blog.likes}
      data-title={blog.title}
      style={{
        padding: '4px',
        border: '1px solid black',
      }}
    >
      <div
        id='header'
        style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
      >
        <p id='title'>{blog.title}</p>
        <p id='author'>{blog.author}</p>
        <button
          id='view-button'
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
          <p id='url'>{blog.url}</p>
          <div style={{ display: 'flex' }}>
            <p id='likes'>{blog.likes}</p>
            <button id='like-button' onClick={() => handleLikeCallback(blog)}>
              like
            </button>
          </div>
          <p id='owner'>{blog.user.name}</p>
          {blog.user.username === user.username && (
            <button
              id='delete-button'
              onClick={() => handleDeleteCallback(blog)}
            >
              delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default Blog;
