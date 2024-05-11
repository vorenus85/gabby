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
      return res.redirect('/');
    }

    if (postId === 'undefined') {
      console.error('Missing postId during updatePost');
      return res.redirect('/');
    }

    const post = postModel.findOne({ id: postId });

    if (!post) {
      console.error('Post not find by postId during updatePost');
      return res.redirect('/');
    }

    if (post.createdBy !== req.session.loggedInUser.id) {
      console.error('Authentication failed during updatePost');
      return res.redirect('/');
    }

    post.content = postContent;
    post.updatedAt = new Date();

    postModel.update(post);

    return saveDB((error) => {
      if (error) {
        return next(error);
      }

      res.locals.messages = {};
      res.locals.post = post;
      res.locals.messages.successUpdatePost = 'Post successfully updated';
      next();
    });
  };
};
