import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import Blog from './Blog';

describe('Blog component', () => {
  const blog = {
    title: 'Test Blog Title',
    author: 'Test Author',
    url: 'https://testurl.com',
    likes: 5,
    id: '123',
    user: {
      id: '123',
      name: 'RealName',
      username: 'username',
    },
  };

  test('renders title and author but not url or likes by default', () => {
    render(
      <Blog
        user={blog.user}
        blog={blog}
        handleLikeCallback={null}
        handleDeleteCallback={null}
      />
    );

    // Check that title and author are visible
    expect(screen.getByText(blog.title)).toBeDefined();
    expect(screen.getByText(blog.author)).toBeDefined();

    expect(screen.queryByText(blog.url)).toBeNull();
    expect(screen.queryByText(blog.likes)).toBeNull();
    expect(screen.queryByText(blog.user.name)).toBeNull();
  });

  test('shows url and likes when view button is clicked', () => {
    render(
      <Blog
        user={blog.user}
        blog={blog}
        handleLikeCallback={null}
        handleDeleteCallback={null}
      />
    );

    const button = screen.getByText('view');
    fireEvent.click(button);

    expect(screen.getByText(blog.url)).toBeDefined();
    expect(screen.getByText(blog.likes)).toBeDefined();
    expect(screen.getByText(blog.user.name)).toBeDefined();
  });

  test('like button is clicked twice', () => {
    const handleLikeCallback = vi.fn();
    render(
      <Blog
        user={blog.user}
        blog={blog}
        handleLikeCallback={handleLikeCallback}
        handleDeleteCallback={null}
      />
    );

    const button = screen.getByText('view');
    fireEvent.click(button);

    const likeButton = screen.getByText('like');
    fireEvent.click(likeButton);
    fireEvent.click(likeButton);

    expect(handleLikeCallback).toHaveBeenCalledTimes(2);
  });
});
