/**
 * Kikövet egy adott felhasználót
 * @param {*} objectRepository
 * @returns
 */

export const doNotFollow = (objectRepository) => {
  return (req, res, next) => {
    return next();
  };
};
