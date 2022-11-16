"use strict";
import { Router } from 'express'
const prodRouter = Router()

import daos from "../daos/index.js";

import userAuth from '../controllers/main.js'

import logger from '../controllers/logger.js'

let id;

const productoDao = daos.ProductoDao

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

prodRouter.get("/:cat/category", async (req, res) => {
    const cat = req.params.cat
    const response = await productoDao.listarByCat(cat);
    res.status(response.http_res).json(response.result)
});

prodRouter.post('/', userAuth.isAdmin, async (req,res) => {

    const { title, price, code, thumbnail, stock, category } = req.body
    const timestamp = Date.now()

    const response = await productoDao.newProd({timestamp,title,code,thumbnail,price,stock,category})

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
    const category = req.body.category

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