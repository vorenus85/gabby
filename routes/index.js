import { v4 as uuidv4 } from 'uuid';
import { authUser } from '../middlewares/security/authUser.js';
import { isLoggedIn } from '../middlewares/user/isLoggedIn.js';
import { getPosts } from '../middlewares/post/getPosts.js';
import { search } from '../middlewares/search.js';
import { getPostsById } from '../middlewares/post/getPostsById.js';
import { getPostById } from '../middlewares/post/getPostById.js';
import { getPostsByUserId } from '../middlewares/post/getPostsByUserId.js';
import { getUsersById } from '../middlewares/user/getUsersById.js';
import { getUserByUsername } from '../middlewares/user/getUserByUsername.js';
import { getUserFromSession } from '../middlewares/user/getUserFromSession.js';
import { doFollow } from '../middlewares/following/doFollow.js';
import { doNotFollow } from '../middlewares/following/doNotFollow.js';
import { getFollowingPosts } from '../middlewares/following/getFollowingPosts.js';
import { createPost } from '../middlewares/post/createPost.js';
import { deletePost } from '../middlewares/post/deletePost.js';
import { updatePost } from '../middlewares/post/updatePost.js';
import { deletePostImage } from '../middlewares/post/deletePostImage.js';
import { updateUser } from '../middlewares/user/updateUser.js';
import { updatePwd } from '../middlewares/security/updatePwd.js';
import { setNewPwdToken } from '../middlewares/security/setNewPwdToken.js';
import { getPwdToken } from '../middlewares/security/getPwdToken.js';
import { loginUser } from '../middlewares/user/loginUser.js';
import { logoutUser } from '../middlewares/user/logoutUser.js';
import { createUser } from '../middlewares/user/createUser.js';
import { renderPage } from '../middlewares/renderPage.js';

