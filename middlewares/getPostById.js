/**
 * Egy postot ad vissza id alapján
 * @param {*} objectRepository
 * @returns
 */

export const getPostById = (objectRepository) => {
  const { postModel } = objectRepository;
  return (req, res, next) => {
    let postId;

    if (req.method === 'POST') {
      postId = req.body.id;
    }

    if (req.method === 'GET') {
      postId = req.params.id;
    }

    if (postId === 'undefined') {
      console.error('Missing post id during getPostById');
      return res.redirect('/');
    }

    const post = postModel.findOne({ id: postId });

    if (post.createdBy !== req.session.loggedInUser.id) {
      console.error('Authentication failed during getPostById');
      return res.redirect('/');
    }

    res.locals.post = post;

    return next();
  };
};
