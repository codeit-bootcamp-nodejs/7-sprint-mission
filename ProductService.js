import { Product } from "./Product.js";

export class ProductService {
  constructor() {
    this.products = [];
  }

  addProduct(product) {
    if (product instanceof Product) {
      this.products.push(product);
    }
  }

  getProducts() {
    return this.products;
  }
}
