var express = require('express'),
	router = express.Router(),
	Campground = require('../models/campground'),
	Comment = require('../models/comment'),
	middleware = require('../middleware/index');





//comments routes
router.get('/campgrounds/:id/comments/new',middleware.isLoggedIn, (req,res)=>{
	Campground.findById(req.params.id, (err, camp)=>{
		if(err){
			console.log(err)
		} else {
			res.render('comments/new', {camp: camp});
		}
	})
})


router.post('/campgrounds/:id/comments',middleware.isLoggedIn, (req,res)=>{
	console.log(req.params.id)
	Campground.findById(req.params.id, (err, camp)=>{
		if(err){
			req.flash('error','Unable to Add Comment');
			res.redirect('/campgrounds');

		} else {
			Comment.create(req.body.comment, (err, comment)=>{
				if(err){
					console.log(err)
				} else {
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					camp.comments.push(comment);
					camp.save();
					req.flash('success','Comment Added Successfully!')
					res.redirect('/campgrounds/'+req.params.id);
				}
			})
		}
	})
})


router.get('/campgrounds/:id/comments/:comment_id/edit',middleware.checkCommentOwnership, (req, res)=>{
	Comment.findById(req.params.comment_id, (err, comment)=>{
		if(err) {
			console.log(err);
			res.redirect('back');
		} else {
			res.render('comments/edit', {camp_id: req.params.id, comment: comment})
		}
	})
});

router.put('/campgrounds/:id/comments/:comment_id',middleware.checkCommentOwnership, (req, res)=>{
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, comment)=>{
		if (err) {
			res.redirect('back');
		} else {
			req.flash('success','Comment Edited Successfully!');
			res.redirect('/campgrounds/'+req.params.id);
		}
	})
})

// comment destory route
router.delete('/campgrounds/:id/comments/:comment_id',middleware.checkCommentOwnership, (req, res)=>{
	Comment.findByIdAndDelete(req.params.comment_id, (err, deleted)=>{
		if(err){
			res.redirect('/campgrounds/'+req.params.id)
		} else{
			req.flash('success','Comment Deleted Successfully!')
			res.redirect('/campgrounds/'+req.params.id)
		}
	})
})





module.exports = router;