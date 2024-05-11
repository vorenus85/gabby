/**
 * Főoldalon használjuk az összes post kinyerésére, csökkenő időrendben.
 *
 * @param {*} objectRepository
 * @returns
 */

export const getPosts = (objectRepository) => {
  const { postModel, moment } = objectRepository;
  return (req, res, next) => {
    const posts = postModel.find({ id: { $ne: null } }).reverse();
    posts.forEach((post) => {
      post.createdAtText = moment(post.createdAt).fromNow();
    });
    res.locals.posts = posts;
    return next();
  };
};
