const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session') (session);
const cors = require('cors');

const User = require('./models/user');

const MONGODB_URI = 'mongodb://127.0.0.1:27017/campaigns'

const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({
    origin: 'http://localhost:5173', // Allow requests from this origin
    credentials: true, // Allow credentials (cookies)
  }));

const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});

app.use(
    session({
        secret: 'my secret', 
        resave: false, 
        saveUninitialized: false, 
        store: store,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 
        }
    })
    )

app.use((req, res, next)=> {
    res.locals.isLoggedIn = req.session.isLoggedIn;
    next();
})

app.use('/admin',adminRoutes);
app.use(authRoutes);

mongoose.connect(MONGODB_URI)
.then(result => {
    app.listen(3000,()=>{
        console.log("Server is running on port 3000");
    });
    
})
.catch(err => console.log(err));