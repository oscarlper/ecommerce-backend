import ContenedorFirebase from "../classes/containerFirebase.js";

class ProductoDaoFirebase extends ContenedorFirebase {
  constructor() {
    super("productos");
  }
}

export default ProductoDaoFirebase;