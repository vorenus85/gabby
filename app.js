import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
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

// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs');

addRoutes(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
