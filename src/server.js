import express from 'express'
const app = express()

import dotenv from 'dotenv'
import path from 'path'
dotenv.config()
const PORT = process.env.PORT

const expressServer = app.listen(PORT, '0.0.0.0', () =>
logger.verbose('timestamp: '+Date.now()+' - Server listening on port '+ PORT ))

import chat from './controllers/chat.controller.js'
chat(expressServer);

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import logger from './libs/logger.js'

const SESSION_SECRET=process.env.SESSION_SECRET

import multer from 'multer'

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./src/public/uploads");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now()+file.originalname);
    },
    });
    
const upload = multer({ storage });

const mailOptions = {
    from: 'Servidor Node.js',
    to: process.env.ADMIN_MAIL, 
    }

app.set("view engine", ".ejs");

import session from 'express-session' 

import passport from 'passport'
import config from './config.js'

import prodRouter from './routes/prodindex.js'
import cartRouter from './routes/cartindex.js'
import userAuth from './controllers/auth.controller.js'

import User from './models/userModel.js'

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// comienza auth
app.use(
    session({
        secret: SESSION_SECRET,
        cookie: {
            httpOnly: false,
            secure: false,
            maxAge: config.TIEMPO_EXPIRACION,
        },
        rolling: true,
        resave: false,
        saveUninitialized: false,
        })
);

app.use(passport.initialize());
app.use(passport.session());

import libPassport from './libs/passport.js'

app.use(express.static(`${__dirname}/public`));
app.use(express.json());

passport.use("register", libPassport.signupStrategy);
passport.use("login", libPassport.loginStrategy);

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, done);
});

app.get("/signup", userAuth.getSignup);

app.post(
    "/register", upload.single('userPic'),
    passport.authenticate("register", { failureRedirect: "/failsignup" }),
    userAuth.postSignup
);

app.get("/failsignup", userAuth.getFailsignup);

app.get("/", userAuth.getLogin);

app.get("/login", userAuth.getLogin);

app.post("/login",
  passport.authenticate("login", { failureRedirect: "/faillogin" }),
  userAuth.postLogin
);
app.get("/faillogin", userAuth.getFaillogin);

app.get("/api/logout", async (req, res) => {
    try {
        req.session.destroy()
        res.redirect("/");
    } catch (err) {
    logger.error(`timestamp: ${Date.now()} - Logout - Error: ${err}`);
    res.json({ error: true, message: err });
    }
});

app.use('/api/productos', userAuth.apiLogin, prodRouter)
app.use('/api/carrito', userAuth.apiLogin, cartRouter)

app.use((req,res) => {
    const { url, method } = req;
    logger.warn(`timestamp: ${Date.now()} - url: ${url} method: ${method} - Not found`);
    
    res.status(404).json({ error : 'not found' })
});
