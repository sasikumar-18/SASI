import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { firstValueFrom } from 'rxjs';
import { AddressService, Address } from '../../services/address.service';
import { NexusCardService } from '../../services/nexus-card.service';
import { ExchangeService } from '../../services/exchange.service';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from '../../services/notification.service';
import { HttpClient } from '@angular/common/http';

declare var Razorpay: any;

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LucideAngularModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout {
  cartService = inject(CartService);
  private orderService = inject(OrderService);
  public authService = inject(AuthService);
  private router = inject(Router);
  addressService = inject(AddressService);
  nexusCardService = inject(NexusCardService);
  exchangeService = inject(ExchangeService);
  productService = inject(ProductService);
  private route = inject(ActivatedRoute);
  private notificationService = inject(NotificationService);
  private http = inject(HttpClient);
  
  encodeURIComponent = encodeURIComponent;

  address: any = {
    fullName: '',
    email: '',
    street: '',
    city: '',
    state: 'NY',
    zip: '',
    phone: ''
  };

  selectedAddressId: string | null = null;
  couponCode = '';

  deliveryOption: 'standard' | 'fast' | 'sameday' = 'standard';
  deliveryDate = '';
  deliveryTimeSlot = '';

  get deliveryFee() {
    switch (this.deliveryOption) {
      case 'standard': return 0;
      case 'fast': return 200;
      case 'sameday': return 500;
      default: return 0;
    }
  }

  get finalTotal() {
    return this.cartService.totalPrice() + this.deliveryFee;
  }

  get minDate() {
    return new Date().toISOString().split('T')[0];
  }

  constructor() {
    // Auto-select default
    const def = this.addressService.addresses().find(a => a.isDefault);
    if (def) {
      this.selectAddress(def);
      
      // If direct buy now from product page, try to skip to payment
      this.route.queryParams.subscribe(params => {
        if (params['direct'] === 'true' && this.isAddressValid()) {
          this.checkoutStep = 2;
        }
      });
    }
  }

  selectAddress(addr: Address) {
    this.selectedAddressId = addr.id;
    this.address = { ...addr };
  }

  isAddressFormMode = false;
  editingAddressId: string | null = null;

  toggleAddressForm(addressToEdit?: Address) {
    if (addressToEdit) {
      this.isAddressFormMode = true;
      this.editingAddressId = addressToEdit.id;
      this.address = { ...addressToEdit };
    } else {
      this.isAddressFormMode = !this.isAddressFormMode;
      this.editingAddressId = null;
      if (this.isAddressFormMode) {
        this.selectedAddressId = null;
        this.address = { fullName: '', email: '', street: '', city: '', state: 'NY', zip: '', phone: '' };
      }
    }
  }

  saveAddress() {
    if (this.editingAddressId) {
      this.addressService.updateAddress(this.editingAddressId, { ...this.address });
    } else {
      this.addressService.addAddress({
        ...this.address,
        label: this.address.label || 'New Location',
        isDefault: false
      });
    }
    
    this.isAddressFormMode = false;
    this.editingAddressId = null;
    
    const all = this.addressService.addresses();
    this.selectAddress(all[all.length - 1]);
  }

  deleteAddress(event: Event, id: string) {
    event.stopPropagation();
    if (confirm('Delete this coordinate profile?')) {
      this.addressService.deleteAddress(id);
      if (this.selectedAddressId === id) {
        this.selectedAddressId = null;
      }
    }
  }

  makeDefaultAddress(event: Event, id: string) {
    event.stopPropagation();
    this.addressService.updateAddress(id, { isDefault: true });
  }

  private _cardNumber = '';
  get cardNumber() { return this._cardNumber; }
  set cardNumber(val: string) {
    this._cardNumber = val.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
  }

  private _expiryDate = '';
  get expiryDate() { return this._expiryDate; }
  set expiryDate(val: string) {
    let clean = val.replace(/\D/g, '');
    if (clean.length > 2) {
      this._expiryDate = clean.substring(0, 2) + '/' + clean.substring(2, 4);
    } else {
      this._expiryDate = clean;
    }
  }

  cvv = '';

  upiId = '';
  upiApp: 'phonepe' | 'gpay' | 'paytm' | 'other' = 'other';
  showQR = false;
  emiPlan = 12;
  paymentMethod: 'COD' | 'Card' | 'UPI' | 'NexusEMI' | 'Wallet' = 'COD';
  
  useSuperCoins = false;
  get superCoinsValue() {
      const user = this.authService.userProfile();
      if (!user || (user.superCoins || 0) <= 0) return 0;
      // 1 SuperCoin = 1 INR discount
      return Math.min(user.superCoins, this.cartService.subTotal() * 0.05); // Cap at 5% of order
  }

  checkoutStep: 1 | 2 = 1;
  loading = false;
  success = false;
  orderId: string | null = null;

  proceedToPayment() {
    if (this.isAddressValid()) {
      this.checkoutStep = 2;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      alert('Transmission Error: Delivery coordinates incomplete.');
    }
  }

  setUPIApp(app: 'phonepe' | 'gpay' | 'paytm' | 'other'| any) {
    this.upiApp = app;
    this.showQR = (app === 'other');
    
    // Notify User about selection
    const appName = app === 'other' ? 'Universal QR' : app.toUpperCase();
    this.notificationService.show('Synchronizing...', `${appName} selected as primary acquisition hook.`, 'info');

    // Automatic Trigger Protocol: If an app is chosen (not QR), execute payment immediately
    if (app !== 'other' && app !== 'none') {
        setTimeout(() => {
            this.payWithRazorpay();
        }, 500);
    }
  }

  get upiQRCodeData() {
    const upiID = 'nexus@apl';
    const name = 'Nexus Checkout Terminal';
    const amount = this.finalTotalWithCoins;
    const txRef = `NXQR-${Date.now()}`;
    return `upi://pay?pa=${upiID}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR&tr=${txRef}`;
  }

  isPaymentValid(): boolean {
    if (this.paymentMethod === 'COD') return true;
    if (this.paymentMethod === 'UPI') {
        // Valid if either an app is selected (which triggers auto-pay) or a manual ID is entered
        return this.upiId.length > 3 || this.upiApp !== 'other';
    }
    if (this.paymentMethod === 'Card') return true; // Handled by Razorpay Modal
    if (this.paymentMethod === 'NexusEMI') return this.nexusCardService.isApproved();
    if (this.paymentMethod === 'Wallet') {
        const user = this.authService.userProfile();
        return !!(user && (user.walletBalance || 0) >= this.finalTotalWithCoins);
    }
    return false;
  }

  get finalTotalWithCoins() {
    let total = this.finalTotal;
    if (this.useSuperCoins) {
        total -= this.superCoinsValue;
    }
    return Math.max(0, total);
  }

  isAddressValid(): boolean {
    // Basic verification of selected address or form completion
    const addr = this.address;
    return !!(addr.fullName && addr.street && addr.city && addr.state && addr.zip && addr.phone);
  }

  async onPlaceOrder() {
    if (this.cartService.items().length === 0) return;
    if (!this.isAddressValid()) {
      alert('Transmission Error: Delivery coordinates incomplete.');
      return;
    }
    if (!this.isPaymentValid()) {
      alert('Transmission Error: Payment authentication failed. Please verify credentials.');
      return;
    }

    if (this.paymentMethod === 'Card' || this.paymentMethod === 'UPI') {
        this.payWithRazorpay();
        return;
    }
    this.finalizeOrder();
  }

  async payWithRazorpay() {
    this.loading = true;
    const amount = this.finalTotalWithCoins;
    
    try {
        // 1. Create Order on Backend
        const orderRes: any = await firstValueFrom(this.http.post('http://localhost:5000/api/payments/create-order', {
            amount,
            receipt: `nx_ord_${Date.now()}`
        }));

        if (!orderRes.id) throw new Error('Invalid Order Response from Nexus');

        const options = {
            key: "rzp_test_Sbi2SkrSwF5mXc", 
            amount: orderRes.amount,
            currency: "INR",
            name: "Nexus Global Terminal",
            description: "Electronic Hardware Acquisition",
            image: "https://cdn-icons-png.flaticon.com/512/1063/1063259.png",
            order_id: orderRes.id,
            handler: async (response: any) => {
                // 3. Verify Payment on Backend
                const verifyRes: any = await firstValueFrom(this.http.post('http://localhost:5000/api/payments/verify', response));
                if (verifyRes.success) {
                    this.finalizeOrder();
                } else {
                    this.notificationService.show('Security Breach', 'Signature verification failed.', 'alert');
                }
            },
            prefill: {
                name: this.address.fullName,
                email: this.authService.userProfile()?.email,
                contact: this.address.phone,
                method: this.paymentMethod === 'UPI' ? 'upi' : (this.paymentMethod === 'Card' ? 'card' : undefined),
                vpa: (this.paymentMethod === 'UPI' && this.upiId && this.upiId.includes('@')) ? this.upiId : undefined
            },
            config: {
                display: {
                    blocks: {
                        upi: {
                            name: "Pay via " + (this.upiApp === 'other' ? 'UPI' : this.upiApp.toUpperCase()),
                            instruments: [
                                {
                                    method: 'upi',
                                    apps: this.upiApp === 'other' ? ['google_pay', 'phonepe', 'paytm'] : [this.upiApp === 'gpay' ? 'google_pay' : this.upiApp]
                                }
                            ]
                        }
                    },
                    sequence: ['block.upi'],
                    preferences: { show_default_blocks: true }
                }
            },
            modal: {
                ondismiss: () => {
                   this.notificationService.show('Terminal Closed', 'Acquisition protocol aborted by user.', 'info');
                }
            },
            theme: { color: "#dc2626" }
        };

        // Development Bypass: If order ID is a simulator, skip modal and finalize
        if (orderRes.id.includes('sim_')) {
            console.warn('🚀 Nexus Platform: Bypassing Gateway Modal (Simulator Active)');
            this.notificationService.show('Nexus Simulator', 'Gateway bypassed. Finalizing digital record...', 'success');
            setTimeout(() => this.finalizeOrder(), 1500);
            return;
        }

        const rzp = new Razorpay(options);
        rzp.open();
    } catch (e: any) {
        console.error('Razorpay Protocol Error:', e);
        // Fallback for Development: Allow finalize even if gateway fails (Nexus Safety Net)
        if (confirm('Gateway Initialization Failed. Would you like to use the Nexus Safety Net to finalize the order for demo purposes?')) {
            this.finalizeOrder();
        } else {
            this.notificationService.show('Gateway Error', e.message || 'Failed to initialize Razorpay terminal.', 'alert');
        }
    } finally {
        this.loading = false;
    }
  }

  async finalizeOrder() {
    this.loading = true;
    try {
      const user = await firstValueFrom(this.authService.user$);

      const orderPayload = {
        userId: user?.uid || 'anonymous-nexus',
        items: this.cartService.items().map(item => ({
          productId: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          imageUrl: item.product.imageUrl
        })),
        totalAmount: this.finalTotalWithCoins,
        superCoinsUsed: this.useSuperCoins ? this.superCoinsValue : 0,
        shippingAddress: {
          name: this.address.fullName,
          address: this.address.street,
          city: this.address.city,
          state: this.address.state,
          zip: this.address.zip,
          phone: this.address.phone
        },
        paymentMethod: this.paymentMethod,
        couponCode: this.cartService.appliedCoupon()?.code,
        deliveryOption: this.deliveryOption,
        deliveryFee: this.deliveryFee,
        deliveryDate: this.deliveryDate,
        deliveryTimeSlot: this.deliveryTimeSlot
      };

      const response = await firstValueFrom(this.orderService.placeOrder(orderPayload));
      this.orderId = response.orderId;

      // Update Financials
      if (this.useSuperCoins) {
          this.authService.updateSuperCoins(-this.superCoinsValue);
      }
      if (this.paymentMethod === 'Wallet') {
          this.authService.updateWallet(-this.finalTotalWithCoins);
      }

      const applied = this.cartService.appliedCoupon();
      if (applied) {
        this.authService.addUsedCoupon(applied.code);
      }

      // Deduct stock for all ordered items
      this.cartService.items().forEach(item => {
        this.productService.updateStock(item.product.id, item.quantity);
      });

      this.success = true;
      this.cartService.clearCart();
      this.exchangeService.reset();

      setTimeout(() => {
        this.router.navigate(['/']);
      }, 5000);
    } catch (e: any) {
      console.error(e);
      alert('Order failed: ' + e.message);
    } finally {
      this.loading = false;
    }
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

  autoApplyBest() {
    this.cartService.autoApplyBestCoupon();
  }
}
