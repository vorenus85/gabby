import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import { initDatabase } from './services/db.js';
import { addRoutes } from './routes/index.js';

const app = express();
const port = 3000;

app.use('/uploads', express.static('uploads'));
app.use('/public', express.static('public'));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs');
initDatabase((err, { postModel, userModel, saveDB }) => {
  if (err) {
    return console.log('App cannot start', err);
  }
  addRoutes(app, { postModel, userModel, saveDB });
  app.listen(3000, () => {
    console.log(`App listening on port ${port}`);
  });
});
