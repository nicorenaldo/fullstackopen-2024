const listHelper = require('./list_helper');

describe('total likes', () => {
  test('of empty list is zero', () => {
    const result = listHelper.totalLikes([]);
    expect(result).toBe(0);
  });

  test('when list has only one blog, equals the likes of that', () => {
    const listWithOneBlog = [
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        likes: 5,
        __v: 0,
      },
    ];
    const result = listHelper.totalLikes(listWithOneBlog);
    expect(result).toBe(5);
  });

  test('of a bigger list is calculated right', () => {
    const blogs = [{ likes: 5 }, { likes: 10 }, { likes: 15 }];
    const result = listHelper.totalLikes(blogs);
    expect(result).toBe(30);
  });
});

describe('favorite blog', () => {
  test('of empty list is null', () => {
    const result = listHelper.favoriteBlog([]);
    expect(result).toBeNull();
  });

  test('when list has only one blog, returns that blog', () => {
    const listWithOneBlog = [
      {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        likes: 5,
      },
    ];
    const result = listHelper.favoriteBlog(listWithOneBlog);
    expect(result).toEqual({
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      likes: 5,
    });
  });

  test('of a bigger list returns the blog with most likes', () => {
    const blogs = [
      { title: 'Blog 1', author: 'Author 1', likes: 5 },
      { title: 'Blog 2', author: 'Author 2', likes: 10 },
      { title: 'Blog 3', author: 'Author 3', likes: 7 },
    ];
    const result = listHelper.favoriteBlog(blogs);
    expect(result).toEqual({
      title: 'Blog 2',
      author: 'Author 2',
      likes: 10,
    });
  });
});

describe('most blogs', () => {
  test('of empty list is null', () => {
    const result = listHelper.mostBlogs([]);
    expect(result).toBeNull();
  });

  test('when list has only one blog, returns that author', () => {
    const listWithOneBlog = [
      {
        author: 'Edsger W. Dijkstra',
      },
    ];
    const result = listHelper.mostBlogs(listWithOneBlog);
    expect(result).toEqual({
      author: 'Edsger W. Dijkstra',
      blogs: 1,
    });
  });

  test('of a bigger list returns the author with most blogs', () => {
    const blogs = [
      { author: 'Author 1' },
      { author: 'Author 2' },
      { author: 'Author 1' },
      { author: 'Author 3' },
      { author: 'Author 1' },
    ];
    const result = listHelper.mostBlogs(blogs);
    expect(result).toEqual({
      author: 'Author 1',
      blogs: 3,
    });
  });
});

describe('most likes', () => {
  test('of an empty list is null', () => {
    const result = listHelper.mostLikes([]);
    expect(result).toBeNull();
  });

  test('when list has only one blog, returns that author with likes', () => {
    const listWithOneBlog = [
      {
        author: 'Edsger W. Dijkstra',
        likes: 5,
      },
    ];
    const result = listHelper.mostLikes(listWithOneBlog);
    expect(result).toEqual({ author: 'Edsger W. Dijkstra', likes: 5 });
  });

  test('of a bigger list returns the author with most likes', () => {
    const blogs = [
      { author: 'Author 1', likes: 5 },
      { author: 'Author 2', likes: 8 },
      { author: 'Author 1', likes: 10 },
      { author: 'Author 3', likes: 7 },
    ];
    const result = listHelper.mostLikes(blogs);
    expect(result).toEqual({ author: 'Author 1', likes: 15 });
  });
});
