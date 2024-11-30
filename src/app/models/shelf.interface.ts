import { Product } from "./product.interface";

export interface Shelf {
  id: string; // R1, R2 gibi unique ID
  type: string; // Gıda, Temizlik gibi
  products: Product[];
}
