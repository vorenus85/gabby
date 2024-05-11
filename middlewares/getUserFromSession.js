/**
 * A sessionből kiszedi a user-t és továbbadja a res.localsra
 */
export const getUserFromSession = (objectRepository) => {
  return (req, res, next) => {
    res.locals.user = req.session.loggedInUser;
    next();
    return next();
  };
};
