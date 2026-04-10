import { Injectable, computed, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product.model';
import { CartItem } from '../models/cart-item.model';
import { ExchangeService } from './exchange.service';
import { AuthService, UserProfile } from './auth.service';
import { NotificationService } from './notification.service';

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
    private cartItems = signal<CartItem[]>(this.loadCart().items);
    private exchangeService = inject(ExchangeService);
    private authService = inject(AuthService);
    private notificationService = inject(NotificationService);

    // Coupon System
    appliedCoupon = signal<Coupon | null>(this.loadCart().coupon);
    couponError = signal<string>('');
    private cartApiUrl = 'http://localhost:5000/api/cart';
    private http = inject(HttpClient);

    public availableCoupons: Coupon[] = [
        { code: 'WELCOME10', type: 'percent', value: 0.10, minOrder: 0, description: '10% Off First Order' },
        { code: 'NEXUS20', type: 'percent', value: 0.20, minOrder: 50000, description: '20% Off for High-End Assets' },
        { code: 'MOBILE500', type: 'flat', value: 500, minOrder: 10000, description: '₹500 Off on Mobiles > 10k' },
        { code: 'MEGA25', type: 'percent', value: 0.25, minOrder: 100000, description: '25% Off Premium Hauls' },
        { code: 'SHIPFREE', type: 'flat', value: 0, minOrder: 0, description: 'Complimentary Shipping' } // Just a placeholder for shipping
    ];

    items = computed(() => this.cartItems());

    totalItems = computed(() =>
        this.cartItems().reduce((acc, item) => acc + (Number(item.quantity) || 0), 0)
    );

    subTotal = computed(() =>
        this.cartItems().reduce((acc, item) => {
            const price = Number(item.product?.price) || 0;
            const qty = Number(item.quantity) || 0;
            return acc + (price * qty);
        }, 0)
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
        
        // Listen for Auth changes to sync cloud cart
        this.authService.user$.subscribe(user => {
            if (user) this.fetchCloudCart(user.uid);
        });
    }

    private fetchCloudCart(userId: string) {
        this.http.get<CartItem[]>(`${this.cartApiUrl}/${userId}`).subscribe((cloudItems: CartItem[]) => {
            if (cloudItems && cloudItems.length > 0) {
                const currentLocalItems = this.cartItems();
                
                // Merge logic: Cloud items win, but local-only items are preserved
                const merged = [...cloudItems];
                currentLocalItems.forEach(local => {
                    if (!merged.find(c => c.product.id === local.product.id)) {
                        merged.push(local);
                    }
                });

                this.cartItems.set(merged);
                this.saveToStorage();
            }
        });
    }

    private syncToCloud() {
        const user = this.authService.userProfile() as UserProfile | null;
        if (user) {
            this.http.post(`${this.cartApiUrl}/${user.uid}/sync`, { 
                items: this.cartItems() 
            }).subscribe({
                error: (err: any) => console.error('Cloud Sync Suspended:', err)
            });
        }
    }

    private loadCart(): { items: CartItem[], coupon: Coupon | null } {
        if (typeof localStorage === 'undefined') return { items: [], coupon: null };
        try {
            const savedItems = localStorage.getItem('cart');
            const savedCoupon = localStorage.getItem('applied_coupon');
            
            let items: CartItem[] = savedItems ? JSON.parse(savedItems) : [];
            
            // --- DATA SANITIZER ---
            // Fix any corrupted items from previous sessions
            items = items.filter(item => item && item.product).map(item => ({
                ...item,
                quantity: Number(item.quantity) || 1,
                product: {
                    ...item.product,
                    price: Number(item.product.price) || 0,
                    stock: Number(item.product.stock) || 100
                }
            }));

            return {
                items,
                coupon: savedCoupon ? JSON.parse(savedCoupon) : null
            };
        } catch (e) {
            console.error('Cart restoration failed. Data reset.', e);
            localStorage.removeItem('cart');
            return { items: [], coupon: null };
        }
    }

    private saveToStorage() {
        if (typeof localStorage === 'undefined') return;
        localStorage.setItem('cart', JSON.stringify(this.cartItems()));
        this.syncToCloud(); // Attempt Cloud Sync
        if (this.appliedCoupon()) {
            localStorage.setItem('applied_coupon', JSON.stringify(this.appliedCoupon()));
        } else {
            localStorage.removeItem('applied_coupon');
        }
    }

    addToCart(product: Product, quantity: number = 1) {
        if (product.stock <= 0) {
            this.notificationService.show('Stock Depleted', `${product.name} is currently offline.`, 'alert');
            return;
        }

        const currentItems = this.cartItems();
        const existing = currentItems.find(item => item.product.id === product.id);

        if (existing) {
            const newQty = existing.quantity + quantity;
            this.updateQuantity(product.id, newQty);
        } else {
            const productStock = product.stock ?? 100; // Nuclear Fallback
            const finalQty = Math.min(quantity, productStock);
            this.cartItems.update(items => [
                ...items,
                { id: Math.random().toString(36).substr(2, 9), product, quantity: finalQty }
            ]);
        }
        
        this.notificationService.show('Product Synchronized', `${product.name} locked into manifest.`, 'success');
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
                    const productStock = item.product.stock ?? 100; // Nuclear Fallback
                    const finalQty = Math.min(quantity, productStock);
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
        this.saveToStorage();
    }

    removeCoupon() {
        this.appliedCoupon.set(null);
        this.couponError.set('');
        this.saveToStorage();
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
