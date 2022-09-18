const { groupSchema, reviewSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Group = require('./models/group');
const Review = require('./models/review');
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        //store the url they are requesting!
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateGroup = (req, res, next) => {
    const { error } = groupSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const group = await Group.findById(id);
    if (!group.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to edit this campground');
        return res.redirect(`/groups/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id } = req.params;
    const review = await Review.findById(id);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/reviews`);
    }
    next();
}

module.exports.isMember = async (req, res, next) => {
    const { id } = req.params;
    const group = await Group.findById(id);
    let memberFlag = false;
    for (let j of group.members) {
        if (req.user._id.equals(j._id))
            memberFlag = true;
    }
    if (memberFlag === false) {
        req.flash('error', 'You do not have permission to view this campground');
        return res.redirect(`/groups`);
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}
