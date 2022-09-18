const Express = require('express');
const router = Express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { isLoggedIn, validateReview, isReviewAuthor } = require('../middleware');

const Review = require('../models/review');
const reviews = require('../controllers/reviews');

router.route('/reviews')
    .post( isLoggedIn, validateReview, catchAsync(reviews.createReview))
    .get(reviews.index)

router.delete( '/reviews/:id',isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))
       
// router.get('/reviews/:id/edit', isLoggedIn, isReviewAuthor, catchAsync(reviews.EditReview))
    
// 
module.exports = router;