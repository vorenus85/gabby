/**
 * Kikövet egy adott felhasználót
 * @param {*} objectRepository
 * @returns
 */

export const doNotFollow = (objectRepository) => {
  const { userModel, saveDB } = objectRepository;
  return (req, res, next) => {
    const followId = req.body.followId;

    if (followId === 'undefined') {
      console.error('Followid not given');
      res.redirect('/');
    }

    const userToFollow = userModel.findOne({ id: followId });

    if (!userToFollow) {
      console.error('userToFollow not found in db');
    }

    const loggedInUser = userModel.findOne({ id: req.session.userId });

    const followIdIndex = loggedInUser.followedUsers.indexOf(followId);

    loggedInUser.followedUsers.splice(followIdIndex, 1);
    req.session.loggedInUser = loggedInUser;

    return saveDB((error) => {
      if (error) {
        return next(error);
      }

      next();
    });
  };
};
