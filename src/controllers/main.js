import path from 'path'
import logger from './logger.js'
import dotenv from 'dotenv'

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getRoot(req, res) {}

function getLogin(req, res) {
  if (req.isAuthenticated()) {
    var user = req.user;
    
    let userlevel = 'unknown'
    user.isAdmin ? userlevel = 'Administrator' : userlevel = 'User'

    logger.verbose(`timestamp: ${Date.now()} user logueado`);
    res.render("home.ejs", {
      usuario: user.email,
      nombre: user.firstName,
      apellido: user.lastName,
      telephone: user.telephone,
      mode: process.env.MODE || 'TEST',
      userpicture: user.userPic,
      level: userlevel
    });
  } else {
    logger.verbose(`timestamp: ${Date.now()} user NO logueado`);
    logger.warn(`timestamp: ${Date.now()} - url: ${req.url} - method: ${req.method} - User no logueado` );
    res.sendFile(path.join(__dirname + "/../public/login.html"));

  }
}

function apiLogin(req, res, next) {
  if (req.isAuthenticated()) {
    var user = req.user;
    next()
  } else {
    logger.verbose(`timestamp: ${Date.now()} user NO logueado`);
    logger.warn(`timestamp: ${Date.now()} - url: ${req.url} - method: ${req.method} - User no logueado` );
    return res.status(404).json({error: "Usuario no autorizado"})
  }
}

function isAdmin(req, res, next) {
  var user = req.user;
  if (user.isAdmin) {
    next()
  } else {
    return res.status(404).json({error: "Usuario sin privilegios de administrador"})
  }
}

function getSignup(req, res) {
  res.sendFile(path.join(__dirname + "/../public/signup.html"));
}

function postLogin(req, res) {
  var user = req.user;

  res.sendFile(path.join(__dirname + "/../public/index.html"));
}

function postSignup(req, res) {
    var user = req.user;
    res.sendFile(path.join(__dirname + "/../public/index.html"));
}

function getFaillogin(req, res) {
  res.render("login-error.ejs", {})
}

function getFailsignup(req, res) {
  res.render("signup-error.ejs", {})
}

function getLogout(req, res) {
  req.logout();
  res.sendFile(path.join(__dirname + "/../public/home.html"));
}

function failRoute(req, res) {
  const { url, method } = req;
  logger.error(`timestamp: ${Date.now()} - url: ${url} - method: ${method} - routing=error`);
  res.status(404).render("routing-error", {});
}

export default {
  getRoot,
  getLogin,
  postLogin,
  getFaillogin,
  getLogout,
  failRoute,
  getSignup,
  postSignup,
  getFailsignup,
  apiLogin,
  isAdmin
};



