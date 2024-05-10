/**
 * Bekövet egy adott felhasználót.
 *
 * @param {*} objectRepository
 * @returns
 */

export const doFollow = (objectRepository) => {
  const { userModel, saveDB } = objectRepository;

  return (req, res, next) => {
    const followId = req.body.followId;

    if (followId === 'undefined') {
      console.error('Followid not given');
      res.redirect('/');
    }

    const userToFollow = userModel.findOne({ id: followId });

    if (!userToFollow) {
      console.error('userToUnFollow not found in db');
    }

    const loggedInUser = userModel.findOne({ id: req.session.userId });

    loggedInUser.followedUsers.push(followId);
    req.session.loggedInUser = loggedInUser;

    return saveDB((error) => {
      if (error) {
        return next(error);
      }

      next();
    });
  };
};
