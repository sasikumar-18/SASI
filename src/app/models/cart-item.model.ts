import { Product } from './product.model';

export interface CartItem {
    id: string; // Cart item unique id
    product: Product;
    quantity: number;
}
