import express from 'express'
const app = express()
import dotenv from 'dotenv'
dotenv.config()
const portExpress = process.env.EXPRESS_PORT

import prodRouter from './routes/prodindex.js'
import cartRouter from './routes/cartindex.js'

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/productos', prodRouter)
app.use('/api/carrito', cartRouter)
app.use((req,res) => {
    res.status(404).json({ error : 'not found' })
});

app.listen(portExpress, (e) => {
    if (e) {
        console.log('error')
    } else {
        console.log('server ok')
    }
})