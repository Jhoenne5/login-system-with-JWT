const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes')
const cookieParser = require('cookie-parser')
const app = express()
const authMiddleware = require("./middleware/authMiddleware")



// middleware
app.use(express.static('public'));
app.use(express.json())
app.use(cookieParser())


// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = 'mongodb+srv://jhoenne:test123@jhoblog.ogkm3mm.mongodb.net/node-auth';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => {console.log("Connected to Db and Listening for request") , app.listen(3000) })
  .catch((err) => console.log(err));

// routes
app.get('*', authMiddleware.checkUser)
app.get('/',  (req, res) => res.render('home'));
app.get('/pets', authMiddleware.requireAuth, (req, res) => res.render('pets'));
app.use(authRoutes)

