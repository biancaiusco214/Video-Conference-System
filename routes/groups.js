const Express = require('express');
const router = Express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateGroup, isMember } = require('../middleware');
const groups = require('../controllers/groups');

const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route('/')
    .get(catchAsync(groups.index))
    .post(isLoggedIn, upload.single('image'), validateGroup, catchAsync(groups.createGroup));

router.get('/new', isLoggedIn, groups.renderNewGroup);

router.route('/:id')
    .get(isLoggedIn, isMember, catchAsync(groups.showGroup))
    .put(isLoggedIn, isAuthor, catchAsync(groups.AddUser))
    .put(isLoggedIn, isAuthor, upload.single('image'), validateGroup, catchAsync(groups.updateGroup))
    
    .delete(isLoggedIn, isAuthor, catchAsync(groups.deleteGroup));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(groups.editGroup));

router.get('/:id/members', isLoggedIn, isAuthor, catchAsync(groups.AddMembers));

router.get('/:id/call', isLoggedIn, groups.Call);
router.get('/:id/:room', isLoggedIn, groups.Calling);

module.exports = router;