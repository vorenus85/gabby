/**
 * Egy adott postot töröl.

 * @param {*} objectRepository 
 * @returns 
 */

export const deletePost = (objectRepository) => {
  const { postModel, saveDB } = objectRepository;
  return (req, res, next) => {
    const post = res.locals?.post;
    if (!post) {
      console.error('Missing post during deletePost');
      return res.redirect('/');
    }

    postModel.remove(post);
    return saveDB((err) => {
      if (err) {
        return next(err);
      }
      next();
    });
  };
};
