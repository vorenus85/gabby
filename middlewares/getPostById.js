/**
 * Egy postot ad vissza id alapján
 * @param {*} objectRepository
 * @returns
 */

export const getPostById = (objectRepository) => {
  const { postModel } = objectRepository;
  return (req, res, next) => {
    if (req.body.id === 'undefined') {
      return res.redirect('/');
    }

    const postId = req.body.id;
    const post = postModel.findOne({ id: postId });

    if (post.createdBy !== req.session.loggedInUser.id) {
      return res.redirect('/');
    }

    res.locals.post = post;

    return next();
  };
};
