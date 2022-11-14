import dotenv from "dotenv";
dotenv.config();

let ProductoDao;
let CarritoDao;

switch (process.env.DATABASE) {
    case "mongodb":
        const { default: ProductoDaoMongodb } = await import(
        "./productoDaoMongodb.js"
        );
        const { default: CarritoDaoMongo } = await import(
        "./carritoDaoMongodb.js"
        );

        ProductoDao = new ProductoDaoMongodb;
        CarritoDao = CarritoDaoMongo;

        break;
}

export default { ProductoDao , CarritoDao };
