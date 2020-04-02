

var express = require('express'),
	router = express.Router(),
	Campground = require('../models/campground'),
	Comment = require('../models/comment'),
	middleware = require('../middleware/index');


router.get('/', (req,res)=>{
	res.render('landing');
})


router.get('/campgrounds', (req,res)=>{
	Campground.find({}, (err,camps)=>{
		if(err){
			console.log(err);
		} else {
			res.render('campgrounds/index', {campgrounds: camps, currentUser: req.user});
			}
		}
	)	
})


router.post('/campgrounds', middleware.isLoggedIn,(req,res)=>{
	var name = req.body.name;
	var price = req.body.price;
	var image = req.body.image;
	var description = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	Campground.create({
		name: name,
		price: price,
		image: image,
		description: description,
		author: author,
	}, (err, newcreated)=>{
		if(err){
			console.log(err);
		} else {
			req.flash('success','Campground Added Successfully!')
			res.redirect('/campgrounds')

		}
	});
})

router.get('/campgrounds/new', middleware.isLoggedIn,(req,res)=>{
	
	res.render('campgrounds/new.ejs')
})


router.get('/campgrounds/:id', (req,res)=>{
	Campground.findById( req.params.id).populate('comments').exec( (err,camp)=>{
		if(err) {
			console.log(err);
		} else {
			console.log(camp)
			res.render('campgrounds/show', {camp: camp});
		}
	})
})


// edit route
router.get('/campgrounds/:id/edit',middleware.checkOwnership, (req, res)=>{
		Campground.findById(req.params.id, (err, camp)=>{
				res.render('campgrounds/edit', {camp: camp});
			})
});


router.put('/campgrounds/:id',middleware.checkOwnership, (req, res)=>{
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, camp)=>{
		if(err){
			console.log(err);
		} else {
			req.flash('success','Campground Edited Successfully!')

			res.redirect('/campgrounds/'+req.params.id);

		}
	});
	})


//DESTORY
router.delete('/campgrounds/:id',middleware.checkOwnership, (req, res)=>{
	Campground.findByIdAndDelete(req.params.id, (err, camp)=>{
		if(err){
			console.log(err);
			req.flash('error','Unable to Delete Campground')

			res.redirect('/campgrounds');
		} else {
			req.flash('success','Campground Deleted Successfully!')

			res.redirect('/campgrounds');
		}
	})
})






module.exports = router;
