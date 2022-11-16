import ContenedorMongodb from "../classes/containerMongodb.js";

class ProductoDaoMongodb extends ContenedorMongodb {
  constructor() {
    super("producto", {
      timestamp: { type: String, required: true },
      code: { type: String, required: true },
      title: { type: String, required: true },
      thumbnail: { type: String, required: true },
      stock: { type: Number, required: true },
      price: { type: Number, required: true },
      category: { type: String, required: true},
    });
  }
}

export default ProductoDaoMongodb;