import { Injectable, computed, signal } from '@angular/core';
import { Product } from '../models/product.model';
import { CartItem } from '../models/cart-item.model';
import { ExchangeService } from './exchange.service';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';

export interface Coupon {
    code: string;
    type: 'percent' | 'flat';
    value: number;
    minOrder: number;
    description: string;
}

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private cartItems = signal<CartItem[]>(this.loadCart());
    private exchangeService = inject(ExchangeService);
    private authService = inject(AuthService);

    // Coupon System
    appliedCoupon = signal<Coupon | null>(null);
    couponError = signal<string>('');

    public availableCoupons: Coupon[] = [
        { code: 'WELCOME10', type: 'percent', value: 0.10, minOrder: 0, description: '10% Off First Order' },
        { code: 'NEXUS20', type: 'percent', value: 0.20, minOrder: 50000, description: '20% Off for High-End Assets' },
        { code: 'MOBILE500', type: 'flat', value: 500, minOrder: 10000, description: '₹500 Off on Mobiles > 10k' },
        { code: 'MEGA25', type: 'percent', value: 0.25, minOrder: 100000, description: '25% Off Premium Hauls' },
        { code: 'SHIPFREE', type: 'flat', value: 0, minOrder: 0, description: 'Complimentary Shipping' } // Just a placeholder for shipping
    ];

    items = computed(() => this.cartItems());

    totalItems = computed(() =>
        this.cartItems().reduce((acc, item) => acc + item.quantity, 0)
    );

    subTotal = computed(() =>
        this.cartItems().reduce((acc, item) => acc + (item.product.price * item.quantity), 0)
    );

    tax = computed(() => this.subTotal() * 0.05); // 5% Tax

    discount = computed(() => {
        let totalDiscount = 0;
        const sub = this.subTotal();

        // 1. Automatic Offer: 5% discount for orders over 50k
        if (sub > 50000) {
            totalDiscount += sub * 0.05;
        }

        // 2. Applied Coupon
        const coupon = this.appliedCoupon();
        if (coupon) {
            if (coupon.type === 'percent') {
                totalDiscount += sub * coupon.value;
            } else {
                totalDiscount += coupon.value;
            }
        }

        // 3. Trade-in Exchange Offer
        if (this.exchangeService.isExchangeActive()) {
            totalDiscount += this.exchangeService.selectedDevice()?.baseValue || 0;
        }

        return totalDiscount;
    });

    totalPrice = computed(() =>
        Math.max(0, this.subTotal() + this.tax() - this.discount())
    );

    constructor() {
        // Sync to local storage
        this.saveToStorage();
    }

    private loadCart(): CartItem[] {
        if (typeof localStorage === 'undefined') return [];
        const saved = localStorage.getItem('cart');
        return saved ? JSON.parse(saved) : [];
    }

    private saveToStorage() {
        if (typeof localStorage === 'undefined') return;
        localStorage.setItem('cart', JSON.stringify(this.cartItems()));
    }

    addToCart(product: Product) {
        if (product.stock <= 0) {
            // Out of stock
            return;
        }

        const currentItems = this.cartItems();
        const existing = currentItems.find(item => item.product.id === product.id);

        if (existing) {
            if (existing.quantity >= product.stock) {
                // Prevent exceeding stock limit
                return;
            }
            this.cartItems.update(items =>
                items.map(item =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            );
        } else {
            this.cartItems.update(items => [
                ...items,
                { id: Math.random().toString(36).substr(2, 9), product, quantity: 1 }
            ]);
        }
        this.saveToStorage();
    }

    updateQuantity(productId: string, quantity: number) {
        if (quantity <= 0) {
            this.removeFromCart(productId);
            return;
        }

        this.cartItems.update(items =>
            items.map(item => {
                if (item.product.id === productId) {
                    const finalQty = Math.min(quantity, item.product.stock);
                    return { ...item, quantity: finalQty };
                }
                return item;
            })
        );
        this.saveToStorage();
    }

    removeFromCart(productId: string) {
        this.cartItems.update(items =>
            items.filter(item => item.product.id !== productId)
        );
        this.saveToStorage();
    }

    clearCart() {
        this.cartItems.set([]);
        this.saveToStorage();
    }

    applyCoupon(code: string) {
        this.couponError.set('');
        const trimmedCode = code.trim().toUpperCase();
        const coupon = this.availableCoupons.find(c => c.code === trimmedCode);

        if (!coupon) {
            this.couponError.set('Invalid coupon code');
            return;
        }

        // Check if user has already used this coupon
        const user = this.authService.userProfile();
        if (user && user.usedCoupons && user.usedCoupons.includes(trimmedCode)) {
            this.couponError.set('This coupon has already been used by your account');
            return;
        }

        if (this.subTotal() < coupon.minOrder) {
            this.couponError.set(`Minimum order of ₹${coupon.minOrder} required`);
            return;
        }

        this.appliedCoupon.set(coupon);
    }

    removeCoupon() {
        this.appliedCoupon.set(null);
        this.couponError.set('');
    }

    autoApplyBestCoupon() {
        const sub = this.subTotal();
        let bestCoupon = null;
        let maxDiscount = 0;

        for (const coupon of this.availableCoupons) {
            if (sub < coupon.minOrder) continue;
            if (this.isCouponUsed(coupon.code)) continue;

            let discountAmount = 0;
            if (coupon.type === 'percent') {
                discountAmount = sub * coupon.value;
            } else {
                discountAmount = coupon.value;
            }

            if (discountAmount > maxDiscount && discountAmount > 0) {
                maxDiscount = discountAmount;
                bestCoupon = coupon;
            }
        }

        if (bestCoupon) {
            this.appliedCoupon.set(bestCoupon);
            this.couponError.set('');
            return true;
        } else {
            this.couponError.set('No eligible coupons found for this order value.');
            return false;
        }
    }

    isCouponUsed(code: string): boolean {
        const user = this.authService.userProfile();
        return !!(user && user.usedCoupons && user.usedCoupons.includes(code.toUpperCase()));
    }
}
