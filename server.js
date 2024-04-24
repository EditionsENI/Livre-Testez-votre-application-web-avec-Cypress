const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');


const app = express();
const port = 3000;

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(bodyParser.json());

app.use(cookieParser());
const csrfProtection = csrf({ cookie: true });

app.use('/articles', express.static('articles'));
app.use(express.static(__dirname));

const connection = mysql.createConnection({
  host: 'db', 
  user: 'root',
  password: 'rootpassword',
  database: 'blog_cypress'
});

app.post('/post-comment', function(req, res) {
  const comment = req.body.comment;
  connection.query('INSERT INTO comments (comment) VALUES (?)', [comment], function(error, results, fields) {
      if (error) throw error;
      res.send(JSON.stringify(results));
  });
});

connection.connect();

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/get-comments', function(req, res) {
  connection.query('SELECT * FROM comments ORDER BY id DESC LIMIT 10', function(error, results, fields) {
      if (error) throw error;
      res.json(results);
  });
});

app.get('/get-users', (req, res) => {
  connection.query('SELECT * FROM users', (error, results) => {
      if (error) throw error;
      res.json(results);
  });
});

app.post('/mfa/send-code', (req, res) => {
  if (!req.body || !req.body.email) {
    return res.status(400).json({ error: 'Email requis' });
  }
  const code = Math.floor(100000 + Math.random() * 900000);
  console.log(`Code MFA envoyé à ${req.body.email}: ${code}`);
  res.status(200).json({ success: true });
});


app.get('/login', csrfProtection, (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
});
app.set('view engine', 'ejs');
app.set('views', __dirname);
app.post('/login', csrfProtection, (req, res) => {
  res.send('Connexion réussie');
});
