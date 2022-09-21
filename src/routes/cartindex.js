"use strict";
import { Router } from 'express'
import dotenv from "dotenv";
dotenv.config();
const cartRouter = Router()

import daos from "../daos/index.js";

let id;
let id_prod;

const CarritoDao = new daos.CarritoDao

cartRouter.get("/", async (req, res) => {
    const response = await CarritoDao.listarAll()
        res.status(response.http_res).json(response.result)
    }
);

cartRouter.get("/:id", async (req, res) => {
    const id = req.params.id
    const response = await CarritoDao.listar(id);
    res.status(response.http_res).json(response.result)
});

//cartRouter.post('/',userAuth , async (req,res) => {
cartRouter.post('/', async (req,res) => {

    const { id_prod, stock, cant } = req.body
    const timestamp_cart = Date.now()
    const timestamp_prod = Date.now()

    const response = await CarritoDao.newCart({timestamp_cart,products:[{timestamp_prod,id_prod,stock,cant}]})

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

export default cartRouter;