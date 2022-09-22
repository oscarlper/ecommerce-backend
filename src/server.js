import express from 'express'
const app = express()
import dotenv from 'dotenv'
import path from 'path'
dotenv.config()
const portExpress = process.env.EXPRESS_PORT

import sendNodeEmail from './controllers/nodemailer.js'

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import logger from './controllers/logger.js'

const SESSION_SECRET=process.env.SESSION_SECRET
const isCluster = process.argv[3] == 'cluster'

import cluster from 'cluster'
import os from 'os'

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

import bcrypt from 'bcrypt'
import passport from 'passport'
import LocalStrategy from 'passport-local' //.Strategy
import config from './config.js'

import prodRouter from './routes/prodindex.js'
import cartRouter from './routes/cartindex.js'
import userAuth from './controllers/userAuth.js'

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

// CLUSTER
if (isCluster && cluster.isPrimary) {
        
    cluster.fork()

    cluster.on("exit", (worker) => {
        console.log(`Worker ${worker.process.id} stopped`);

        cluster.fork()

    })
} else {
    const expressServer = app.listen(portExpress, () => 
    console.log(`Server listening on port ${portExpress}`))
}
//

function hashPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

function isValidPassword(reqPassword, hashedPassword) {
    return bcrypt.compareSync(reqPassword, hashedPassword);
}

const signupStrategy = new LocalStrategy(
    { passReqToCallback: true },
    async (req, email, password, done) => {
    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
        userAuth.getFailsignup
        logger.error(`timestamp: ${Date.now()} - Username: ${email} - Fail Signup`);
        return done(null, false);
        }
        const newUser = {
            email: email,
            password: hashPassword(password),
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            telephone: req.body.telephone,
            isAdmin: false,
            userPic: req.file.filename,
            };

        // codigo to send
        const subjectMail = 'New Account Created'
        const dataMail = `username: ${email}<br>
                        firstName: ${req.body.firstName}<br>
                        lastName: ${req.body.lastName}<br>
                        telephone: ${req.body.telephone}<br>
                        `

        mailOptions.subject = `CH - Notification: ${subjectMail}`
        mailOptions.html = `<h1 style="color: blue;">Notificacion: <span style="color: green;">${subjectMail}<br>${dataMail}</span></h1>`
        sendNodeEmail(mailOptions)


        const createdUser = await User.create(newUser);

        return done(null, createdUser);
    } catch (err) {
        console.log(err);
        done(err);
    }
    }
);

const loginStrategy = new LocalStrategy(async (email, password, done) => {
    const user = await User.findOne({ email });
    if (user && isValidPassword(password, user.password)) {
        return done(null, user);
    } else {
        userAuth.getFaillogin
        logger.error(`timestamp: ${Date.now()} - email: ${email} - Fail Login`);
        return done(null, null)
    }
});

app.use(express.static(`${__dirname}/public`));
app.use(express.json());

passport.use("register", signupStrategy);
passport.use("login", loginStrategy);

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
// userAuth.isAdmin (para verificar booleano isAdmin en user@mongodb)
// todas la funcionalidades de api requiere autenticacion y el filtrado 
// por admin se realiza en routes/prodindex y cartindex

app.use('/api/productos', userAuth.apiLogin, prodRouter)
app.use('/api/carrito', userAuth.apiLogin, cartRouter)

app.use((req,res) => {
    //console.log(req.session)
    const { url, method } = req;
    logger.warn(`timestamp: ${Date.now()} - url: ${url} method: ${method} - Not found`);
    
    res.status(404).json({ error : 'not found' })
});
