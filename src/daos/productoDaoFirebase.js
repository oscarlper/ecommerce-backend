import ContenedorFirebase from "../containers/containerFirebase.js";

class ProductoDaoFirebase extends ContenedorFirebase {
  constructor() {
    super("productos");
  }
}

export default ProductoDaoFirebase;