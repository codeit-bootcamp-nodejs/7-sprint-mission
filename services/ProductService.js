import { Product } from "../models/Product.js";


export class ProductService {
  constructor() {
    this.products = [];
  }

  createProduct(name, description, price, tags = [], images = []) {
    const product = new Product(name, description, price, tags, images);
    this.products.push(product);
    return product;
  }

  getProducts() {
    return this.products;
  }

  favoriteProduct(index) {
    const product = this.products[index] ?? null;
    if (!product) return null;
    product.favorite();
    return product;
  }
}
