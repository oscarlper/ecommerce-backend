import admin from "firebase-admin";
import config from "../config.js";

admin.initializeApp({
    credential: admin.credential.cert(config.firebase),
});

const db = admin.firestore();

class ContenedorFirebase {
    constructor(nombreColeccion) {
        this.coleccion = db.collection(nombreColeccion);
    }

    async listar(id) {
        try {
            const doc = await this.coleccion.doc(id).get();
            console.log(doc)
            if (doc.exists) {
                const data = doc.data();
                return {'result': {...data, id: id},'http_res':201 };
            } else {
                return {'result': {error: 'producto no encontrado'},'http_res':404}
                    
            }
        } catch (error) {
            return {'result': {error: 'Error de lectura en db'},'http_res':404};
        } 
    }

    async listarAll() {
        try {
            const doc = await this.coleccion.get()
            const products = []
            doc.forEach(doc => {
                products.push({'id':doc.id, 
                            'code':doc.data().code,
                            'title':doc.data().title,
                            'timestamp':doc.data().timestamp,
                            'thumbnail':doc.data().thumbnail,
                            'stock':doc.data().stock,
                            'price':doc.data().price
                        });
            });
            return {'result': products,'http_res':201}
        } catch (error) {
            return {'result': {error: 'Error de lectura en db'},'http_res':404};
        }
    }

    async newProd(objetoProd) {
        try {
            const res = await this.coleccion.add(objetoProd);
            return {'result': {'id': res.id}, 'http_res':201}
        } catch (error) {
            return {'result': {error: 'Error de escritura en db'},'http_res':404}
        }
    }

    async delProd(id) {
        try {
            const doc = await this.coleccion.doc(id).get();
            if (doc.exists) {
                const res = await this.coleccion.doc(id).delete();
                return await this.listarAll()
            } else {
                return {'result': {error: 'producto no encontrado'},'http_res':404}
            }
        } catch (error) {
            console.log(error)
            return {'result':  {error: 'No se borro el producto, error de db'},'http_res':404}
        }
    }

    async updateProd(id,data) {
        let dataToUpdate = {}
        try {
            const doc = await this.coleccion.doc(id).get();
            if (doc.exists) {
                dataToUpdate.timestamp = Date.now()
                data.code == null || data.code == undefined ? dataToUpdate.code = doc.data().code : dataToUpdate.code = data.code
                data.title == null || data.title == undefined? dataToUpdate.title = doc.data().title : dataToUpdate.title = data.title
                data.price == null || data.price == undefined? dataToUpdate.price = doc.data().price : dataToUpdate.price = data.price
                data.thumbnail == null || data.thumbnail == undefined? dataToUpdate.thumbnail = doc.data().thumbnail : dataToUpdate.thumbnail = data.thumbnail
                data.stock == null || data.stock == undefined ? dataToUpdate.stock = doc.data().stock : dataToUpdate.stock = data.stock
                try {
                    const doc = await this.coleccion.doc(id).update(dataToUpdate)
                    return await this.listar(id)
                } catch (error) {
                    console.log(error);
                    return {'result':  {error: 'No se actualizo el producto, error de db'},'http_res':404}
                }
            } else {
                return {'result': {error: 'producto no encontrado'},'http_res':404}
            }
        } catch(error){
            return {'result':  {error: 'No se actualizo el producto, error de db'},'http_res':404}
        }
    }

    async newCart(objetoCart) {
        try {
            const res = await this.coleccion.add(objetoCart);
            return {'result': {'id': res.id}, 'http_res':201}
        } catch (error) {
            return {'result': {error: 'Error de escritura en db'},'http_res':404}
        }
    }

    async addProdCart(id,objetoCart) {
        try {
            const doc = await this.coleccion.doc(id).get();
            console.log(doc)
            if (doc.exists) {
                const data = doc.data();
                data.products.push(objetoCart)
                try {
                    const res = await this.coleccion.doc(id).set({products:data.products})
                    return {'result': {'id': res.id}, 'http_res':201}
                } catch (error) {
                    return {'result': {error: 'Error de escritura en db.'},'http_res':404}
                }
            } else {
                return {'result': {error: 'producto no encontrado'},'http_res':404}
            }
        } catch (error) {
            console.log(error)
        } 
    }

    async delProdCart(id,id_prod) {
        try {
            const doc = await this.coleccion.doc(id).get();
            if (doc.exists) {
                const data = doc.data();
                
                const filtered = data.products.filter(c => c.id_prod !== id_prod)

                console.log('despues',filtered)
                try {
                    const res = await this.coleccion.doc(id).set({products:filtered})
                    return {'result': {'id': res.id}, 'http_res':201}
                } catch (error) {
                    return {'result': {error: 'Error de escritura en db.'},'http_res':404}
                }
            } else {
                return {'result': {error: 'producto no encontrado'},'http_res':404}
            }
        } catch (error) {
            console.log(error)
        } 
    }
}

export default ContenedorFirebase;
