import { Injectable, signal, computed } from '@angular/core';
import { Product } from '../models/product.model';

@Injectable({
    providedIn: 'root'
})
export class CompareService {
    private compareList = signal<Product[]>([]);

    items = computed(() => this.compareList());

    addToCompare(product: Product) {
        if (this.compareList().length >= 5) {
            alert("Compare limit reached (Max 5 items). Remove one to add another.");
            return;
        }

        // Prevent duplicates
        if (this.compareList().find(p => p.id === product.id)) {
            return;
        }

        this.compareList.update(list => [...list, product]);
    }

    removeFromCompare(productId: string) {
        this.compareList.update(list => list.filter(p => p.id !== productId));
    }

    isInCompare(productId: string): boolean {
        return !!this.compareList().find(p => p.id === productId);
    }

    clearCompare() {
        this.compareList.set([]);
    }
}
