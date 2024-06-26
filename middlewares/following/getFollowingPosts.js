/**
 * Visszaadja az adott felhasználó követetettjeinek a posjait időrendben.
 *
 * @param {*} objectRepository
 * @returns
 */

export const getFollowingPosts = (objectRepository) => {
  const { postModel } = objectRepository;
  return (req, res, next) => {
    const user = res.locals?.user;

    if (!user) {
      console.error('User not given to retrieve followings');
    }

    const followings = user.followedUsers;

    res.locals.followings = postModel.find({ createdBy: { $in: followings } });

    return next();
  };
};
