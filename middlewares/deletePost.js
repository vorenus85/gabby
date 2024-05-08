/**
 * Egy adott postot töröl.

 * @param {*} objectRepository 
 * @returns 
 */

export const deletePost = (objectRepository) => {
  const { postModel, saveDB } = objectRepository;
  return (req, res, next) => {
    console.log('eljut a deletePost');

    const post = res.locals?.post;
    if (!post) {
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
