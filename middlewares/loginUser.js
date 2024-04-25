/**
 * email + jelszó párost ellenőrizzük, ha van ilyen user, létrehozzuk a sessiont
 *
 * @param {*} objectRepository
 * @returns
 */

export const loginUser = (objectRepository) => {
  return (req, res, next) => {
    return next();
  };
};
