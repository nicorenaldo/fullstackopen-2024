import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import CreateBlogForm from './CreateBlogForm';

describe('CreateBlogForm component', () => {
  test('calling the callback on submit', () => {
    const handleNewBlog = vi.fn();
    render(<CreateBlogForm handleNewBlog={handleNewBlog} />);
    const titleInput = screen.getByLabelText('title:');
    const authorInput = screen.getByLabelText('author:');
    const urlInput = screen.getByLabelText('url:');
    const submitButton = screen.getByText('create');

    fireEvent.change(titleInput, { target: { value: 'Test Title' } });
    fireEvent.change(authorInput, { target: { value: 'Test Author' } });
    fireEvent.change(urlInput, { target: { value: 'https://testurl.com' } });
    fireEvent.click(submitButton);

    expect(handleNewBlog).toHaveBeenCalledWith(
      'Test Title',
      'Test Author',
      'https://testurl.com'
    );
  });
});
