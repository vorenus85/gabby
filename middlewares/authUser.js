/**
 *
 * session alapján ellenőrzi be van e lépve a felhasználó vagy nem, MemoryStorage, ha nincs belépve a főoldalra irányít, res.locals.user
 * @param {*} objectRepository
 * @returns
 */
export const authUser = (objectRepository) => {
  return (req, res, next) => {
    if (typeof req.session.userId === 'undefined') {
      res.locals.isLoggedIn = false;
    } else {
      res.locals.isLoggedIn = true;
    }
    return next();
  };
};
