/**
 * Az adott felhasználó postjait adja vissza, userId alapján
 * @param {*} objectRepository
 * @returns
 */

export const getPostsByUserId = (objectRepository) => {
  const { postModel, moment } = objectRepository;
  return (req, res, next) => {
    const user = res.locals?.user;
    if (!user) {
      console.error('User missing during getPostsByUserId');
      return res.redirect('/');
    }
    const posts = postModel.find({ createdBy: user.id }).reverse();

    posts.forEach((post) => {
      post.createdAtText = moment(post.createdAt).fromNow();
    });
    res.locals.posts = posts;
    return next();
  };
};
