import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import { initDatabase } from './services/db.js';
import { addRoutes } from './routes/index.js';

const app = express();
const port = 3000;

app.use(
  session({
    secret: 'it61s3t78n9srq37t7t8',
    resave: false,
    saveUninitialized: true,
  })
);

app.use('/uploads', express.static('uploads'));
app.use('/public', express.static('public'));

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
