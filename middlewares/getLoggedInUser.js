import moment from 'moment';
/**
 * Visszaadja a bejelentkezett felhasználót.
 *
 * @param {*} objectRepository
 * @returns
 */

export const getLoggedInUser = (objectRepository) => {
  const { userModel } = objectRepository;
  return (req, res, next) => {
    const user = userModel.findOne({ id: req.session.userId });
    if (user) {
      res.locals.user = user;
      res.locals.user.createdAtText = moment(new Date(user.createdAt)).fromNow(
        true
      );
    }

    return next();
  };
};
