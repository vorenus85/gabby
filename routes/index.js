import { v4 as uuidv4 } from 'uuid';
import { authUser } from '../middlewares/authUser.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import { getPosts } from '../middlewares/getPosts.js';
import { search } from '../middlewares/search.js';
import { getPostsById } from '../middlewares/getPostsById.js';
import { getPostById } from '../middlewares/getPostById.js';
import { getPostsByUserId } from '../middlewares/getPostsByUserId.js';
import { getUsersById } from '../middlewares/getUsersById.js';
import { getUserByUsername } from '../middlewares/getUserByUsername.js';
import { getUserFromSession } from '../middlewares/getUserFromSession.js';
import { doFollow } from '../middlewares/doFollow.js';
import { doNotFollow } from '../middlewares/doNotFollow.js';
import { getFollowingPosts } from '../middlewares/getFollowingPosts.js';
import { createPost } from '../middlewares/createPost.js';
import { deletePost } from '../middlewares/deletePost.js';
import { updatePost } from '../middlewares/updatePost.js';
import { deletePostImage } from '../middlewares/deletePostImage.js';
import { updateUser } from '../middlewares/updateUser.js';
import { updatePwd } from '../middlewares/updatePwd.js';
import { setNewPwdToken } from '../middlewares/setNewPwdToken.js';
import { getPwdToken } from '../middlewares/getPwdToken.js';
import { loginUser } from '../middlewares/loginUser.js';
import { logoutUser } from '../middlewares/logoutUser.js';
import { createUser } from '../middlewares/createUser.js';
import { renderPage } from '../middlewares/renderPage.js';

import moment from 'moment';
export function addRoutes(app, { postModel, userModel, saveDB }) {
  const objectRepository = {
    postModel,
    userModel,
    uuidv4,
    saveDB,
    moment,
  };

  app.all('*', isLoggedIn(), (req, res, next) => {
    res.locals.errors = {};
    res.locals.post = {};
    res.locals.posts = [];
    res.locals.followings = [];
    res.locals.users = [];
    res.locals.messages = {};
    next();
  });

  // Regisztrációs adatok form
  app.post('/register', createUser(objectRepository), (req, res, next) => {
    res.redirect('/');
  });

  // Kijelentkezés
  app.post('/logout', logoutUser(objectRepository));

  // Bejelentkezési adatok form
  app.post(
    '/login',
    loginUser(objectRepository),
    getPosts(objectRepository),
    (req, res, next) => {
      res.redirect('/');
    }
  );

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
    (req, res, next) => {
      res.render('layout', { page: 'profile', isLoggedIn: true }); // plusz param sikeres adatmódosítás
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
      res.redirect(req.get('referer'));
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
