import { Component, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Product, Review } from '../../models/product.model';
import { Observable, switchMap, tap } from 'rxjs';

import { NexusCardService } from '../../services/nexus-card.service';
import { ExchangeService, ExchangeDevice } from '../../services/exchange.service';
import { CompareService } from '../../services/compare.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, FormsModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetail {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  nexusCardService = inject(NexusCardService);
  exchangeService = inject(ExchangeService);
  compareService = inject(CompareService);
  private cdr = inject(ChangeDetectorRef);

  product$: Observable<Product | undefined> = this.route.params.pipe(
    switchMap(params => {
      this.activeImage = null; // Reset on nav
      return this.productService.getProductById(params['id']);
    }),
    tap(product => {
      if (product) {
        this.productService.addToRecentlyViewed(product);
      }
    })
  );

  activeImage: string | null = null;
  activeTab: 'features' | 'specs' | 'delivery' = 'features';

  // Review Form State
  showReviewForm = false;
  reviewRating = 0;
  reviewComment = '';
  isSubmitting = false;
  reviewImages: string[] = [];

  onImageUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (this.reviewImages.length < 3) {
          this.reviewImages.push(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  }

  removeReviewImage(index: number) {
    this.reviewImages.splice(index, 1);
  }

  getStarPercentage(product: Product, star: number): number {
    if (!product.reviews || product.reviews.length === 0) return 0;
    const count = product.reviews.filter(r => Math.round(r.rating) === star).length;
    return Math.round((count / product.reviews.length) * 100);
  }

  getMostHelpfulReview(product: Product): Review | null {
    if (!product.reviews || product.reviews.length === 0) return null;
    const sorted = [...product.reviews].sort((a, b) => (b.helpfulCount || 0) - (a.helpfulCount || 0));
    return (sorted[0].helpfulCount && sorted[0].helpfulCount > 0) ? sorted[0] : null;
  }

  markHelpful(review: Review) {
    if (!review.helpfulCount) review.helpfulCount = 0;
    review.helpfulCount++;
    this.cdr.markForCheck();
  }

  // Exchange State
  showExchangePortal = false;
  selectedBrand = '';
  selectedModel = '';
  selectedCondition: 'perfect' | 'good' | 'average' = 'good';
  calculatedValue = 0;

  get availableBrands() {
    return [...new Set(this.exchangeService.popularDevices.map(d => d.brand))];
  }

  get filteredModels() {
    return this.exchangeService.popularDevices.filter(d => d.brand === this.selectedBrand);
  }

  updateValuation() {
    const model = this.exchangeService.popularDevices.find(d => d.id === this.selectedModel);
    if (model) {
      this.calculatedValue = this.exchangeService.getValuation(model.id, this.selectedCondition);
    }
  }

  confirmExchange() {
    const device = this.exchangeService.popularDevices.find(d => d.id === this.selectedModel);
    if (device) {
      this.exchangeService.applyExchange(device, this.calculatedValue);
      this.showExchangePortal = false;
    }
  }

  setActiveImage(url: string) {
    this.activeImage = url;
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
  }

  buyNow(product: Product) {
    this.cartService.addToCart(product);
    this.router.navigate(['/checkout']);
  }

  toggleCompare(product: Product) {
    if (this.compareService.isInCompare(product.id)) {
      this.compareService.removeFromCompare(product.id);
    } else {
      this.compareService.addToCompare(product);
    }
  }

  handleImageError(event: any) {
    const fallback = 'https://images.unsplash.com/photo-1598327105666-5b89351aff23?auto=format&fit=crop&q=80&w=800';
    if (event.target.src !== fallback) {
      event.target.src = fallback;
    }
  }

  setRating(star: number) {
    this.reviewRating = star;
  }

  submitReview(product: Product) {
    if (this.reviewRating === 0 || !this.reviewComment.trim()) return;

    this.isSubmitting = true;

    // Simulate API delay
    setTimeout(() => {
      const user = this.authService.currentUser();
      const newReview: Review = {
        id: Math.random().toString(36).substr(2, 9),
        userId: user ? user.uid : 'guest',
        userName: user ? (user.displayName || 'Anonymous') : 'Guest User',
        rating: this.reviewRating,
        comment: this.reviewComment,
        date: new Date(),
        images: [...this.reviewImages],
        helpfulCount: 0
      };

      this.productService.addReview(product.id, newReview);

      if (!product.reviews) {
         product.reviews = [];
      }
      product.reviews.unshift(newReview);

      const oldTotal = product.rating * (product.reviewsCount || 0);
      product.reviewsCount = (product.reviewsCount || 0) + 1;
      product.rating = (oldTotal + newReview.rating) / product.reviewsCount;

      // Reset Form
      this.reviewRating = 0;
      this.reviewComment = '';
      this.reviewImages = [];
      this.isSubmitting = false;
      this.showReviewForm = false;
      
      // Force change detection
      this.cdr.markForCheck();
    }, 800);
  }

  deliveryLocation = '';
  deliveryEstimateMsg = '';

  checkDelivery() {
    if (!this.deliveryLocation.trim()) {
      this.deliveryEstimateMsg = '';
      return;
    }
    this.deliveryEstimateMsg = `Delivery in 2 days to ${this.deliveryLocation.toUpperCase()}`;
  }

  getDeliveryEstimate(product: Product): string {
    const today = new Date();
    let minDays = 2;
    let maxDays = 4;

    // Simple static logic based on category
    if (product.category === 'mobile') {
      minDays = 1;
      maxDays = 3;
    } else if (product.category === 'accessory') {
      minDays = 1;
      maxDays = 2;
    } else if (product.category === 'audio') {
      minDays = 3;
      maxDays = 5;
    }

    const arrivalDate = new Date(today);
    arrivalDate.setDate(today.getDate() + minDays);

    // Format: "Jan 12 - Jan 15" or just "2-4 Days"
    // Requirement says "Delivered in 2-4 days", let's be fancier with dates? 
    // User requested "Delivered in 2-4 days". Let's stick to that plain text + a specific date for "premium" feel.

    return `Delivered in ${minDays}-${maxDays} days`;
  }
}
