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
  private authService = inject(AuthService);
  private router = inject(Router);
  addressService = inject(AddressService);
  nexusCardService = inject(NexusCardService);
  exchangeService = inject(ExchangeService);
  productService = inject(ProductService);

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
  emiPlan = 12;
  paymentMethod: 'COD' | 'Card' | 'UPI' | 'NexusEMI' = 'COD';
  loading = false;
  success = false;
  orderId: string | null = null;

  isPaymentValid(): boolean {
    if (this.paymentMethod === 'COD') return true;
    if (this.paymentMethod === 'UPI') return this.upiId.trim().includes('@');
    if (this.paymentMethod === 'Card') {
      const cleanCard = this.cardNumber.replace(/\s+/g, '');
      return cleanCard.length >= 16 && this.expiryDate.length === 5 && this.cvv.length >= 3;
    }
    if (this.paymentMethod === 'NexusEMI') return true; // Card details are handled via nexus
    return false;
  }

  isAddressValid(): boolean {
    if (this.deliveryOption === 'standard' || this.deliveryOption === 'fast') {
      if (!this.deliveryDate || !this.deliveryTimeSlot) return false;
    }
    return !!(this.address.fullName && this.address.street && this.address.city && this.address.state && this.address.phone);
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
        totalAmount: this.finalTotal,
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
