if(process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');   
const path =require('path');
const methodOverride = require('method-override'); // method-override is a middleware that allows us to use HTTP verbs such as PUT or DELETE in places where the client doesn't support it
const ejsMate = require('ejs-mate'); // ejs-mate is a layout engine for ejs heilp us to use layouts in ejs
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require('connect-flash');
const passport = require('passport');
const User = require('./models/user.js');
const LocalStrategy = require('passport-local');


const listingRouter =require('./routes/listing.js');
const reviewRouter = require('./routes/review.js')
const userRouter = require('./routes/user.js');

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate); // ejs-mate is a layout engine for ejs heilp us to use layouts in ejs

app.use(express.static(path.join(__dirname, '/public'))); // serve static files from public directory

const store =MongoStore.create({
  mongoUrl: dbUrl,
  crypto :{
    secret: "mysupersecret",
  },
  touchAfter: 24*3600,
})

store.on('error', ()=>{
    console.log("error in mongo session store");
});

const sessionOptions ={
  store,
  secret : "mysupersecret",
  resave : false,
  saveUninitialized : true,
  cookie :{
    expire: Date.now()+7*24*60*60*1000, // cookie will expire in 7 days
    maxAge : 7*24*60*60*1000,
    httpOnly : true,
  }
};

app.use(session(sessionOptions));
app.use(flash());

// passport configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); // use the local strategy for authentication
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentuser = req.user;
  next();
});

// root route
// app.get('/', (req, res) =>{
//     res.send('this is root')
// });

app.use('/listings', listingRouter)
app.use("/listings" , reviewRouter)
app.use('/', userRouter);

 
app.use((err,req,res,next)=>{
  let { statusCode = 500, message="somthing went wrong!"} = err;
  res.render('listings/error',{ err });
});

app.listen(3000, () =>{
    console.log('server listening to port 3000');
    console.log("Connecting to DB:", dbUrl);
});