import moment from 'moment';
import { errors, messages } from '../messages.js';
export function addRoutes(app, { postModel, userModel, saveDB }) {
  const objectRepository = {
    postModel,
    userModel,
    uuidv4,
    saveDB,
    moment,
  };

  app.all('*', isLoggedIn(), (req, res, next) => {
    res.locals.errors = errors;
    res.locals.messages = messages;
    res.locals.messageType = req.query?.messageType || '';
    res.locals.error = req.query?.error || '';
    res.locals.message = req.query?.message || '';
    res.locals.post = {};
    res.locals.posts = [];
    res.locals.followings = [];
    res.locals.users = [];
    next();
  });

  // Regisztrációs adatok form
  app.post('/register', createUser(objectRepository), (req, res, next) => {
    if (res.locals.error.length) {
      res.redirect(`/?error=${res.locals.error}&messageType=REGISTER`);
    } else {
      res.redirect('/');
    }
  });

  // Kijelentkezés
  app.post('/logout', logoutUser(objectRepository));

  // Bejelentkezési adatok form
  app.post('/login', loginUser(objectRepository), (req, res, next) => {
    if (res.locals.error.length) {
      res.redirect(`/?error=${res.locals.error}&messageType=LOGIN`);
    } else {
      res.redirect('/');
    }
  });

  // GRPR screen
  app.get('/gdpr', renderPage('gdpr'));

  // Új jelszó létrehozása form
  app.post(
    '/new-password/:uniqueHash',
    updatePwd(objectRepository),
    setNewPwdToken(objectRepository),
    (req, res, next) => {
      res.render('layout', { page: 'createNewPassword' }); // param sikeres módosításhoz
    }
  );

  // Új jelszó létrehozása screen
  app.get(
    '/new-password/:uniqueHash',
    getPwdToken(objectRepository),
    (req, res, next) => {
      res.render('layout', { page: 'createNewPassword', isLoggedIn: false });
    }
  );

  // lost password form
  app.post('/lostPassword', getPwdToken(objectRepository), (req, res, next) => {
    res.redirect('/lost-password'); // + param??
  });

  // lost password screen
  app.get('/lost-password', (req, res, next) => {
    res.render('layout', {
      page: 'lostPassword',
      isLoggedIn: res.locals?.isLoggedIn,
      errors: res.locals?.errors,
    });
  });

  // Felhasználó jelszavának módosítása űrlap
  app.post(
    '/editUserPassword',
    authUser(objectRepository),
    updatePwd(objectRepository),
    setNewPwdToken(objectRepository),
    (req, res, next) => {
      res.render('layout', { page: 'profile', isLoggedIn: true }); // plusz param sikeres jelszómódosítás
    }
  );

  // Felhasználó adatainak módosítása űrlap
  app.post(
    '/editUser',
    authUser(objectRepository),
    updateUser(objectRepository),
    getUserFromSession(objectRepository),
    (req, res, next) => {
      if (res.locals.error.length) {
        res.redirect(
          `/profile/?error=${res.locals?.error}&messageType=EDITUSER`
        );
      } else {
        res.redirect(
          `/profile/?message=${res.locals?.message}&messageType=EDITUSER`
        );
      }
    }
  );

  // Bejelentkezett felhasználó beállításai oldal.
  app.get(
    '/profile',
    authUser(objectRepository),
    getUserFromSession(objectRepository),
    renderPage('profile')
  );

  // Felhasználó oldala
  app.get(
    '/user/:userName',
    getUserByUsername(objectRepository),
    getPostsByUserId(objectRepository),
    getUsersById(objectRepository),
    renderPage('user')
  );

  // Bejelentkezett felhasználó oldala
  app.get(
    '/me',
    authUser(objectRepository),
    getUserFromSession(objectRepository),
    getPostsByUserId(objectRepository),
    getUsersById(objectRepository),
    renderPage('user')
  );

  // Post létrehozása modal
  app.post(
    '/post/create',
    authUser(objectRepository),
    createPost(objectRepository),
    (req, res, next) => {
      res.redirect(req.get('referer'));
    }
  );

  // Posthoz tartozó kép törlése
  app.post(
    '/post/deleteImage/:id',
    authUser(objectRepository),
    getPostById(objectRepository),
    deletePostImage(objectRepository),
    (req, res, next) => {
      // hova redirekteljen??
      res.render('layout', { page: 'home', isLoggedIn: true });
    }
  );

  // post szerkesztése űrlap
  app.post(
    '/post/update',
    authUser(objectRepository),
    updatePost(objectRepository),
    (req, res, next) => {
      if (res.locals.error.length) {
        res.redirect(
          `/post/${res.locals.post.id}/?error=${res.locals?.error}&messageType=EDITPOST`
        );
      } else {
        res.redirect(
          `/post/${res.locals.post.id}/?message=${res.locals?.message}&messageType=EDITPOST`
        );
      }
    }
  );

  // post szerkesztése oldal
  app.get(
    '/post/:postId',
    authUser(objectRepository),
    getPostById(objectRepository),
    renderPage('editPost')
  );

  // post törlése
  app.post(
    '/post/delete',
    authUser(objectRepository),
    getPostById(objectRepository),
    deletePost(objectRepository),
    (req, res, next) => {
      res.redirect(req.get('referer'));
    }
  );

  // Bekövetett felhasználók listája
  app.get(
    '/following/:userName',
    authUser(objectRepository),
    getUserByUsername(objectRepository),
    getFollowingPosts(objectRepository),
    renderPage('following')
  );

  // felhasználó kikövetése
  app.post(
    '/unfollow/',
    authUser(objectRepository),
    doNotFollow(objectRepository),
    (req, res, next) => {
      res.redirect(req.get('referer'));
    }
  );

  // felhasználó követése
  app.post(
    '/follow',
    authUser(objectRepository),
    doFollow(objectRepository),
    (req, res, next) => {
      res.redirect(req.get('referer'));
    }
  );

  // search form
  app.get('/searchForm', (req, res, next) => {
    const searchParam = req.searchParam;
    res.redirect(`/search/?searchParam=${searchParam}`);
  });

  // search page
  app.get(
    '/search',
    search(objectRepository),
    getPostsById(objectRepository),
    getUsersById(objectRepository),
    renderPage('search')
  );

  // homepage
  app.get('/', getPosts(objectRepository), renderPage('home'));
}
