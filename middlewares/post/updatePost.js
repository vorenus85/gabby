/**
 * Egy darab postot updatel.
 *
 * @param {*} objectRepository
 * @returns
 */

export const updatePost = (objectRepository) => {
  const { postModel, saveDB } = objectRepository;
  return (req, res, next) => {
    const postId = req.body.postId;
    const postContent = req.body.postContent;

    if (postContent === 'undefined') {
      console.error('Missing postContent during updatePost');
      res.locals.error = 'ERROR_HAPPENED';
      return next();
    }

    if (postId === 'undefined') {
      console.error('Missing postId during updatePost');
      res.locals.error = 'ERROR_HAPPENED';
      return next();
    }

    const post = postModel.findOne({ id: postId });

    if (!post) {
      console.error('Post not find by postId during updatePost');
      res.locals.error = 'ERROR_HAPPENED';
      return next();
    }

    if (post.createdBy !== req.session.loggedInUser.id) {
      console.error('Authentication failed during updatePost');
      res.locals.error = 'ERROR_HAPPENED';
      return next();
    }

    post.content = postContent;
    if (req?.file?.filename) {
      post.image = req?.file?.filename;
    }

    post.updatedAt = new Date();

    postModel.update(post);

    return saveDB((error) => {
      if (error) {
        return next(error);
      }

      res.locals.post = post;
      res.locals.message = 'POST_SUCCESSFULLY_UPDATED';
      next();
    });
  };
};
