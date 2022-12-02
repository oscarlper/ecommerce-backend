import LocalStrategy from 'passport-local'
import bcrypt from 'bcrypt'
import User from '../models/userModel.js'
import sendNodeEmail from './nodemailer.js'

const signupStrategy = new LocalStrategy(
    { passReqToCallback: true },
    async (req, email, password, done) => {
    try {
        const existingUser = await User.findOne({ email });

        if (existingUser || password != password2 ) {
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
    } catch (error) {
        logger.verbose(`timestamp: ${Date.now()} - ${error}`);
        done(error);
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

function hashPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

function isValidPassword(reqPassword, hashedPassword) {
    return bcrypt.compareSync(reqPassword, hashedPassword);
}

export default {
                loginStrategy,
                signupStrategy,
                hashPassword,
                isValidPassword
            };