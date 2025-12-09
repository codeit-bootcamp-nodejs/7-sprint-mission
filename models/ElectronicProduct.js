import { Product } from "./Product.js";

export class ElectronicProduct extends Product {
  constructor(name, description, price, tags = [], images = [], manufacturer) {
    super(name, description, price, tags, images);

    this._manufacturer = manufacturer;
  }

  get manufacturer() {
    return this._manufacturer;
  }
}
