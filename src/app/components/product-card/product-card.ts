import { Component, Input, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { Product } from '../../models/product.model';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { CompareService } from '../../services/compare.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCard {
  @Input({ required: true }) product!: Product;

  cartService = inject(CartService);
  wishlistService = inject(WishlistService);
  compareService = inject(CompareService);

  addToCart(event: Event) {
    event.stopPropagation();
    this.cartService.addToCart(this.product);
  }

  toggleWishlist(event: Event) {
    event.stopPropagation();
    this.wishlistService.toggleWishlist(this.product);
  }

  toggleCompare(event: Event) {
    event.stopPropagation();
    if (this.compareService.isInCompare(this.product.id)) {
      this.compareService.removeFromCompare(this.product.id);
    } else {
      this.compareService.addToCompare(this.product);
    }
  }

  handleImageError(event: any) {
    const fallback = 'https://images.unsplash.com/photo-1598327105666-5b89351aff23?auto=format&fit=crop&q=80&w=800';
    if (event.target.src !== fallback) {
      event.target.src = fallback;
    }
  }
}
