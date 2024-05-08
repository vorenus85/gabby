/**
 * Létrehoz egy új postot
 * @param {*} objectRepository
 * @returns
 */

export const createPost = (objectRepository) => {
  const { postModel, saveDB, uuidv4 } = objectRepository;
  return (req, res, next) => {
    const user = req.session.loggedInUser;

    if (typeof req.body.postContent === 'undefined') {
      console.error('Missing post content');
      return next();
    }

    try {
      postModel.insert({
        id: uuidv4(),
        createdBy: user.id,
        creatorUsername: user.username,
        creatorImage: user.profileImage,
        content: req.body.postContent,
        image: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error(error);
    }

    return saveDB((error) => {
      if (error) {
        return next(error);
      }

      next();
    });
  };
};
