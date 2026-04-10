import { Component, inject, signal, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { ProductService } from '../../services/product.service';
import { ProductCard } from '../../components/product-card/product-card';
import { Observable, combineLatest, map, debounceTime, distinctUntilChanged, Subject, takeUntil, startWith } from 'rxjs';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LucideAngularModule, ProductCard],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductList implements OnDestroy {
  private productService = inject(ProductService);
  private route = inject(ActivatedRoute);

  // Filters & Sorting Signals
  searchQuery = signal('');
  sortOption = signal('featured');
  minPrice = signal(0);
  maxPrice = signal(200000);
  minRating = signal(0);
  selectedBrand = signal<string>('');

  // Pagination Signal
  visibleCount = signal(12);
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  // Toggle for Filter Panel UI
  showFilters = signal(false);

  constructor() {
    // Sync URL search param to local signal
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      if (params['search']) {
        this.searchQuery.set(params['search']);
      }
    });

    // Debounced search logic
    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(query => {
      this.searchQuery.set(query);
      this.visibleCount.set(12); // Reset page on search
    });
  }

  // Intermediate observable for all filtered products
  private allFilteredProducts$: Observable<Product[]> = combineLatest([
    this.route.queryParams,
    this.productService.getProducts(),
    toObservable(this.searchQuery),
    toObservable(this.sortOption),
    toObservable(this.minPrice),
    toObservable(this.maxPrice),
    toObservable(this.minRating),
    toObservable(this.selectedBrand)
  ]).pipe(
    map(([params, products, searchQueryValue, sort, minP, maxP, minR, brand]) => {
      const category = params['category'];
      let list = products || [];

      // 1. Filter by Category
      if (category) {
        list = list.filter(p => p.category === category);
      }

      // 2. Filter by Search (Robust Word-based Matching)
      const query = (searchQueryValue || '').toLowerCase().trim();
      if (query) {
        const queryWords = query.split(/\s+/);
        list = list.filter((p: Product) => {
          const target = `${p.name} ${p.category} ${p.description}`.toLowerCase();
          return queryWords.every((word: string) => target.includes(word));
        });
      }

      // 3. Filter by Price
      const minPriceVal = minP || 0;
      const maxPriceVal = maxP || Number.MAX_SAFE_INTEGER;
      list = list.filter(p => p.price >= minPriceVal && p.price <= maxPriceVal);

      // 4. Filter by Rating
      const minRatingVal = minR || 0;
      if (minRatingVal > 1) {
        list = list.filter(p => p.rating >= minRatingVal);
      }

      // 5. Filter by Brand
      const brandVal = brand || '';
      if (brandVal) {
        list = list.filter(p => p.name.toLowerCase().includes(brandVal.toLowerCase()));
      }

      // 5. Sorting
      switch (sort) {
        case 'price-asc':
          list.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          list.sort((a, b) => b.price - a.price);
          break;
        case 'popularity':
          list.sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0));
          break;
        case 'rating':
          list.sort((a, b) => b.rating - a.rating);
          break;
        default:
          break;
      }

      return list;
    })
  );

  // Observable for products to display based on visibleCount
  filteredProducts$: Observable<Product[]> = combineLatest([
    this.allFilteredProducts$,
    toObservable(this.visibleCount)
  ]).pipe(
    map(([products, count]) => products.slice(0, count || 12))
  );

  hasMore$ = combineLatest([
    this.allFilteredProducts$,
    toObservable(this.visibleCount)
  ]).pipe(
    map(([products, count]) => products.length > (count || 12))
  );

  totalCount$ = this.allFilteredProducts$.pipe(map(p => p.length));

  currentCategory$ = this.route.queryParams.pipe(
    map(params => {
      const catMap: Record<string, string> = {
        'mobile': 'Smartphones',
        'accessory': 'Accessories',
        'audio': 'Audio Gear',
        'wearable': 'Wearables',
        'tablet': 'Tablets',
        'gaming': 'Gaming Gear',
        'laptop': 'Laptops',
        'smarthome': 'Smart Home',
        'camera': 'Cameras',
        'tws': 'TWS Earbuds'
      };
      return params['category'] ? (catMap[params['category']] || params['category']) : 'All Collections';
    })
  );

  onSearch(event: any) {
    this.searchSubject.next(event.target.value);
  }

  loadMore() {
    this.visibleCount.update(n => n + 12);
  }

  setBrand(brand: string) {
    this.selectedBrand.set(brand);
    this.visibleCount.set(12);
  }

  setRating(rating: number) {
    this.minRating.set(rating);
    this.visibleCount.set(12);
  }

  resetFilters() {
    this.minPrice.set(0);
    this.maxPrice.set(200000);
    this.minRating.set(0);
    this.selectedBrand.set('');
    this.sortOption.set('featured');
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}