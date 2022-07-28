import dotenv from "dotenv";
dotenv.config();

let ProductoDao;
let CarritoDao;

switch (process.env.DATABASE) {
    case "firebase":
        const { default: ProductoDaoFirebase } = await import(
        "./productoDaoFirebase.js"
        );
        const { default: CarritoDaoFirebase } = await import(
        "./carritoDaoFirebase.js"
        );
        
        ProductoDao = ProductoDaoFirebase;
        CarritoDao = CarritoDaoFirebase;

        //ProductoDao.listar('prGiXedHkC41MHX8UwKS')

        break;
    case "mongodb":
        const { default: ProductoDaoMongodb } = await import(
        "./productoDaoMongodb.js"
        );
        const { default: CarritoDaoMongo } = await import(
        "./carritoDaoMongodb.js"
        );

        ProductoDao = ProductoDaoMongodb;
        CarritoDao = CarritoDaoMongo;

        break;
}

export default { ProductoDao , CarritoDao };
