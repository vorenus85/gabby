/**
 * Egy postot ad vissza id alapján
 * @param {*} objectRepository
 * @returns
 */

export const getPostById = (objectRepository) => {
  const { postModel } = objectRepository;
  return (req, res, next) => {
    if (req.body.id === 'undefined') {
      console.error('Missing post id during getPostById');
      return res.redirect('/');
    }

    const postId = req.body.id;
    const post = postModel.findOne({ id: postId });

    if (post.createdBy !== req.session.loggedInUser.id) {
      console.error('Not creator want to delete post');
      return res.redirect('/');
    }

    res.locals.post = post;

    return next();
  };
};
