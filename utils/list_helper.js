const dummy = () => 1;

const totalLikes = (listBlog) => {
  const reducer = (total, blog) => total + blog.likes;

  return listBlog.reduce(reducer, 0);
};

const favoriteBlog = (listBlog) => {
  if (listBlog.length === 0) return {};

  let currentMax = listBlog[0].likes;
  let index = 0;

  for (let i = 1; i < listBlog.length; i += 1) {
    if (listBlog[i].likes > currentMax) {
      currentMax = listBlog[i].likes;
      index = i;
    }
  }

  const favorite = {
    title: listBlog[index].title,
    author: listBlog[index].author,
    likes: listBlog[index].likes,
  };

  return favorite;
};

const mostBlogs = (listBlog) => {
  let max = 0;
  const store = [];
  let maxAuthor;

  for (let i = 0; i < listBlog.length; i += 1) {
    let flag = true;
    for (let j = 0; j < store.length; j += 1) {
      if (listBlog[i].author === store[j].author) {
        store[j].blogs += 1;
        flag = false;
        if (max < store[j].blogs) {
          max = store[j].blogs;
          maxAuthor = store[j];
        }
        break;
      }
    }
    if (flag) {
      store.push({ author: listBlog[i].author, blogs: 1 });
    }
  }

  return maxAuthor;
};

const mostLikes = (listBlog) => {
  let max = 0;
  const store = [];
  let maxAuthor;

  for (let i = 0; i < listBlog.length; i += 1) {
    let flag = true;
    for (let j = 0; j < store.length; j += 1) {
      if (listBlog[i].author === store[j].author) {
        store[j].likes += listBlog[i].likes;
        flag = false;
        if (max < store[j].likes) {
          max = store[j].likes;
          maxAuthor = store[j];
        }
        break;
      }
    }
    if (flag) {
      store.push({ author: listBlog[i].author, likes: listBlog[i].likes });
    }
  }

  return maxAuthor;
};

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes,
};
