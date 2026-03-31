import { Injectable, computed, signal, inject } from '@angular/core';
import { Product } from '../models/product.model';
import { CartService } from './cart.service';

@Injectable({
    providedIn: 'root'
})
export class WishlistService {
    private wishlistItems = signal<Product[]>(this.loadWishlist());
    private cartService = inject(CartService);

    items = computed(() => this.wishlistItems());

    totalItems = computed(() => this.wishlistItems().length);

    constructor() {
        // Sync to local storage
    }

    private loadWishlist(): Product[] {
        if (typeof localStorage === 'undefined') return [];
        const saved = localStorage.getItem('wishlist');
        return saved ? JSON.parse(saved) : [];
    }

    private saveToStorage() {
        if (typeof localStorage === 'undefined') return;
        localStorage.setItem('wishlist', JSON.stringify(this.wishlistItems()));
    }

    toggleWishlist(product: Product) {
        const currentItems = this.wishlistItems();
        const exists = currentItems.some(item => item.id === product.id);

        if (exists) {
            this.removeFromWishlist(product.id);
        } else {
            this.wishlistItems.update(items => [...items, product]);
        }
        this.saveToStorage();
    }

    addToWishlist(product: Product) {
        const currentItems = this.wishlistItems();
        if (!currentItems.find(p => p.id === product.id)) {
            this.wishlistItems.update(items => [...items, product]);
            this.saveToStorage();
        }
    }

    removeFromWishlist(productId: string) {
        this.wishlistItems.update(items =>
            items.filter(item => item.id !== productId)
        );
        this.saveToStorage();
    }

    isInWishlist(productId: string): boolean {
        return this.wishlistItems().some(p => p.id === productId);
    }

    moveToCart(product: Product) {
        this.cartService.addToCart(product);
        this.removeFromWishlist(product.id);
    }
}
