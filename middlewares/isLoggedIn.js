/**
 *
 * session alapján ellenőrzi be van e lépve a felhasználó vagy nem
 * @param {*} objectRepository
 * @returns
 */
export const isLoggedIn = (objectRepository) => {
  return (req, res, next) => {
    if (typeof req.session.userId === 'undefined') {
      res.locals.isLoggedIn = false;
    } else {
      res.locals.isLoggedIn = true;
    }
    return next();
  };
};
