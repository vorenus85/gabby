/**
 * Főoldalon használjuk az összes post kinyerésére, csökkenő időrendben.
 *
 * @param {*} objectRepository
 * @returns
 */

export const getPosts = (objectRepository) => {
  return (req, res, next) => {
    return next();
  };
};
