if (process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const User = require('./models/user');

const groupsRoutes = require('./routes/groups');
const usersRoutes = require('./routes/users');
const reviewRoutes = require('./routes/reviews');

mongoose.connect('mongodb://localhost:27017/ConfApp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

//used to parse the req.body, which by defaul is empty
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
    secret: 'thisisasecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

//how to serialize a user
//how we store the user in the session
passport.serializeUser(User.serializeUser());
//how to get an user out of the ssesion
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/', usersRoutes);
app.use('/', reviewRoutes);
app.use('/groups', groupsRoutes);

//video and chat text
const server = require("http").Server(app);
const io = require("socket.io")(server);

const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
    debug: true,
});

app.use(express.static("public"));
app.use("/peerjs", peerServer);


io.on("connection", (socket) => {
    socket.on("join-room", (roomId, userId) => {
        socket.join(roomId);
        socket.broadcast.to(roomId).emit('user-connected', userId);
        socket.on("message", (message) => {
            io.to(roomId).emit("createMessage", message);
        });
        socket.on('disconnect', () => {
            socket.broadcast.to(roomId).emit('user-disconnected', userId)
        })
    });
});

app.get('/userlist', function (req, res) {
    User.find({}).then(function (users) {
        res.send(users);
    });
});

const Group = require('./models/group');
app.get('/mygroups', async (req, res) => {
    const groups = await Group.find({});
    res.render('groups/mygroups', { groups });
})

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/contact', (req, res) => {
    res.render('contact');
});

app.get('/about', (req, res) => {
    res.render('about');
});


app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404))
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something went wrong';
    res.status(statusCode).render('error', { err });
})

server.listen(8000, () => {
    console.log(`Serving on port 8000`);
});
