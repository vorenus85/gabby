/**
 * Visszaadja az adott felhasználókat id array alapján.
 *
 * @param {*} objectRepository
 * @returns
 */

export const getUsersById = (objectRepository) => {
  const { userModel } = objectRepository;
  return (req, res, next) => {
    const user = res.locals?.user;

    if (!user) {
      console.error('User not given to retrieve followings');
    }

    const followings = user.followedUsers;

    res.locals.users = userModel.find({ id: { $in: followings } });

    return next();
  };
};
