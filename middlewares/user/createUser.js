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

export const createUser = (objectRepository) => {
  const { userModel, uuidv4, saveDB } = objectRepository;
  const passwordRegex = /^(?=.*[0-9])(?=.*[a-zA-Z]).{6,}$/;
  const emailRegex =
    /^[\w-]+(\.[\w-]+)*@[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)*(\.[a-zA-Z]{2,})$/;

  return (req, res, next) => {
    if (typeof req.body.email === 'undefined') {
      res.locals.errors.registerError = 'Missing email';
      console.error('Missing email');
      return next();
    }

    if (typeof req.body.username === 'undefined') {
      res.locals.errors.registerError = 'Missing username';
      console.error('Missing username');
      return next();
    }

    if (typeof req.body.password === 'undefined') {
      res.locals.errors.registerError = 'Missing password';
      console.error('Missing password');
      return next();
    }

    if (typeof req.body.passwordAgain === 'undefined') {
      res.locals.errors.registerError = 'Missing passwordAgain';
      console.error('Missing passwordAgain');
      return next();
    }

    if (!passwordRegex.test(req.body.password)) {
      res.locals.errors.registerError =
        'Password is at least 6 characters long, contain at least one number, and contain at least one letter';
      console.error(
        'Password is at least 6 characters long, contain at least one number, and contain at least one letter'
      );
      return next();
    }

    if (!emailRegex.test(req.body.email)) {
      res.locals.errors.registerError = 'Email is invalid';
      console.error('Email is invalid');
      return next();
    }

    if (req.body.password !== req.body.passwordAgain) {
      res.locals.errors.registerError = 'Passwords must be equal';
      console.error('Passwords must be equal');
      return next();
    }

    const { username, email } = req.body;
    objectRepository.email = email;
    objectRepository.username = username;

    // check username collision
    if (checkUsernameIsUsed(objectRepository)) {
      res.locals.errors.registerError = `${username} has been already taken, please choose another username`;
      return next();
    }

    // check email collision
    if (checkEmailIsUsed(objectRepository)) {
      res.locals.errors.registerError = `${email} has been already taken, please choose another email`;
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
