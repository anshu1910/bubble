const express = require('express');
const app = express();
const port = 8000;
const expressLayouts= require('express-ejs-layouts');
const db = require('./config/mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT =  require('./config/passport-jwt-strategy'); 
const passpostGoogle = require('./config/passport-google-oauth2-strategy');
const MongoStore = require('connect-mongo');
const sassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const customMware = require('./config/middleware');
//setting up chat server
const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000);
console.log('chat server is listening on port 5000');

app.use(sassMiddleware({
    src: './assets/scss',
    dest: './assets/css',
    debug: true,
    outputStyle: 'expanded',
    prefix: '/css'
}));

app.use(express.urlencoded({ extended: false}));
app.use(cookieParser());
app.use(express.static('./assets'));
//make the uploads path available 
app.use('/uploads', express.static(__dirname + '/uploads'));

app.use(expressLayouts);
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(session({
name : 'bubble',
//TODO change the secret before deployment in production mode
secret: 'blah_blah',
saveUninitialized: false,
resave: false,
cookie: {
    maxAge: (1000*60*100)
},
store: MongoStore.create(
    {
        mongooseConnection: db,
        mongoUrl: 'mongodb://localhost/bubble_development',
        autoRemove: 'disabled'
    }
)
}));

app.use(passport.initialize());
app.use(passport.session());
app.use (passport.setAuthenticatedUser);
app.use(flash());
app.use(customMware.setFlash);

app.use('/', require('./routes'));

app.listen(port, function(err){
    if(err){
        console.log(`Error: ${err}`);
    }
    console.log('Server is up and running at port: ',port);
});


