var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	LocalStrategy = require('passport-local'),
	flash = require('connect-flash'),
	Campground = require('./models/campground.js'),
	methodOverride = require('method-override'),
	Comment = require('./models/comment.js'),
	User = require('./models/user.js'),
	seedDB = require('./seeds.js')

var commentRoutes = require('./routes/comments.js'),
	campgroundRoutes = require('./routes/campgrounds.js'),
	authRoutes = require('./routes/index');

mongoose.connect('mongodb://localhost/camp', { useNewUrlParser: true, useUnifiedTopology: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());
//Schema

//
app.use(require('express-session')({
	secret: 'lala',
	resave: false,
	saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
		res.locals.currentUser = req.user;
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
		next();
		})

app.set('view engine', 'ejs');



///////////////////////////////////===================
// ===================================================


app.use(authRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);

app.listen(3000, ()=>{
	console.log('Camp started at 3000')
})