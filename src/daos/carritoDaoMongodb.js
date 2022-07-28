import ContenedorMongodb from "../containers/containerMongodb.js";

class CarritoDaoMongodb extends ContenedorMongodb {
  constructor() {
    super("carrito", {
          timestamp_cart: { type: String, required: true },
          products:[{
            timestamp_prod: { type: String, required: true },
            id_prod: { type: String, required: true },
            stock: { type: Number, required: true },
            cant: { type: Number, required: true },
          }]});
  }
}

export default CarritoDaoMongodb;