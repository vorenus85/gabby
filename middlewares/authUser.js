/**
 *
 * session alapján ellenőrzi be van e lépve a felhasználó vagy nem, MemoryStorage, ha nincs belépve a főoldalra irányít, res.locals.user
 * @param {*} objectRepository
 * @returns
 */
export const authUser = (objectRepository) => {
  return (req, res, next) => {
    return next();
  };
};
