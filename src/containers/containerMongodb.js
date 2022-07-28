import config from "../config.js";
import mongoose from "mongoose";

await mongoose.connect(config.mongodb.connectionString);

class ContenedorMongodb {
    constructor(nombreColeccion, esquema) {
        this.coleccion = mongoose.model(nombreColeccion, esquema);
    }

    async listar(id) {
        try {
            if ((await this.coleccion.find({ _id: id }, { __v: 0 })).length > 0) {
                const doc = await this.coleccion.find({ _id: id }, { __v: 0 });
                return {'result': doc,'http_res':201 };
            } else {
                return {'result': {error: 'id no encontrado'},'http_res':404}
            }
        } catch (error) {
            return {'result': {error: 'Error en db'},'http_res':404}
        }
    }

    async listarAll() {
        try {
            const doc = await this.coleccion.find({}, { __v: 0 });
            return {'result': doc,'http_res':201}
        } catch (error) {
            return {'result': {error: 'Error, no se encontraron productos'},'http_res':404};
        }
    }

    async newProd(objetoProd) {
        console.log(objetoProd)
        try {
            const doc = await this.coleccion.create(objetoProd)
            return {'result': {'id': doc._id}, 'http_res':201}
        } catch (error) {
            console.log(error)
            return {'result': {error: 'Error de escritura en db'},'http_res':404}
        }
    }

    async delProd(id) {
        try {
            if ((await this.coleccion.find({ _id: id }, { __v: 0 })).length > 0) {
                const doc = await this.coleccion.deleteOne({ _id: id })
                return await this.listarAll()
            } else {
                return {'result': {error: 'id no encontrado'},'http_res':404}
            }
        } catch (error) {
            return {'result': {error: 'Error en db'},'http_res':404}
        }
    }

    async delProdCart(id,id_prod) {
        try {
            if ((await this.coleccion.find({ $and:[{id: id}] }, { __v: 0 })).length > 0) {
                console.log('encontrado')
                const result = await this.coleccion.updateOne(
                    { "_id": id },
                    { $pull: { "products": { "id_prod": id_prod } } },
                );
                console.log(result)
                return await this.listar(id)
            } else {
                return {'result': {error: 'id no encontrado'},'http_res':404}
            }
        } catch (error) {
            return {'result': {error: 'Error en db'},'http_res':404}
        }
    }

    async addProdCart(id,data) {
        try {
            if ((await this.coleccion.find({ _id: id }, { __v: 0 })).length > 0) {
                console.log('voy a agregar esto',id,data)
                const result = await this.coleccion.updateOne({_id: id},{$push: {products: data}});
                console.log(result)
                return await this.listar(id)
            } else {
                return {'result': {error: 'id no encontrado'},'http_res':404}
            }
        } catch (error) {
            return {'result': {error: 'Error en db'},'http_res':404}
        }
    }

    async newCart(objetoCart) {
        try {
            const doc = await this.coleccion.create(objetoCart)
            return {'result': {'id': doc._id}, 'http_res':201}
        } catch (error) {
            return {'result': {error: 'Error de escritura en db'},'http_res':404}
        }
    }

    async updateProd(id,data) {
        let dataToUpdate = {}
        try {
            if ((await this.coleccion.find({ _id: id }, { __v: 0 })).length > 0) {
                const doc = await this.coleccion.find({ _id: id }, { __V: 0 });
                dataToUpdate.timestamp = Date.now()
                data.code == null || data.code == undefined ? dataToUpdate.code = doc[0].code : dataToUpdate.code = data.code
                data.title == null || data.title == undefined? dataToUpdate.title = doc[0].title : dataToUpdate.title = data.title
                data.price == null || data.price == undefined? dataToUpdate.price = doc[0].price : dataToUpdate.price = data.price
                data.thumbnail == null || data.thumbnail == undefined? dataToUpdate.thumbnail = doc[0].thumbnail : dataToUpdate.thumbnail = data.thumbnail
                data.stock == null || data.stock == undefined ? dataToUpdate.stock = doc[0].stock : dataToUpdate.stock = data.stock
                try {
                    console.log(dataToUpdate)
                    const doc = await this.coleccion.updateOne({ _id: id }, dataToUpdate);
                    return await this.listar(id)
                } catch (error) {
                    console.log(error);
                    return {'result':  {error: 'No se actualizo el producto, error de db'},'http_res':404}
                }
            } else {
                return {'result': {error: 'producto no encontrado'},'http_res':404}
            }
        } catch(error){
            console.log(error)
            return {'result':  {error: 'No se actualizo el producto, error de db'},'http_res':404}
        }
    }
}

export default ContenedorMongodb;