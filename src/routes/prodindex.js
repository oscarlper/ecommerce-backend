"use strict";
import { Router } from 'express'
const prodRouter = Router()

import daos from "../daos/index.js";

import userAuth from '../controllers/userAuth.js'

let id;

const productoDao = new daos.ProductoDao

prodRouter.get("/", async (req, res) => {
try{
    const response = await productoDao.listarAll()
        res.status(response.http_res).json(response.result)
} catch(error) {
    logger.verbose(`timestamp: ${Date.now()} - ${error}`);
}
    }
);

prodRouter.get("/:id", async (req, res) => {
    const id = req.params.id
    const response = await productoDao.listar(id);
    res.status(response.http_res).json(response.result)
});

prodRouter.post('/', userAuth.isAdmin, async (req,res) => {

    const { title, price, code, thumbnail, stock } = req.body
    const timestamp = Date.now()

    const response = await productoDao.newProd({timestamp,title,code,thumbnail,price,stock})

    res.status(response.http_res).json(response.result)
})

prodRouter.delete('/:id', userAuth.isAdmin, async(req,res) => {
    id = req.params.id
    const response = await productoDao.delProd(id)

    res.status(response.http_res).json(response.result)
   
})

prodRouter.put('/:id', userAuth.isAdmin, async (req,res) => {
    const id = req.params.id
    const title = req.body.title
    const code = req.body.code
    const thumbnail = req.body.thumbnail
    const price = req.body.price
    const stock = req.body.stock

    let data = {"title": title,
                "code": code,
                "thumbnail": thumbnail,
                "price":price,
                "stock":stock,
                }

    const response = await productoDao.updateProd(id,data)

    res.status(response.http_res).json(response.result)
})

export default prodRouter