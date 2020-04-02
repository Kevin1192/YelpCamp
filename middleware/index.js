var middlewareObj = {};
var Comment = require('../models/comment'),
	Campground = require('../models/campground');

middlewareObj.checkOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, (err, camp)=>{
		if(err){
			req.flash('error','Campground Not Found!')
			res.redirect('back');
		} else {
			if(camp.author.id.equals(req.user._id)){
				next();
			} else {
				req.flash('error', 'Please You need to login first!');
				res.redirect('back');
			}
		}
	
	})
	} else {
		res.redirect('/login');
	}
	
}
	

middlewareObj.checkCommentOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, (err, comment)=>{
		if(err){
			console.log(err);
			res.redirect('back');
		} else {
			if(comment.author.id.equals(req.user._id)){
				next();
			} else {
				res.redirect('back');
			}
		}
	})
	} else {
		res.redirect('/login');
	}
	
}

middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash('error', 'Please Login First!');
	res.redirect('/login');
}






module.exports = middlewareObj