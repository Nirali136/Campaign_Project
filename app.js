const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session') (session);
const cors = require('cors');
const multer = require('multer');
const {v4 : uuidv4} = require('uuid');
const path = require('path');

const User = require('./models/user');

const MONGODB_URI = 'mongodb://127.0.0.1:27017/campaigns'

const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

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

const fileStorage = multer.diskStorage({
    destination: (req, file, cb)=> {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, `${uuidv4()}-${file.originalname}`);
    }
})

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/png' || 
       file.mimetype === 'image/jpg' || 
       file.mimetype === 'image/jpeg')
       {
        cb(null, true);
       }else{
        cb(null, false);
       }
}

app.use(multer({storage: fileStorage, fileFilter: fileFilter  }).array('imageUrl'));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
    if(!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            if(!user){
                return next();
            }
            req.user = user;
            next();
        })
        .catch(err => {
            throw new Error(err);
        });
})
app.use('/admin',adminRoutes);
app.use(authRoutes);
app.use(userRoutes);

mongoose.connect(MONGODB_URI)
.then(result => {
    app.listen(3000,()=>{
        console.log("Server is running on port 3000");
    });
    
})
.catch(err => console.log(err));