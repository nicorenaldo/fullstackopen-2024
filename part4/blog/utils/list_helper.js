const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const favoriteBlog = blogs.reduce(
    (max, blog) => (max.likes > blog.likes ? max : blog),
    blogs[0]
  );

  return {
    title: favoriteBlog.title,
    author: favoriteBlog.author,
    likes: favoriteBlog.likes,
  };
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const authorCounts = blogs.reduce((counts, blog) => {
    counts[blog.author] = (counts[blog.author] || 0) + 1;
    return counts;
  }, {});

  const maxAuthor = Object.keys(authorCounts).reduce((max, author) => {
    return authorCounts[author] > authorCounts[max] ? author : max;
  }, Object.keys(authorCounts)[0]);

  return {
    author: maxAuthor,
    blogs: authorCounts[maxAuthor],
  };
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const likesByAuthor = blogs.reduce((likes, blog) => {
    likes[blog.author] = (likes[blog.author] || 0) + blog.likes;
    return likes;
  }, {});

  const maxAuthor = Object.keys(likesByAuthor).reduce((max, author) => {
    return likesByAuthor[author] > likesByAuthor[max] ? author : max;
  }, Object.keys(likesByAuthor)[0]);

  return {
    author: maxAuthor,
    likes: likesByAuthor[maxAuthor],
  };
};

module.exports = {
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
