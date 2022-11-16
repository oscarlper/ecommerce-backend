"use strict";
import { Router } from 'express'
import dotenv from "dotenv";
dotenv.config();

import path from 'path'
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cartRouter = Router()

import daos from "../daos/index.js";

import sendNodeEmail from '../controllers/nodemailer.js'

const mailOptions = {
    from: 'Servidor Node.js',
    to: process.env.ADMIN_MAIL, 
    }

import twilio from 'twilio'
const accountSid = process.env.TWILIO_SID; 
const authToken = process.env.TWILIO_TOKEN; 
const client = twilio(accountSid, authToken); 

let id;
let id_prod;

const CarritoDao = new daos.CarritoDao

cartRouter.get("/checkout", async (req, res) => {
    const username = req.user.email
    const fullname = req.user.firstName+' '+req.user.lastName
    const telephone = req.user.telephone
    const response = await CarritoDao.listarByUsername(username);
    await sendEmailCart(response,username,fullname)
    await sendSMS(telephone)
    await sendWhatsapp(username, fullname)
    res.sendFile(path.join(__dirname + "/../public/checkout.html"));
});

cartRouter.get("/", async (req, res) => {
    const response = await CarritoDao.listarAll()
        res.status(response.http_res).json(response.result)
    }
);

cartRouter.get("/username", async (req, res) => {
    const username = req.user.email
    const response = await CarritoDao.listarByUsername(username);
    res.status(response.http_res).json(response.result)
});

cartRouter.get("/:id", async (req, res) => {
    const id = req.params.id
    const response = await CarritoDao.listar(id);
    res.status(response.http_res).json(response.result)
});


cartRouter.post('/', async (req,res) => {

    const { id_prod, stock, cant } = req.body
    const timestamp_cart = Date.now()
    const timestamp_prod = Date.now()
    const username_cart = req.body.username_cart
    const response = await CarritoDao.newCart({username_cart,timestamp_cart,products:[{timestamp_prod,id_prod,stock,cant}]})

    res.status(response.http_res).json(response.result)
})

cartRouter.delete('/:id', async(req,res) => {
    id = req.params.id
    const response = await CarritoDao.delProd(id)
    res.status(response.http_res).json(response.result)
})

cartRouter.delete('/:id/productos/:id_prod', async(req,res) => {
    id = req.params.id
    id_prod = req.params.id_prod
    const response = await CarritoDao.delProdCart(id,id_prod)
    res.status(response.http_res).json(response.result)
})

cartRouter.post('/:id/productos', async (req,res) => {
    id = req.params.id
    const response = await CarritoDao.addProdCart(id,req.body)
    res.status(response.http_res).json(response.result)
})

async function sendEmailCart(response,username,fullname) {
    const prodCart = response.result[0].products
    let dataMailHTML = `<p>Carrito de compras</p>`

    prodCart.forEach(item => {
        dataMailHTML += `<p>id_prod: ${item.id_prod} - cant: ${item.cant}</p>`
    })

    const subjectMail = `Nueva compra de ${fullname} <${username}>`
    //const dataMail = `username: ${req.body.email}<br>
    //                firstName: ${req.body.firstName}<br>
    //                lastName: ${req.body.lastName}<br>`

    mailOptions.subject = `CH - Notification: ${subjectMail}`
    mailOptions.html = dataMailHTML
    sendNodeEmail(mailOptions)
}

async function sendSMS(phonenumber){
    try {
    const message = await client.messages.create({
        body: `Su pedido ya fue registrado y se encuentra en proceso>`,
        from: '+19288578634',
        to: '+5491156391497'
        }) 
        logger.verbose(`timestamp: ${Date.now()} - ${message}`);
    } catch(error) {
        logger.verbose(`timestamp: ${Date.now()} - ${error}`);
    }
}

async function sendWhatsapp(username, fullname) {
    const options = {
        body: `Nuevo pedido de ${fullname} - ${username}`,
        from: "whatsapp:+14155238886",
        to: "whatsapp:+5491156391497",
    };
    
    try {
        const message = await client.messages.create(options);
    
        logger.verbose(`timestamp: ${Date.now()} - ${message}`);
    } catch (error) {
        logger.verbose(`timestamp: ${Date.now()} - ${error}`);
    }
}


export default cartRouter;