const dummy = (blogs) => {
  return 1;
}

const totalLikes = (listBlog) => {
  const reducer = (totalLikes, blog) => totalLikes + blog.likes;
  
  return listBlog.reduce(reducer, 0);
};

const favoriteBlog = (listBlog) => {
  if(listBlog.length === 0) return {}; 

  let currentMax = listBlog[0].likes;
  let index = 0;

  for (let i = 1; i < listBlog.length; i++) {
    if (listBlog[i].likes > currentMax) {
      currentMax = listBlog[i].likes;
      index = i;
    }
  }

  let favorite = {
    title: listBlog[index].title,
    author: listBlog[index].author,
    likes: listBlog[index].likes, 
  };

  return favorite;
}

module.exports = {
  dummy, totalLikes, favoriteBlog
};
