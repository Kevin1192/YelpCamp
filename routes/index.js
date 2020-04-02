var express = require('express'),
	router = express.Router(),
	passport = require('passport');
var User = require('../models/user');




// Auth routes
router.get('/register', (req, res)=>{
	res.render('register');
})

router.post('/register', (req, res)=>{
	User.register(new User({username: req.body.username}), req.body.password, (err, user)=>{
		if(err){
			console.log(err);
			req.flash('error', err.message);
			return res.redirect('/register');
		}
		passport.authenticate('local')(req, res, ()=>{
			req.flash('success','Welcome to Campground '+user.name+ "!")
			res.redirect('/campgrounds')
		})
	});
});

router.get('/login', (req, res)=>{
	res.render('login');
})

router.post('/login', passport.authenticate('local', {
	successRedirect: '/campgrounds',
	failureRedirect: '/register',
}), (req, res)=>{
});

router.get('/logout', (req, res)=>{
	req.logout();
	res.redirect('/');
})

module.exports = router;