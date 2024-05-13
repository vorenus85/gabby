/**
 * email + username + jelszó párossal létrehozzuk a megfelelő validációk mentés az új
felhasználót.
- email - unique
- username - unique
- password, min 6 karakter, legalább egy nagy betű, legalább 1 szám

 * @param {*} objectRepository 
 * @returns 
 */

import { checkEmailIsUsed } from '../checkEmailIsUsed.js';
import { checkUsernameIsUsed } from '../checkUsernameIsUsed.js';
import { passwordRegex, emailRegex } from '../utils.js';

export const createUser = (objectRepository) => {
  const { userModel, uuidv4, saveDB } = objectRepository;

  return (req, res, next) => {
    if (typeof req.body.email === 'undefined') {
      res.locals.error = 'MISSING_EMAIL';
      console.error(res.locals.error);
      return next();
    }

    if (typeof req.body.username === 'undefined') {
      res.locals.error = 'MISSING_USERNAME';
      console.error(res.locals.error);
      return next();
    }

    if (typeof req.body.password === 'undefined') {
      res.locals.error = 'MISSING_PASSWORD';
      console.error(res.locals.error);
      return next();
    }

    if (typeof req.body.passwordAgain === 'undefined') {
      res.locals.error = 'MISSING_PASSWORD_AGAIN';
      console.error(res.locals.error);
      return next();
    }

    if (!passwordRegex.test(req.body.password)) {
      res.locals.error = 'PASSWORD_REGEX';
      console.error(res.locals.error);
      return next();
    }

    if (!emailRegex.test(req.body.email)) {
      res.locals.error = 'INVALID_EMAIL';
      console.error(res.locals.error);
      return next();
    }

    if (req.body.password !== req.body.passwordAgain) {
      res.locals.error = 'PASSWORD_NOT_EQUAL';
      console.error(res.locals.error);
      return next();
    }

    const { username, email } = req.body;
    objectRepository.email = email;
    objectRepository.username = username;

    // check username collision
    if (checkUsernameIsUsed(objectRepository)) {
      res.locals.error = 'USERNAME_IS_USED';
      return next();
    }

    // check email collision
    if (checkEmailIsUsed(objectRepository)) {
      res.locals.error = 'EMAIL_IS_USED';
      return next();
    }

    const newUser = {
      id: uuidv4(),
      profileImage: Math.floor(Math.random() * 10) + 1, // in public/avatar folder have 10 random avatar image from avatar_1.png to avatar_10.png assign one randomly
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      fullname: '',
      location: '',
      bio: '',
      newPwdSecret: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      followedUsers: [],
    };

    try {
      userModel.insert(newUser);
    } catch (error) {
      console.error(error);
    }

    return saveDB((error) => {
      if (error) {
        res.locals.errors.registerError = error;
        return next(error);
      }

      req.session.userId = newUser.id;
      req.session.loggedInUser = newUser;
      next();
    });
  };
};
