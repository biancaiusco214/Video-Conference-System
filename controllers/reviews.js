const Review = require('../models/review');

module.exports.index = async (req, res) => {
    const reviews = await Review.find({}).populate('author');
    // console.log(reviews)
    res.render('reviews/reviews', { reviews });
}

module.exports.createReview = async (req, res) => {
    const review = new Review(req.body.review);
    review.author = req.user._id;
    await review.save();
    req.flash('success', 'Created new review!');
    res.redirect('/reviews');
}

module.exports.renderReview = (req, res) => {
    res.render('reviews/reviews');
}

module.exports.deleteReview = async (req, res) => {
    await Review.findByIdAndRemove(req.params.id);
    req.flash('success', 'Successfully deleted review')
    res.redirect('/reviews');
}

module.exports.EditReview = async (req, res) => {
    const review = await Review.findById(req.params.id) 
    if (!review) {
        req.flash('error', 'Cannot find that group!');
        return res.redirect('/groups');
    }
    res.render('reviews/edit', {  review });
}