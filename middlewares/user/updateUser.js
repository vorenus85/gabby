/**
 * A felhasználó általános adatainak módosítása, jelszó kivételével.
 *
 * @param {*} objectRepository
 * @returns
 */

import { checkEmailIsUsed } from '../checkEmailIsUsed.js';
import { checkUsernameIsUsed } from '../checkUsernameIsUsed.js';

export const updateUser = (objectRepository) => {
  const { userModel, saveDB } = objectRepository;
  return (req, res, next) => {
    const user = req.session.loggedInUser;
    const { fullname, username, email, bio, location } = req.body;
    const updatedAt = new Date();

    objectRepository.email = email;
    objectRepository.username = username;

    // check username collision
    if (username !== user.username) {
      if (checkUsernameIsUsed(objectRepository)) {
        res.locals.error = 'USERNAME_IS_USED';
        return next();
      }
    }

    // check email collision
    if (email !== user.email) {
      if (checkEmailIsUsed(objectRepository)) {
        res.locals.error = 'EMAIL_IS_USED';
        return next();
      }
    }

    const updatedUser = {
      ...user,
      fullname,
      username,
      email,
      bio,
      location,
      updatedAt,
    };

    userModel.update(updatedUser);

    return saveDB((error) => {
      if (error) {
        return next(error);
      }
      req.session.loggedInUser = updatedUser;
      res.locals.message = 'USER_SUCCESSFULLY_UPDATED';
      next();
    });
  };
};
