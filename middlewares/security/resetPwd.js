/**
 * Jelszó visszaállítás esetén itt mentjuk el az új jelszót.
 * @param {*} objectRepository
 * @returns
 */

export const resetPwd = (objectRepository) => {
  return (req, res, next) => {
    return next();
  };
};
