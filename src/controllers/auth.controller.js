import path from 'path'
import logger from '../libs/logger.js'
import dotenv from 'dotenv'
import os from 'os'

dotenv.config()

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let osCPU = null
let expressPORT = null
let database = null
let db_user = null
let db_cluster = null
let db_name = null
let running_mode = null
let admin_mail = null
let admin_wsp = null
let sendmail = null
let userlevel = 'unknown'

function getRoot(req, res) {}

function getLogin(req, res) {
  if (req.isAuthenticated()) {
    var user = req.user;   
    
    if (user.isAdmin) {
      userlevel = 'Administrator'
      osCPU = os.cpus().length
      expressPORT = process.env.PORT
      database = process.env.DATABASE
      db_user = process.env.DB_USER
      db_cluster = process.env.DB_CLUSTER
      db_name = process.env.DB_NAME
      running_mode = process.env.MODE
      admin_mail = process.env.ADMIN_MAIL
      admin_wsp = process.env.ADMIN_WHATSAPP
      sendmail = process.env.USER_MAIL  
      console.log(sendmail)
    } else { 
      userlevel = 'User'
    }

    logger.verbose(`timestamp: ${Date.now()} user logueado`);
    res.render("home.ejs", {
      usuario: user.email,
      nombre: user.firstName,
      apellido: user.lastName,
      telephone: user.telephone,
      mode: process.env.MODE || 'TEST',
      userpicture: user.userPic,
      level: userlevel,
      oscpu: osCPU,
      expressport: expressPORT,
      database: database,
      dbuser: db_user,
      dbcluster: db_cluster,
      dbname: db_name,
      runnningmode: running_mode,
      adminmail: admin_mail,
      adminwsp: admin_wsp,
      sendmail: sendmail
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



