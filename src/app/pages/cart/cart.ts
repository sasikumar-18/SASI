import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { ExchangeService } from '../../services/exchange.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, FormsModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  cartService = inject(CartService);
  exchangeService = inject(ExchangeService);

  couponCode = '';

  increaseQuantity(productId: string, current: number) {
    this.cartService.updateQuantity(productId, current + 1);
  }

  decreaseQuantity(productId: string, current: number) {
    this.cartService.updateQuantity(productId, current - 1);
  }

  removeItem(productId: string) {
    this.cartService.removeFromCart(productId);
  }

  applyCoupon() {
    if (this.couponCode.trim()) {
      this.cartService.applyCoupon(this.couponCode);
    }
  }

  removeCoupon() {
    this.cartService.removeCoupon();
    this.couponCode = '';
  }
}
