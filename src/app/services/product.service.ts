import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Firestore, collection } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Product, Review } from '../models/product.model';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private http = inject(HttpClient);
    private firestore = inject(Firestore);
    private apiUrl = 'http://localhost:5000/api';
    private productsCollection = collection(this.firestore, 'products');

    private products: Product[] = [];

    constructor() {
        this.generateMockProducts();
    }

    private U(id: string): string {
        return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=800`;
    }

    // Removed all legacy Unsplash Image Arrays constraints.

    private imageIdx: Record<string, number> = {};

    private nextImg(pool: string[], key: string): string {
        if (!this.imageIdx[key]) this.imageIdx[key] = 0;
        const img = pool[this.imageIdx[key] % pool.length];
        this.imageIdx[key]++;
        return img;
    }

    private gallery(pool: string[], mainImg: string, count = 3): string[] {
        const result = [mainImg];
        const start = pool.indexOf(mainImg);
        for (let k = 1; k <= count; k++) {
            const alt = pool[(start + k) % pool.length];
            if (!result.includes(alt)) result.push(alt);
        }
        return result;
    }

    private getLocalImages(productName: string): string[] {
        const brand = productName.split(' ')[0].toLowerCase().replace(/[^a-z0-9]+/g, '');

        return [
            `/assets/images/${brand}1.jpg`,
            `/assets/images/${brand}2.jpg`,
            `/assets/images/${brand}3.jpg`
        ];
    }

    private generateMockProducts() {
        this.products = [
  {
    "id": "p1",
    "name": "iPhone 16 Pro Max",
    "price": 79999,
    "originalPrice": 93598,
    "discount": 17,
    "description": "The iPhone 16 Pro Max redefines innovation with aerospace-grade titanium, the fastest A-series silicon, and pro-grade computational photography.",
    "imageUrl": "/assets/images/iphone1.jpg",
    "images": [
      "/assets/images/iphone1.jpg",
      "/assets/images/iphone2.jpg",
      "/assets/images/iphone3.jpg"
    ],
    "category": "mobile",
    "stock": 50,
    "rating": 4.8,
    "reviewsCount": 2114,
    "seller": "Nexus Official Fulfillment",
    "deliveryBy": "Express 24h",
    "specs": {
      "Top Feature": "AI Enhanced"
    },
    "features": [
      "Premium Build",
      "Ultra Fast Loading"
    ]
  },
  {
    "id": "p2",
    "name": "Samsung Galaxy S25 Ultra",
    "price": 81999,
    "originalPrice": 103318,
    "discount": 26,
    "description": "The Samsung Galaxy S25 Ultra combines massive AI breakthroughs with a 200MP camera and titanium frame for the ultimate Android experience.",
    "imageUrl": "/assets/images/samsung1.jpg",
    "images": [
      "/assets/images/samsung1.jpg",
      "/assets/images/samsung2.jpg",
      "/assets/images/samsung3.jpg"
    ],
    "category": "mobile",
    "stock": 50,
    "rating": 4.7,
    "reviewsCount": 2394,
    "seller": "Nexus Official Fulfillment",
    "deliveryBy": "Express 24h",
    "specs": {
      "Top Feature": "AI Enhanced"
    },
    "features": [
      "Premium Build",
      "Ultra Fast Loading"
    ]
  },
  {
    "id": "p3",
    "name": "Google Pixel 10 Pro",
    "price": 83999,
    "originalPrice": 104158,
    "discount": 24,
    "description": "The Google Pixel 10 Pro is the smartest phone on earth, powered by custom Tensor silicon and Google AI magic.",
    "imageUrl": "https://images.unsplash.com/photo-1724438192720-c19a90e24a69?auto=format&fit=crop&q=80&w=1200",
    "images": [
      "https://images.unsplash.com/photo-1724438192720-c19a90e24a69?auto=format&fit=crop&w=1200",
      "https://images.unsplash.com/photo-1724438192699-89f587b04c24?auto=format&fit=crop&w=1200",
      "https://images.unsplash.com/photo-1724322664367-5cc0f47b5d9d?auto=format&fit=crop&w=1200"
    ],
    "category": "mobile",
    "stock": 50,
    "rating": 4.9,
    "reviewsCount": 2344,
    "seller": "Nexus Assured",
    "deliveryBy": "Express 1-3 days",
    "specs": {
      "Top Feature": "AI Enhanced"
    },
    "features": [
      "Premium Build",
      "Ultra Fast Loading",
      "Extreme Savings: ₹20,159 OFF",
      "5% Unlimited Cashback on Nexus Axis Credit Card",
      "EMI starting from ₹7542/mo"
    ]
  },

  {
    "id": "p4",
    "name": "OnePlus 14 Pro",
    "price": 85999,
    "originalPrice": 99758,
    "discount": 16,
    "description": "The OnePlus 14 Pro is a powerhouse with liquid vapor chamber cooling and elite gaming + photography performance.",
    "imageUrl": "/assets/images/oneplus1.jpg",
    "images": [
      "/assets/images/oneplus1.jpg",
      "/assets/images/oneplus2.jpg",
      "/assets/images/oneplus3.jpg"
    ],
    "category": "mobile",
    "stock": 50,
    "rating": 4.9,
    "reviewsCount": 2338,
    "seller": "Nexus Official Fulfillment",
    "deliveryBy": "Express 24h",
    "specs": {
      "Top Feature": "AI Enhanced"
    },
    "features": [
      "Premium Build",
      "Ultra Fast Loading"
    ]
  },
  {
    "id": "p5",
    "name": "Xiaomi 15 Ultra",
    "price": 87999,
    "originalPrice": 102078,
    "discount": 16,
    "description": "The Xiaomi 15 Ultra is a powerhouse with liquid vapor chamber cooling and elite gaming + photography performance.",
    "imageUrl": "/assets/images/xiaomi1.jpg",
    "images": [
      "/assets/images/xiaomi1.jpg",
      "/assets/images/xiaomi2.jpg",
      "/assets/images/xiaomi3.jpg"
    ],
    "category": "mobile",
    "stock": 50,
    "rating": 4.9,
    "reviewsCount": 2343,
    "seller": "Nexus Official Fulfillment",
    "deliveryBy": "Express 24h",
    "specs": {
      "Top Feature": "AI Enhanced"
    },
    "features": [
      "Premium Build",
      "Ultra Fast Loading"
    ]
  },
  {
    "id": "p6",
    "name": "Sony Xperia 1 VII",
    "price": 89999,
    "originalPrice": 108898,
    "discount": 21,
    "description": "The Sony Xperia 1 VII is a powerhouse with liquid vapor chamber cooling and elite gaming + photography performance.",
    "imageUrl": "/assets/images/sony1.jpg",
    "images": [
      "/assets/images/sony1.jpg",
      "/assets/images/sony2.jpg",
      "/assets/images/sony3.jpg"
    ],
    "category": "mobile",
    "stock": 50,
    "rating": 4.9,
    "reviewsCount": 1964,
    "seller": "Nexus Official Fulfillment",
    "deliveryBy": "Express 24h",
    "specs": {
      "Top Feature": "AI Enhanced"
    },
    "features": [
      "Premium Build",
      "Ultra Fast Loading"
    ]
  },
  {
    "id": "p7",
    "name": "Nothing Phone 4 Pro",
    "price": 91999,
    "originalPrice": 111318,
    "discount": 21,
    "description": "The Nothing Phone 4 Pro is a powerhouse with liquid vapor chamber cooling and elite gaming + photography performance.",
    "imageUrl": "/assets/images/nothing1.jpg",
    "images": [
      "/assets/images/nothing1.jpg",
      "/assets/images/nothing2.jpg",
      "/assets/images/nothing3.jpg"
    ],
    "category": "mobile",
    "stock": 50,
    "rating": 4.7,
    "reviewsCount": 2112,
    "seller": "Nexus Official Fulfillment",
    "deliveryBy": "Express 24h",
    "specs": {
      "Top Feature": "AI Enhanced"
    },
    "features": [
      "Premium Build",
      "Ultra Fast Loading"
    ]
  },
  {
    "id": "p8",
    "name": "Asus ROG Phone 10",
    "price": 93999,
    "originalPrice": 108098,
    "discount": 15,
    "description": "The Asus ROG Phone 10 is a powerhouse with liquid vapor chamber cooling and elite gaming + photography performance.",
    "imageUrl": "/assets/images/asus1.jpg",
    "images": [
      "/assets/images/asus1.jpg",
      "/assets/images/asus2.jpg",
      "/assets/images/asus3.jpg"
    ],
    "category": "mobile",
    "stock": 50,
    "rating": 4.8,
    "reviewsCount": 1918,
    "seller": "Nexus Official Fulfillment",
    "deliveryBy": "Express 24h",
    "specs": {
      "Top Feature": "AI Enhanced"
    },
    "features": [
      "Premium Build",
      "Ultra Fast Loading"
    ]
  },
  {
    "id": "p9",
    "name": "Motorola Edge 60 Ultra",
    "price": 95999,
    "originalPrice": 108478,
    "discount": 13,
    "description": "The Motorola Edge 60 Ultra is a powerhouse with liquid vapor chamber cooling and elite gaming + photography performance.",
    "imageUrl": "/assets/images/motorola1.jpg",
    "images": [
      "/assets/images/motorola1.jpg",
      "/assets/images/motorola2.jpg",
      "/assets/images/motorola3.jpg"
    ],
    "category": "mobile",
    "stock": 50,
    "rating": 4.8,
    "reviewsCount": 2153,
    "seller": "Nexus Official Fulfillment",
    "deliveryBy": "Express 24h",
    "specs": {
      "Top Feature": "AI Enhanced"
    },
    "features": [
      "Premium Build",
      "Ultra Fast Loading"
    ]
  },
  {
    "id": "p10",
    "name": "Realme GT 6 Pro",
    "price": 97999,
    "originalPrice": 112698,
    "discount": 15,
    "description": "The Realme GT 6 Pro is a powerhouse with liquid vapor chamber cooling and elite gaming + photography performance.",
    "imageUrl": "/assets/images/realme1.jpg",
    "images": [
      "/assets/images/realme1.jpg",
      "/assets/images/realme2.jpg",
      "/assets/images/realme3.jpg"
    ],
    "category": "mobile",
    "stock": 50,
    "rating": 4.9,
    "reviewsCount": 2332,
    "seller": "Nexus Official Fulfillment",
    "deliveryBy": "Express 24h",
    "specs": {
      "Top Feature": "AI Enhanced"
    },
    "features": [
      "Premium Build",
      "Ultra Fast Loading"
    ]
  },
  {
    "id": "p11",
    "name": "Oppo Find X9 Pro",
    "price": 99999,
    "originalPrice": 120998,
    "discount": 21,
    "description": "The Oppo Find X9 Pro is a powerhouse with liquid vapor chamber cooling and elite gaming + photography performance.",
    "imageUrl": "/assets/images/oppo1.jpg",
    "images": [
      "/assets/images/oppo1.jpg",
      "/assets/images/oppo2.jpg",
      "/assets/images/oppo3.jpg"
    ],
    "category": "mobile",
    "stock": 50,
    "rating": 4.8,
    "reviewsCount": 2436,
    "seller": "Nexus Official Fulfillment",
    "deliveryBy": "Express 24h",
    "specs": {
      "Top Feature": "AI Enhanced"
    },
    "features": [
      "Premium Build",
      "Ultra Fast Loading"
    ]
  },
  {
    "id": "p12",
    "name": "Vivo X300 Pro",
    "price": 101999,
    "originalPrice": 121378,
    "discount": 19,
    "description": "The Vivo X300 Pro is a powerhouse with liquid vapor chamber cooling and elite gaming + photography performance.",
    "imageUrl": "/assets/images/vivo1.jpg",
    "images": [
      "/assets/images/vivo1.jpg",
      "/assets/images/vivo2.jpg",
      "/assets/images/vivo3.jpg"
    ],
    "category": "mobile",
    "stock": 50,
    "rating": 4.8,
    "reviewsCount": 2432,
    "seller": "Nexus Official Fulfillment",
    "deliveryBy": "Express 24h",
    "specs": {
      "Top Feature": "AI Enhanced"
    },
    "features": [
      "Premium Build",
      "Ultra Fast Loading"
    ]
  },
  {
    "id": "p13",
    "name": "iPhone 16 Pro",
    "price": 103999,
    "originalPrice": 122718,
    "discount": 18,
    "description": "The iPhone 16 Pro redefines innovation with aerospace-grade titanium, the fastest A-series silicon, and pro-grade computational photography.",
    "imageUrl": "/assets/images/iphone1.jpg",
    "images": [
      "/assets/images/iphone1.jpg",
      "/assets/images/iphone2.jpg",
      "/assets/images/iphone3.jpg"
    ],
    "category": "mobile",
    "stock": 50,
    "rating": 4.9,
    "reviewsCount": 2232,
    "seller": "Nexus Official Fulfillment",
    "deliveryBy": "Express 24h",
    "specs": {
      "Top Feature": "AI Enhanced"
    },
    "features": [
      "Premium Build",
      "Ultra Fast Loading"
    ]
  },
  {
    "id": "p14",
    "name": "Samsung Galaxy Z Fold 7",
    "price": 105999,
    "originalPrice": 120838,
    "discount": 14,
    "description": "The Samsung Galaxy Z Fold 7 combines massive AI breakthroughs with a 200MP camera and titanium frame for the ultimate Android experience.",
    "imageUrl": "/assets/images/samsung1.jpg",
    "images": [
      "/assets/images/samsung1.jpg",
      "/assets/images/samsung2.jpg",
      "/assets/images/samsung3.jpg"
    ],
    "category": "mobile",
    "stock": 50,
    "rating": 5,
    "reviewsCount": 1704,
    "seller": "Nexus Official Fulfillment",
    "deliveryBy": "Express 24h",
    "specs": {
      "Top Feature": "AI Enhanced"
    },
    "features": [
      "Premium Build",
      "Ultra Fast Loading"
    ]
  },
  {
    "id": "p15",
    "name": "Google Pixel 10",
    "price": 107999,
    "originalPrice": 132838,
    "discount": 23,
    "description": "The Google Pixel 10 is the smartest phone on earth, powered by custom Tensor silicon and Google AI magic.",
    "imageUrl": "/assets/images/google1.jpg",
    "images": [
      "/assets/images/google1.jpg",
      "/assets/images/google2.jpg",
      "/assets/images/google3.jpg"
    ],
    "category": "mobile",
    "stock": 50,
    "rating": 5,
    "reviewsCount": 1638,
    "seller": "Nexus Official Fulfillment",
    "deliveryBy": "Express 24h",
    "specs": {
      "Top Feature": "AI Enhanced"
    },
    "features": [
      "Premium Build",
      "Ultra Fast Loading"
    ]
  },
  {
    "id": "p16",
    "name": "OnePlus 13",
    "price": 109999,
    "originalPrice": 123198,
    "discount": 12,
    "description": "The OnePlus 13 is a powerhouse with liquid vapor chamber cooling and elite gaming + photography performance.",
    "imageUrl": "/assets/images/oneplus1.jpg",
    "images": [
      "/assets/images/oneplus1.jpg",
      "/assets/images/oneplus2.jpg",
      "/assets/images/oneplus3.jpg"
    ],
    "category": "mobile",
    "stock": 50,
    "rating": 4.9,
    "reviewsCount": 1668,
    "seller": "Nexus Official Fulfillment",
    "deliveryBy": "Express 24h",
    "specs": {
      "Top Feature": "AI Enhanced"
    },
    "features": [
      "Premium Build",
      "Ultra Fast Loading"
    ]
  },
  {
    "id": "p17",
    "name": "Xiaomi 15 Pro",
    "price": 111999,
    "originalPrice": 127678,
    "discount": 14,
    "description": "The Xiaomi 15 Pro is a powerhouse with liquid vapor chamber cooling and elite gaming + photography performance.",
    "imageUrl": "/assets/images/xiaomi1.jpg",
    "images": [
      "/assets/images/xiaomi1.jpg",
      "/assets/images/xiaomi2.jpg",
      "/assets/images/xiaomi3.jpg"
    ],
    "category": "mobile",
    "stock": 50,
    "rating": 5,
    "reviewsCount": 1948,
    "seller": "Nexus Official Fulfillment",
    "deliveryBy": "Express 24h",
    "specs": {
      "Top Feature": "AI Enhanced"
    },
    "features": [
      "Premium Build",
      "Ultra Fast Loading"
    ]
  },
  {
    "id": "p18",
    "name": "Sony Xperia 5 VII",
    "price": 113999,
    "originalPrice": 135658,
    "discount": 19,
    "description": "The Sony Xperia 5 VII is a powerhouse with liquid vapor chamber cooling and elite gaming + photography performance.",
    "imageUrl": "/assets/images/sony1.jpg",
    "images": [
      "/assets/images/sony1.jpg",
      "/assets/images/sony2.jpg",
      "/assets/images/sony3.jpg"
    ],
    "category": "mobile",
    "stock": 50,
    "rating": 4.9,
    "reviewsCount": 2371,
    "seller": "Nexus Official Fulfillment",
    "deliveryBy": "Express 24h",
    "specs": {
      "Top Feature": "AI Enhanced"
    },
    "features": [
      "Premium Build",
      "Ultra Fast Loading"
    ]
  },
  {
    "id": "p19",
    "name": "Nothing Phone 3a",
    "price": 115999,
    "originalPrice": 133398,
    "discount": 15,
    "description": "The Nothing Phone 3a is a powerhouse with liquid vapor chamber cooling and elite gaming + photography performance.",
    "imageUrl": "/assets/images/nothing1.jpg",
    "images": [
      "/assets/images/nothing1.jpg",
      "/assets/images/nothing2.jpg",
      "/assets/images/nothing3.jpg"
    ],
    "category": "mobile",
    "stock": 50,
    "rating": 5,
    "reviewsCount": 2123,
    "seller": "Nexus Official Fulfillment",
    "deliveryBy": "Express 24h",
    "specs": {
      "Top Feature": "AI Enhanced"
    },
    "features": [
      "Premium Build",
      "Ultra Fast Loading"
    ]
  },
  {
    "id": "p20",
    "name": "Sony WH-1000XM5",
    "price": 29999,
    "originalPrice": 33898,
    "discount": 13,
    "description": "Industry-leading ANC headphones with 8 mics and 30-hour battery.",
    "imageUrl": "https://images.unsplash.com/photo-1755719401938-35c1b24f6d15?fm=jpg&q=80&w=1200&auto=format&fit=crop",
    "images": [
      "https://images.unsplash.com/photo-1755719401938-35c1b24f6d15?fm=jpg&q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1755719401541-d78b9bc9b514?fm=jpg&q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1755719401620-25bce1b8a7a3?fm=jpg&q=80&w=1200&auto=format&fit=crop"
    ],
    "category": "audio",
    "stock": 50,
    "rating": 4.9,
    "reviewsCount": 2250,
    "seller": "Nexus Assured",
    "deliveryBy": "Express 1-2 days",
    "specs": {
      "Top Feature": "AI Enhanced"
    },
    "features": [
      "Premium Build",
      "Ultra Fast Loading",
      "Extreme Savings: ₹3,899 OFF"
    ]
  },
  {
    "id": "p21",
    "name": "Apple AirPods Max",
    "price": 59900,
    "originalPrice": 73677,
    "discount": 23,
    "description": "Over-ear headphones with H1 chip and spatial audio.",
    "imageUrl": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&h=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&h=800&q=80",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&h=800&q=80",
      "https://images.unsplash.com/photo-1546435989-70fdcd9e8d8f?auto=format&fit=crop&w=800&h=800&q=80"
    ],
    "category": "audio",
    "stock": 50,
    "rating": 5,
    "reviewsCount": 1814,
    "seller": "Nexus Official Fulfillment",
    "deliveryBy": "Express 24h",
    "specs": {
      "Top Feature": "AI Enhanced"
    },
    "features": [
      "Premium Build",
      "Ultra Fast Loading"
    ]
  },
  {
    "id": "p22",
    "name": "Bose QuietComfort 45",
    "price": 24999,
    "originalPrice": 31248,
    "discount": 25,
    "description": "Legendary Bose noise cancellation with 24-hour battery.",
    "imageUrl": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&h=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&h=800&q=80",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&h=800&q=80",
      "https://images.unsplash.com/photo-1546435989-70fdcd9e8d8f?auto=format&fit=crop&w=800&h=800&q=80"
    ],
    "category": "audio",
    "stock": 50,
    "rating": 4.8,
    "reviewsCount": 2193,
    "seller": "Nexus Official Fulfillment",
    "deliveryBy": "Express 24h",
    "specs": {
      "Top Feature": "AI Enhanced"
    },
    "features": [
      "Premium Build",
      "Ultra Fast Loading"
    ]
  },
  {
    "id": "p23",
    "name": "Sennheiser Momentum 4",
    "price": 27999,
    "originalPrice": 33038,
    "discount": 18,
    "description": "Audiophile-grade sound with class-leading 60-hour battery.",
    "imageUrl": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&h=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&h=800&q=80",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&h=800&q=80",
      "https://images.unsplash.com/photo-1546435989-70fdcd9e8d8f?auto=format&fit=crop&w=800&h=800&q=80"
    ],
    "category": "audio",
    "stock": 50,
    "rating": 4.9,
    "reviewsCount": 2457,
    "seller": "Nexus Official Fulfillment",
    "deliveryBy": "Express 24h",
    "specs": {
      "Top Feature": "AI Enhanced"
    },
    "features": [
      "Premium Build",
      "Ultra Fast Loading"
    ]
  },
  {
    "id": "p24",
    "name": "JBL Tour One M2",
    "price": 19999,
    "originalPrice": 25198,
    "discount": 26,
    "description": "True Adaptive ANC with 4-mic beamforming and Hi-Res Audio.",
    "imageUrl": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&h=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&h=800&q=80",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&h=800&q=80",
      "https://images.unsplash.com/photo-1546435989-70fdcd9e8d8f?auto=format&fit=crop&w=800&h=800&q=80"
    ],
    "category": "audio",
    "stock": 50,
    "rating": 4.9,
    "reviewsCount": 2408,
    "seller": "Nexus Official Fulfillment",
    "deliveryBy": "Express 24h",
    "specs": {
      "Top Feature": "AI Enhanced"
    },
    "features": [
      "Premium Build",
      "Ultra Fast Loading"
    ]
  },
  {
    "id": "p25",
    "name": "Marshall Major V",
    "price": 12999,
    "originalPrice": 15858,
    "discount": 22,
    "description": "Rock-tuned sound with legendary 80-hour battery life.",
    "imageUrl": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&h=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&h=800&q=80",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&h=800&q=80",
      "https://images.unsplash.com/photo-1546435989-70fdcd9e8d8f?auto=format&fit=crop&w=800&h=800&q=80"
    ],
    "category": "audio",
    "stock": 50,
    "rating": 5,
    "reviewsCount": 1851,
    "seller": "Nexus Official Fulfillment",
    "deliveryBy": "Express 24h",
    "specs": {
      "Top Feature": "AI Enhanced"
    },
    "features": [
      "Premium Build",
      "Ultra Fast Loading"
    ]
  },
  {
    "id": "p28",
    "name": "Samsung Galaxy Buds3 Pro",
    "price": 17999,
    "originalPrice": 22318,
    "discount": 24,
    "description": "Blade design TWS with Galaxy AI translation features.",
    "imageUrl": "https://images.unsplash.com/photo-1608156639585-b3a032ef9689?auto=format&fit=crop&w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1608156639585-b3a032ef9689?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1603351154351-5e2d0600a944?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600086827875-a6a3dcbc61db?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "tws",
    "stock": 50,
    "rating": 4.7,
    "reviewsCount": 1927,
    "seller": "Nexus Assured",
    "deliveryBy": "Express 1-2 days",
    "specs": {
      "Top Feature": "AI Enhanced"
    },
    "features": [
      "Premium Build",
      "Ultra Fast Loading",
      "Extreme Savings: ₹4,319 OFF"
    ]
  },
  {
    "id": "p29",
    "name": "Nothing Ear 2",
    "price": 9999,
    "originalPrice": 12298,
    "discount": 23,
    "description": "Dual-driver TWS with personal ANC and LHDC 5.0 Hi-Res audio.",
    "imageUrl": "https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?auto=format&fit=crop&w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1533158307587-828f0a76ef46?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "tws",
    "stock": 50,
    "rating": 5,
    "reviewsCount": 1877,
    "seller": "Nexus Assured",
    "deliveryBy": "Express 1-2 days",
    "specs": {
      "Top Feature": "AI Enhanced"
    },
    "features": [
      "Premium Build",
      "Ultra Fast Loading",
      "Extreme Savings: ₹2,299 OFF"
    ]
  },
  {
    "id": "p30",
    "name": "Apple Watch Series 10",
    "price": 45900,
    "originalPrice": 51408,
    "discount": 12,
    "description": "Thinnest Apple Watch with Sleep Apnea detection.",
    "imageUrl": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&h=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&h=800&q=80",
      "https://images.unsplash.com/photo-1579586337278-79c4a0edd37a?auto=format&fit=crop&w=800&h=800&q=80",
      "https://images.unsplash.com/photo-1508685096489-7aac29bbbd9a?auto=format&fit=crop&w=800&h=800&q=80"
    ],
    "category": "wearable",
    "stock": 50,
    "rating": 4.9,
    "reviewsCount": 1673,
    "seller": "Nexus Official Fulfillment",
    "deliveryBy": "Express 24h",
    "specs": {
      "Top Feature": "AI Enhanced"
    },
    "features": [
      "Premium Build",
      "Ultra Fast Loading"
    ]
  },
  {
    "id": "p31",
    "name": "Samsung Galaxy Watch 7",
    "price": 29999,
    "originalPrice": 35398,
    "discount": 18,
    "description": "3nm Exynos-powered watch with Galaxy AI health coach.",
    "imageUrl": "https://images.unsplash.com/photo-1617043786394-f977fa12eddf?auto=format&fit=crop&w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1617043786394-f977fa12eddf?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1544117519-31a4b719223d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517505928886-f0896942bb42?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "wearable",
    "stock": 50,
    "rating": 4.8,
    "reviewsCount": 1746,
    "seller": "Nexus Assured",
    "deliveryBy": "Express 1-2 days",
    "specs": {
      "Top Feature": "AI Enhanced"
    },
    "features": [
      "Premium Build",
      "Ultra Fast Loading",
      "Extreme Savings: ₹5,399 OFF"
    ]
  },
  {
    "id": "p32",
    "name": "Garmin Fenix 8",
    "price": 89999,
    "originalPrice": 100798,
    "discount": 12,
    "description": "Ultimate multisport GPS watch with 29-day battery.",
    "imageUrl": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&h=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&h=800&q=80",
      "https://images.unsplash.com/photo-1579586337278-79c4a0edd37a?auto=format&fit=crop&w=800&h=800&q=80",
      "https://images.unsplash.com/photo-1508685096489-7aac29bbbd9a?auto=format&fit=crop&w=800&h=800&q=80"
    ],
    "category": "wearable",
    "stock": 50,
    "rating": 5,
    "reviewsCount": 1742,
    "seller": "Nexus Official Fulfillment",
    "deliveryBy": "Express 24h",
    "specs": {
      "Top Feature": "AI Enhanced"
    },
    "features": [
      "Premium Build",
      "Ultra Fast Loading"
    ]
  },
  {
    "id": "p33",
    "name": "OnePlus Watch 3",
    "price": 19999,
    "originalPrice": 22798,
    "discount": 14,
    "description": "100W charging smartwatch with Halo Light design.",
    "imageUrl": "https://images.unsplash.com/photo-1617043786394-f977fa12eddf?auto=format&fit=crop&w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1617043786394-f977fa12eddf?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1544117519-31a4b719223d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517505928886-f0896942bb42?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "wearable",
    "stock": 50,
    "rating": 4.9,
    "reviewsCount": 1687,
    "seller": "Nexus Assured",
    "deliveryBy": "Express 1-2 days",
    "specs": {
      "Top Feature": "AI Enhanced"
    },
    "features": [
      "Premium Build",
      "Ultra Fast Loading",
      "Extreme Savings: ₹2,799 OFF"
    ]
  },
  {
    "id": "p34",
    "name": "Apple iPad Pro M4 11-inch",
    "price": 99900,
    "originalPrice": 115883,
    "discount": 16,
    "description": "Thinnest Apple product ever with Ultra Retina XDR OLED display.",
    "imageUrl": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&h=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&h=800&q=80",
      "https://images.unsplash.com/photo-1561154464-02584748-4f18-a2b0-065a0f2c91ab?auto=format&fit=crop&w=800&h=800&q=80",
      "https://images.unsplash.com/photo-1587033411391-5d9e51cce126?auto=format&fit=crop&w=800&h=800&q=80"
    ],
    "category": "tablet",
    "stock": 50,
    "rating": 4.7,
    "reviewsCount": 2129,
    "seller": "Nexus Official Fulfillment",
    "deliveryBy": "Express 24h",
    "specs": {
      "Top Feature": "AI Enhanced"
    },
    "features": [
      "Premium Build",
      "Ultra Fast Loading"
    ]
  },
  {
    "id": "p35",
    "name": "Samsung Galaxy Tab S10 Ultra",
    "price": 109999,
    "originalPrice": 127598,
    "discount": 16,
    "description": "Largest Samsung tablet with Galaxy AI and bundled S Pen.",
    "imageUrl": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1561154464-02584748-4f18?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1587033411391-5d9e51cce126?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "tablet",
    "stock": 50,
    "rating": 5,
    "reviewsCount": 1668,
    "seller": "Nexus Assured",
    "deliveryBy": "Express 1-2 days",
    "specs": {
      "Top Feature": "AI Enhanced"
    },
    "features": [
      "Premium Build",
      "Ultra Fast Loading",
      "Extreme Savings: ₹17,599 OFF"
    ]
  },
  {
    "id": "p36",
    "name": "OnePlus Pad 2",
    "price": 44999,
    "originalPrice": 53998,
    "discount": 20,
    "description": "Flagship-chip tablet with 144Hz 3K LTPO display.",
    "imageUrl": "/assets/images/oneplus1.jpg",
    "images": [
      "/assets/images/oneplus1.jpg",
      "/assets/images/oneplus2.jpg",
      "/assets/images/oneplus3.jpg"
    ],
    "category": "tablet",
    "stock": 50,
    "rating": 4.9,
    "reviewsCount": 2050,
    "seller": "Nexus Official Fulfillment",
    "deliveryBy": "Express 24h",
    "specs": {
      "Top Feature": "AI Enhanced"
    },
    "features": [
      "Premium Build",
      "Ultra Fast Loading"
    ]
  },
  {
    "id": "p37",
    "name": "Apple MagSafe Charger 15W",
    "price": 3900,
    "originalPrice": 4797,
    "discount": 23,
    "description": "Perfectly aligned 15W magnetic wireless charger for iPhone.",
    "imageUrl": "https://images.unsplash.com/photo-1615526675045-07531f986a9e?fm=jpg&q=80&w=1200&auto=format&fit=crop",
    "images": [
      "https://images.unsplash.com/photo-1615526675045-07531f986a9e?fm=jpg&q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1615526675159-e248c3021d3f?fm=jpg&q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1615526674998-2ea0930bfe24?fm=jpg&q=80&w=1200&auto=format&fit=crop"
    ],
    "category": "accessory",
    "stock": 50,
    "rating": 4.9,
    "reviewsCount": 1559,
    "seller": "Nexus Assured",
    "deliveryBy": "Express 1-2 days",
    "specs": {
      "Top Feature": "Magnetic Alignment"
    },
    "features": [
      "Perfect Magnetic Alignment",
      "15W Fast Wireless Charging",
      "Extreme Savings: ₹897 OFF"
    ]
  },
  {
    "id": "p38",
    "name": "Anker 240W GaN 4-Port Charger",
    "price": 5999,
    "originalPrice": 7498,
    "discount": 25,
    "description": "Charge 4 devices at once \u2014 up to 240W total.",
    "imageUrl": "https://images.unsplash.com/photo-1636015856875-00ce4b89433d?fm=jpg&q=80&w=1200&auto=format&fit=crop",
    "images": [
      "https://images.unsplash.com/photo-1636015856875-00ce4b89433d?fm=jpg&q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1596877445530-ad74838754c6?fm=jpg&q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1617900413544-a26abba889b4?fm=jpg&q=80&w=1200&auto=format&fit=crop"
    ],
    "category": "accessory",
    "stock": 50,
    "rating": 5,
    "reviewsCount": 2191,
    "seller": "Nexus Assured",
    "deliveryBy": "Express 1-2 days",
    "specs": {
      "Top Feature": "AI Enhanced"
    },
    "features": [
      "Premium Build",
      "Ultra Fast Loading",
      "Extreme Savings: ₹1,499 OFF"
    ]
  },
  {
    "id": "p39",
    "name": "Samsung 45W Super Fast Charger",
    "price": 2999,
    "originalPrice": 3628,
    "discount": 21,
    "description": "Official 45W Galaxy Super Fast Charger with cable.",
    "imageUrl": "/assets/images/samsung1.jpg",
    "images": [
      "/assets/images/samsung1.jpg",
      "/assets/images/samsung2.jpg",
      "/assets/images/samsung3.jpg"
    ],
    "category": "accessory",
    "stock": 50,
    "rating": 4.9,
    "reviewsCount": 1966,
    "seller": "Nexus Official Fulfillment",
    "deliveryBy": "Express 24h",
    "specs": {
      "Top Feature": "AI Enhanced"
    },
    "features": [
      "Premium Build",
      "Ultra Fast Loading"
    ]
  },
  {
    "id": "p40",
    "name": "Spigen Ultra Hybrid Case",
    "price": 999,
    "originalPrice": 1168,
    "discount": 17,
    "description": "Military-grade protection with crystal clear back panel.",
    "imageUrl": "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=800&h=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=800&h=800&q=80",
      "https://images.unsplash.com/photo-1585771724684-b4a1db85cb39?auto=format&fit=crop&w=800&h=800&q=80",
      "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=800&h=800&q=80"
    ],
    "category": "accessory",
    "stock": 50,
    "rating": 4.7,
    "reviewsCount": 2287,
    "seller": "Nexus Official Fulfillment",
    "deliveryBy": "Express 24h",
    "specs": {
      "Top Feature": "AI Enhanced"
    },
    "features": [
      "Premium Build",
      "Ultra Fast Loading"
    ]
  },
  {
    "id": "p41",
    "name": "Sony Alpha A7 IV",
    "price": 224990,
    "originalPrice": 258738,
    "discount": 15,
    "description": "Ultimate hybrid full-frame mirrorless for creators.",
    "imageUrl": "/assets/images/sony1.jpg",
    "images": [
      "/assets/images/sony1.jpg",
      "/assets/images/sony2.jpg",
      "/assets/images/sony3.jpg"
    ],
    "category": "camera",
    "stock": 50,
    "rating": 4.8,
    "reviewsCount": 2276,
    "seller": "Nexus Official Fulfillment",
    "deliveryBy": "Express 24h",
    "specs": {
      "Top Feature": "AI Enhanced"
    },
    "features": [
      "Premium Build",
      "Ultra Fast Loading"
    ]
  },
  {
    "id": "p42",
    "name": "GoPro Hero 13 Black",
    "price": 44999,
    "originalPrice": 50398,
    "discount": 12,
    "description": "Most capable GoPro with 5.3K video and HyperSmooth 6.0.",
    "imageUrl": "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&h=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&h=800&q=80",
      "https://images.unsplash.com/photo-1502920822851-7f7d2b68cb22?auto=format&fit=crop&w=800&h=800&q=80",
      "https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?auto=format&fit=crop&w=800&h=800&q=80"
    ],
    "category": "camera",
    "stock": 50,
    "rating": 4.9,
    "reviewsCount": 2045,
    "seller": "Nexus Official Fulfillment",
    "deliveryBy": "Express 24h",
    "specs": {
      "Top Feature": "AI Enhanced"
    },
    "features": [
      "Premium Build",
      "Ultra Fast Loading"
    ]
  },
  {
    "id": "m4pro-14-nexus",
    "name": "Apple MacBook Pro M4 Pro 14-inch (Liquid Retina XDR)",
    "price": 199900,
    "originalPrice": 229884,
    "discount": 15,
    "description": "World's best laptop chip with 22-hour battery and Retina XDR. Professional performance in every pixel.",
    "imageUrl": "https://images.unsplash.com/photo-1650285110415-3561055fdd67?fm=jpg&q=80&w=1200&auto=format&fit=crop",
    "images": [
      "https://images.unsplash.com/photo-1650285110415-3561055fdd67?fm=jpg&q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1691375690421-31cfe1704cf2?fm=jpg&q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1678059285291-c22302c018f2?fm=jpg&q=80&w=1200&auto=format&fit=crop"
    ],
    "category": "laptop",
    "stock": 50,
    "rating": 4.7,
    "reviewsCount": 47,
    "seller": "Nexus Assured",
    "deliveryBy": "Express 24h",
    "specs": {
      "Top Feature": "M4 Pro Chip",
      "Model": "MacBook Pro 14 (Late 2024)",
      "Pro Display": "Liquid Retina XDR Display",
      "Battery Life": "Up to 22 Hours",
      "Performance": "Extreme Performance Mode"
    },
    "features": [
      "Fast Sync",
      "Extreme Savings: ₹29,984 OFF",
      "World's best laptop chip",
      "22-hour battery life",
      "Nexus Assured Quality",
      "Retina XDR Dynamic Range",
      "5% Unlimited Cashback on Nexus Axis Credit Card",
      "EMI starting from ₹17948/mo"
    ]
  },
  {
    "id": "p44",
    "name": "Asus ROG Zephyrus G16",
    "price": 189999,
    "originalPrice": 231798,
    "discount": 22,
    "description": "RTX 4090 gaming laptop with 240Hz OLED and liquid cooling.",
    "imageUrl": "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=1200&h=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=1200&h=800&q=80",
      "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=1200&h=800&q=80",
      "https://images.unsplash.com/photo-1555548750-8603a1a69755?auto=format&fit=crop&w=800&h=800&q=80"
    ],
    "category": "laptop",
    "stock": 50,
    "rating": 4.8,
    "reviewsCount": 48,
    "seller": "Nexus Official Fulfillment",
    "deliveryBy": "Express 24h",
    "specs": {
      "Top Feature": "AI Enhanced"
    },
    "features": [
      "Fast Sync",
      "Premium Build",
      "Ultra Fast Loading"
    ]
  },
  {
    "id": "p45",
    "name": "Asus ROG Phone 9 Pro",
    "price": 129999,
    "originalPrice": 155998,
    "discount": 20,
    "description": "Apex gaming phone with 185Hz display and Snapdragon 8 Elite.",
    "imageUrl": "/assets/images/asus1.jpg",
    "images": [
      "/assets/images/asus1.jpg",
      "/assets/images/asus2.jpg",
      "/assets/images/asus3.jpg"
    ],
    "category": "gaming",
    "stock": 50,
    "rating": 5,
    "reviewsCount": 1676,
    "seller": "Nexus Official Fulfillment",
    "deliveryBy": "Express 24h",
    "specs": {
      "Top Feature": "AI Enhanced"
    },
    "features": [
      "Premium Build",
      "Ultra Fast Loading"
    ]
  },
  {
    "id": "p46",
    "name": "Xiaomi Black Shark 6 Pro",
    "price": 69999,
    "originalPrice": 84698,
    "discount": 21,
    "description": "Mechanical trigger gaming phone with 120W ultra-fast charge.",
    "imageUrl": "/assets/images/xiaomi1.jpg",
    "images": [
      "/assets/images/xiaomi1.jpg",
      "/assets/images/xiaomi2.jpg",
      "/assets/images/xiaomi3.jpg"
    ],
    "category": "gaming",
    "stock": 50,
    "rating": 5,
    "reviewsCount": 1524,
    "seller": "Nexus Official Fulfillment",
    "deliveryBy": "Express 24h",
    "specs": {
      "Top Feature": "AI Enhanced"
    },
    "features": [
      "Premium Build",
      "Ultra Fast Loading"
    ]
  },
  {
    "id": "p49",
    "name": "Samsung Galaxy S24 FE",
    "price": 54999,
    "originalPrice": 67098,
    "discount": 22,
    "description": "Fan Edition flagship with Galaxy AI and 50MP triple camera at an accessible price.",
    "imageUrl": "/assets/images/samsung1.jpg",
    "images": [
      "/assets/images/samsung1.jpg",
      "/assets/images/samsung2.jpg",
      "/assets/images/samsung3.jpg"
    ],
    "category": "mobile",
    "stock": 50,
    "rating": 5,
    "reviewsCount": 2179,
    "seller": "Nexus Official Fulfillment",
    "deliveryBy": "Express 24h",
    "specs": {
      "Top Feature": "AI Enhanced"
    },
    "features": [
      "Premium Build",
      "Ultra Fast Loading"
    ]
  },
  {
    "id": "p50",
    "name": "iPhone 15",
    "price": 69999,
    "originalPrice": 78398,
    "discount": 12,
    "description": "USB-C iPhone with Dynamic Island, 48MP camera, and A16 Bionic chip.",
    "imageUrl": "/assets/images/iphone1.jpg",
    "images": [
      "/assets/images/iphone1.jpg",
      "/assets/images/iphone2.jpg",
      "/assets/images/iphone3.jpg"
    ],
    "category": "mobile",
    "stock": 50,
    "rating": 4.7,
    "reviewsCount": 1521,
    "seller": "Nexus Official Fulfillment",
    "deliveryBy": "Express 24h",
    "specs": {
      "Top Feature": "AI Enhanced"
    },
    "features": [
      "Premium Build",
      "Ultra Fast Loading"
    ]
  },
  {
    "id": "p51",
    "name": "OnePlus 12R",
    "price": 39999,
    "originalPrice": 47998,
    "discount": 20,
    "description": "Snapdragon 8 Gen 2 powerhouse with 100W SUPERVOOC and OxygenOS.",
    "imageUrl": "/assets/images/oneplus1.jpg",
    "images": [
      "/assets/images/oneplus1.jpg",
      "/assets/images/oneplus2.jpg",
      "/assets/images/oneplus3.jpg"
    ],
    "category": "mobile",
    "stock": 50,
    "rating": 5,
    "reviewsCount": 1947,
    "seller": "Nexus Official Fulfillment",
    "deliveryBy": "Express 24h",
    "specs": {
      "Top Feature": "AI Enhanced"
    },
    "features": [
      "Premium Build",
      "Ultra Fast Loading"
    ]
  },
  {
    "id": "p52",
    "name": "Xiaomi Redmi Note 14 Pro+",
    "price": 31999,
    "originalPrice": 39358,
    "discount": 23,
    "description": "200MP camera phone with Dimensity 8300 Ultra and 90W HyperCharge.",
    "imageUrl": "/assets/images/xiaomi1.jpg",
    "images": [
      "/assets/images/xiaomi1.jpg",
      "/assets/images/xiaomi2.jpg",
      "/assets/images/xiaomi3.jpg"
    ],
    "category": "mobile",
    "stock": 50,
    "rating": 4.9,
    "reviewsCount": 2307,
    "seller": "Nexus Official Fulfillment",
    "deliveryBy": "Express 24h",
    "specs": {
      "Top Feature": "AI Enhanced"
    },
    "features": [
      "Premium Build",
      "Ultra Fast Loading"
    ]
  },
  {
    "id": "p53",
    "name": "Google Pixel 9a",
    "price": 52999,
    "originalPrice": 65188,
    "discount": 23,
    "description": "Affordable Pixel with Tensor G4, 7 years updates and Google AI features.",
    "imageUrl": "/assets/images/google1.jpg",
    "images": [
      "/assets/images/google1.jpg",
      "/assets/images/google2.jpg",
      "/assets/images/google3.jpg"
    ],
    "category": "mobile",
    "stock": 50,
    "rating": 4.9,
    "reviewsCount": 2134,
    "seller": "Nexus Official Fulfillment",
    "deliveryBy": "Express 24h",
    "specs": {
      "Top Feature": "AI Enhanced"
    },
    "features": [
      "Premium Build",
      "Ultra Fast Loading"
    ]
  },
  {
    "id": "p54",
    "name": "Motorola Razr 50 Ultra",
    "price": 89999,
    "originalPrice": 107098,
    "discount": 19,
    "description": "Premium flip phone with 4\" cover display and Snapdragon 8s Gen 3.",
    "imageUrl": "/assets/images/motorola1.jpg",
    "images": [
      "/assets/images/motorola1.jpg",
      "/assets/images/motorola2.jpg",
      "/assets/images/motorola3.jpg"
    ],
    "category": "mobile",
    "stock": 50,
    "rating": 4.8,
    "reviewsCount": 2011,
    "seller": "Nexus Official Fulfillment",
    "deliveryBy": "Express 24h",
    "specs": {
      "Top Feature": "AI Enhanced"
    },
    "features": [
      "Premium Build",
      "Ultra Fast Loading"
    ]
  },
  {
    "id": "p55",
    "name": "Beats Studio Pro",
    "price": 32999,
    "originalPrice": 37948,
    "discount": 15,
    "description": "USB-C Beats with Apple & Android full feature support and 40h battery.",
    "imageUrl": "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&h=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&h=800&q=80",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&h=800&q=80",
      "https://images.unsplash.com/photo-1546435989-70fdcd9e8d8f?auto=format&fit=crop&w=800&h=800&q=80"
    ],
    "category": "audio",
    "stock": 50,
    "rating": 4.9,
    "reviewsCount": 2334,
    "seller": "Nexus Official Fulfillment",
    "deliveryBy": "Express 24h",
    "specs": {
      "Top Feature": "AI Enhanced"
    },
    "features": [
      "Premium Build",
      "Ultra Fast Loading"
    ]
  },
  {
    "id": "p56",
    "name": "Sony WH-CH720N",
    "price": 10999,
    "originalPrice": 12318,
    "discount": 12,
    "description": "Lightweight ANC headphones with 35h battery and multipoint connection.",
    "imageUrl": "/assets/images/sony1.jpg",
    "images": [
      "/assets/images/sony1.jpg",
      "/assets/images/sony2.jpg",
      "/assets/images/sony3.jpg"
    ],
    "category": "audio",
    "stock": 50,
    "rating": 4.8,
    "reviewsCount": 2025,
    "seller": "Nexus Official Fulfillment",
    "deliveryBy": "Express 24h",
    "specs": {
      "Top Feature": "AI Enhanced"
    },
    "features": [
      "Premium Build",
      "Ultra Fast Loading"
    ]
  },
  {
    "id": "p57",
    "name": "Jabra Evolve2 85",
    "price": 34999,
    "originalPrice": 39548,
    "discount": 13,
    "description": "Professional-grade ANC headset with 8-mic call clarity and 37h battery.",
    "imageUrl": "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&h=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&h=800&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&h=800&q=80",
      "https://images.unsplash.com/photo-1546435989-70fdcd9e8d8f?auto=format&fit=crop&w=800&h=800&q=80"
    ],
    "category": "audio",
    "stock": 50,
    "rating": 4.8,
    "reviewsCount": 2106,
    "seller": "Nexus Official Fulfillment",
    "deliveryBy": "Express 24h",
    "specs": {
      "Top Feature": "AI Enhanced"
    },
    "features": [
      "Premium Build",
      "Ultra Fast Loading"
    ]
  },
  {
    "id": "p58",
    "name": "OnePlus Buds Pro 3",
    "price": 11999,
    "originalPrice": 14158,
    "discount": 18,
    "description": "Hi-Res Audio TWS with dual drivers and 49dB industry-leading ANC.",
    "imageUrl": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1606220588913-b3eb381180fb?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1606220838315-056192d5e921?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "tws",
    "stock": 50,
    "rating": 4.7,
    "reviewsCount": 2456,
    "seller": "Nexus Assured",
    "deliveryBy": "Express 1-2 days",
    "specs": {
      "Top Feature": "AI Enhanced"
    },
    "features": [
      "Premium Build",
      "Ultra Fast Loading",
      "Extreme Savings: ₹2,159 OFF"
    ]
  },
  {
    "id": "p59",
    "name": "Bose QuietComfort Earbuds II",
    "price": 22999,
    "originalPrice": 28288,
    "discount": 23,
    "description": "World-class ANC earbuds with personalized fit and 6h battery.",
    "imageUrl": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&h=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&h=800&q=80",
      "https://images.unsplash.com/photo-1631157769499-6bfb45d66be7?auto=format&fit=crop&w=800&h=800&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&h=800&q=80"
    ],
    "category": "tws",
    "stock": 50,
    "rating": 4.8,
    "reviewsCount": 1528,
    "seller": "Nexus Official Fulfillment",
    "deliveryBy": "Express 24h",
    "specs": {
      "Top Feature": "AI Enhanced"
    },
    "features": [
      "Premium Build",
      "Ultra Fast Loading"
    ]
  },
  {
    "id": "p60",
    "name": "Realme Buds Air 6 Pro",
    "price": 4999,
    "originalPrice": 6098,
    "discount": 22,
    "description": "Budget king TWS with 50dB ANC and LDAC Hi-Res audio under \u20b95000.",
    "imageUrl": "https://images.unsplash.com/photo-1755182529034-189a6051faae?fm=jpg&q=80&w=1080&auto=format&fit=crop",
    "images": [
      "https://images.unsplash.com/photo-1755182529034-189a6051faae?fm=jpg&q=80&w=1080&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1756576357673-a3d5240118d9?fm=jpg&q=80&w=1080&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1706289835533-3cb1956beeb3?fm=jpg&q=80&w=1080&auto=format&fit=crop"
    ],
    "category": "tws",
    "stock": 50,
    "rating": 4.8,
    "reviewsCount": 2304,
    "seller": "Nexus Assured",
    "deliveryBy": "Express 1-2 days",
    "specs": {
      "Top Feature": "AI Enhanced"
    },
    "features": [
      "Premium Build",
      "Ultra Fast Loading",
      "Extreme Savings: ₹1,099 OFF"
    ]
  },
  {
    "id": "p61",
    "name": "Fitbit Charge 6",
    "price": 14999,
    "originalPrice": 17398,
    "discount": 16,
    "description": "Google-integrated fitness tracker with ECG, GPS, and 7-day battery.",
    "imageUrl": "https://images.unsplash.com/photo-1579586337278-79c4a0edd37a?auto=format&fit=crop&w=800&h=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1579586337278-79c4a0edd37a?auto=format&fit=crop&w=800&h=800&q=80",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&h=800&q=80",
      "https://images.unsplash.com/photo-1508685096489-7aac29bbbd9a?auto=format&fit=crop&w=800&h=800&q=80"
    ],
    "category": "wearable",
    "stock": 50,
    "rating": 4.9,
    "reviewsCount": 2217,
    "seller": "Nexus Official Fulfillment",
    "deliveryBy": "Express 24h",
    "specs": {
      "Top Feature": "AI Enhanced"
    },
    "features": [
      "Premium Build",
      "Ultra Fast Loading"
    ]
  },
  {
    "id": "p62",
    "name": "Amazfit GTR 4",
    "price": 12999,
    "originalPrice": 15598,
    "discount": 20,
    "description": "14-day battery smartwatch with dual-band GPS and Zepp OS 2.0.",
    "imageUrl": "https://images.unsplash.com/photo-1508685096489-7aac29bbbd9a?auto=format&fit=crop&w=800&h=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1508685096489-7aac29bbbd9a?auto=format&fit=crop&w=800&h=800&q=80",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&h=800&q=80",
      "https://images.unsplash.com/photo-1579586337278-79c4a0edd37a?auto=format&fit=crop&w=800&h=800&q=80"
    ],
    "category": "wearable",
    "stock": 50,
    "rating": 4.9,
    "reviewsCount": 2100,
    "seller": "Nexus Official Fulfillment",
    "deliveryBy": "Express 24h",
    "specs": {
      "Top Feature": "AI Enhanced"
    },
    "features": [
      "Premium Build",
      "Ultra Fast Loading"
    ]
  },
  {
    "id": "p63",
    "name": "Noise ColorFit Ultra 3",
    "price": 4999,
    "originalPrice": 6198,
    "discount": 24,
    "description": "1.96\" AMOLED budget smartwatch with BT calling and 7-day battery.",
    "imageUrl": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&h=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&h=800&q=80",
      "https://images.unsplash.com/photo-1579586337278-79c4a0edd37a?auto=format&fit=crop&w=800&h=800&q=80",
      "https://images.unsplash.com/photo-1508685096489-7aac29bbbd9a?auto=format&fit=crop&w=800&h=800&q=80"
    ],
    "category": "wearable",
    "stock": 50,
    "rating": 4.8,
    "reviewsCount": 2096,
    "seller": "Nexus Official Fulfillment",
    "deliveryBy": "Express 24h",
    "specs": {
      "Top Feature": "AI Enhanced"
    },
    "features": [
      "Premium Build",
      "Ultra Fast Loading"
    ]
  },
  {
    "id": "p64",
    "name": "Samsung Galaxy Tab A9+",
    "price": 29999,
    "originalPrice": 33898,
    "discount": 13,
    "description": "11\" entertainment tablet with Snapdragon 695 and quad Dolby Atmos speakers.",
    "imageUrl": "/assets/images/samsung1.jpg",
    "images": [
      "/assets/images/samsung1.jpg",
      "/assets/images/samsung2.jpg",
      "/assets/images/samsung3.jpg"
    ],
    "category": "tablet",
    "stock": 50,
    "rating": 5,
    "reviewsCount": 1890,
    "seller": "Nexus Official Fulfillment",
    "deliveryBy": "Express 24h",
    "specs": {
      "Top Feature": "AI Enhanced"
    },
    "features": [
      "Premium Build",
      "Ultra Fast Loading"
    ]
  },
  {
    "id": "p65",
    "name": "Xiaomi Pad 7",
    "price": 34999,
    "originalPrice": 39548,
    "discount": 13,
    "description": "11.2\" 3K 144Hz tablet with Snapdragon 7+ Gen 3 and 8850mAh.",
    "imageUrl": "/assets/images/xiaomi1.jpg",
    "images": [
      "/assets/images/xiaomi1.jpg",
      "/assets/images/xiaomi2.jpg",
      "/assets/images/xiaomi3.jpg"
    ],
    "category": "tablet",
    "stock": 50,
    "rating": 4.8,
    "reviewsCount": 2383,
    "seller": "Nexus Official Fulfillment",
    "deliveryBy": "Express 24h",
    "specs": {
      "Top Feature": "AI Enhanced"
    },
    "features": [
      "Premium Build",
      "Ultra Fast Loading"
    ]
  },
  {
    "id": "p66",
    "name": "Belkin 3-in-1 MagSafe Charging Stand",
    "price": 8999,
    "originalPrice": 10978,
    "discount": 22,
    "description": "Simultaneously charge iPhone, Apple Watch, and AirPods in one stand.",
    "imageUrl": "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=800&h=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=800&h=800&q=80",
      "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=800&h=800&q=80",
      "https://images.unsplash.com/photo-1585771724684-b4a1db85cb39?auto=format&fit=crop&w=800&h=800&q=80"
    ],
    "category": "accessory",
    "stock": 50,
    "rating": 4.8,
    "reviewsCount": 1685,
    "seller": "Nexus Official Fulfillment",
    "deliveryBy": "Express 24h",
    "specs": {
      "Top Feature": "AI Enhanced"
    },
    "features": [
      "Premium Build",
      "Ultra Fast Loading"
    ]
  },
  {
    "id": "p67",
    "name": "ESR Glass Screen Protector",
    "price": 599,
    "originalPrice": 718,
    "discount": 20,
    "description": "9H tempered glass with easy auto-alignment frame for zero bubbles.",
    "imageUrl": "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=800&h=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=800&h=800&q=80",
      "https://images.unsplash.com/photo-1585771724684-b4a1db85cb39?auto=format&fit=crop&w=800&h=800&q=80",
      "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=800&h=800&q=80"
    ],
    "category": "accessory",
    "stock": 50,
    "rating": 4.9,
    "reviewsCount": 2477,
    "seller": "Nexus Official Fulfillment",
    "deliveryBy": "Express 24h",
    "specs": {
      "Top Feature": "AI Enhanced"
    },
    "features": [
      "Premium Build",
      "Ultra Fast Loading"
    ]
  },
  {
    "id": "p68",
    "name": "Ugreen 100W USB-C Hub 7-in-1",
    "price": 1099,
    "originalPrice": 1499,
    "discount": 26,
    "description": "High-speed 7-in-1 USB-C Hub with 100W Power Delivery and 4K HDMI support.",
    "imageUrl": "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=800&h=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=800&h=800&q=80",
      "https://images.unsplash.com/photo-1585771724684-b4a1db85cb39?auto=format&fit=crop&w=800&h=800&q=80",
      "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=800&h=800&q=80"
    ],
    "category": "accessory",
    "stock": 50,
    "rating": 5,
    "reviewsCount": 2022,
    "seller": "Nexus Official Fulfillment",
    "deliveryBy": "Express 24h",
    "specs": {
      "Top Feature": "AI Enhanced"
    },
    "features": [
      "Premium Build",
      "Ultra Fast Loading"
    ]
  },
  {
    "id": "p69",
    "name": "JBL Flip 7",
    "price": 13999,
    "originalPrice": 15678,
    "discount": 12,
    "description": "Portable IP67 waterproof speaker with Auracast multi-speaker sync and 12-hour battery life.",
    "imageUrl": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&h=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&h=800&q=80",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&h=800&q=80",
      "https://images.unsplash.com/photo-1546435989-70fdcd9e8d8f?auto=format&fit=crop&w=800&h=800&q=80"
    ],
    "category": "audio",
    "stock": 50,
    "rating": 5,
    "reviewsCount": 1852,
    "seller": "Nexus Official Fulfillment",
    "deliveryBy": "Express 24h",
    "specs": {
      "Top Feature": "AI Enhanced"
    },
    "features": [
      "Premium Build",
      "Ultra Fast Loading"
    ]
  },
  {
    "id": "p70",
    "name": "Dell XPS 15 9530",
    "price": 169999,
    "originalPrice": 198898,
    "discount": 17,
    "description": "Creator laptop with OLED 3.5K touch display and RTX 4070 GPU.",
    "imageUrl": "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=1200&h=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=1200&h=800&q=80",
      "https://images.unsplash.com/photo-1593642702749-b7d2a844fe85?auto=format&fit=crop&w=1200&h=800&q=80",
      "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?auto=format&fit=crop&w=1200&h=800&q=80"
    ],
    "category": "laptop",
    "stock": 50,
    "rating": 4.8,
    "reviewsCount": 48,
    "seller": "Nexus Official Fulfillment",
    "deliveryBy": "Express 24h",
    "specs": {
      "Top Feature": "AI Enhanced"
    },
    "features": [
      "Fast Sync",
      "Premium Build",
      "Ultra Fast Loading"
    ]
  },
  {
    "id": "p71",
    "name": "HP Spectre x360 14",
    "price": 212817,
    "originalPrice": 240483,
    "discount": 13,
    "description": "The incredible HP Spectre x360 14.",
    "imageUrl": "https://images.unsplash.com/photo-1496181133206-80ce9b88bbr7?auto=format&fit=crop&w=800&h=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1496181133206-80ce9b88bbr7?auto=format&fit=crop&w=800&h=800&q=80",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&h=800&q=80",
      "https://images.unsplash.com/photo-1541807084-5c52e6a2e2ce?auto=format&fit=crop&w=800&h=800&q=80"
    ],
    "category": "laptop",
    "stock": 50,
    "rating": 4.9,
    "reviewsCount": 1892,
    "seller": "Nexus Official Fulfillment",
    "deliveryBy": "Express 24h",
    "specs": {
      "Top Feature": "AI Enhanced"
    },
    "features": [
      "Premium Build",
      "Ultra Fast Loading"
    ]
  },
  {
    "id": "p72",
    "name": "Lenovo ThinkPad X1 Carbon Gen 12",
    "price": 159999,
    "originalPrice": 188798,
    "discount": 18,
    "description": "Ultra-light business laptop at 1.12kg with MIL-SPEC durability and Intel Core Ultra processors.",
    "imageUrl": "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1200&h=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1200&h=800&q=80",
      "https://images.unsplash.com/photo-1588872657152-44160759080b?auto=format&fit=crop&w=1200&h=800&q=80",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&h=800&q=80"
    ],
    "category": "laptop",
    "stock": 50,
    "rating": 5,
    "reviewsCount": 50,
    "seller": "Nexus Official Fulfillment",
    "deliveryBy": "Express 24h",
    "specs": {
      "Top Feature": "AI Enhanced"
    },
    "features": [
      "Fast Sync",
      "Premium Build",
      "Ultra Fast Loading"
    ]
  },
  {
    "id": "p73",
    "name": "Canon EOS R6 Mark II",
    "price": 234990,
    "originalPrice": 272588,
    "discount": 16,
    "description": "Professional mirrorless with 40fps burst and 4K 60fps uncropped video.",
    "imageUrl": "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&h=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&h=800&q=80",
      "https://images.unsplash.com/photo-1502920822851-7f7d2b68cb22?auto=format&fit=crop&w=800&h=800&q=80",
      "https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?auto=format&fit=crop&w=800&h=800&q=80"
    ],
    "category": "camera",
    "stock": 50,
    "rating": 4.8,
    "reviewsCount": 1970,
    "seller": "Nexus Official Fulfillment",
    "deliveryBy": "Express 24h",
    "specs": {
      "Top Feature": "AI Enhanced"
    },
    "features": [
      "Premium Build",
      "Ultra Fast Loading"
    ]
  },
  {
    "id": "p74",
    "name": "DJI Osmo Pocket 3",
    "price": 54999,
    "originalPrice": 65448,
    "discount": 19,
    "description": "Pocket gimbal camera with 1-inch sensor, 4K 120fps and face tracking.",
    "imageUrl": "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&h=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&h=800&q=80",
      "https://images.unsplash.com/photo-1502920822851-7f7d2b68cb22?auto=format&fit=crop&w=800&h=800&q=80",
      "https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?auto=format&fit=crop&w=800&h=800&q=80"
    ],
    "category": "camera",
    "stock": 50,
    "rating": 4.9,
    "reviewsCount": 2263,
    "seller": "Nexus Official Fulfillment",
    "deliveryBy": "Express 24h",
    "specs": {
      "Top Feature": "AI Enhanced"
    },
    "features": [
      "Premium Build",
      "Ultra Fast Loading"
    ]
  },
  {
    "id": "p75",
    "name": "Sony PlayStation 5 Slim",
    "price": 49990,
    "originalPrice": 60487,
    "discount": 21,
    "description": "Next-gen gaming console with 4K 120fps, ray tracing and 1TB SSD.",
    "imageUrl": "/assets/images/sony1.jpg",
    "images": [
      "/assets/images/sony1.jpg",
      "/assets/images/sony2.jpg",
      "/assets/images/sony3.jpg"
    ],
    "category": "gaming",
    "stock": 50,
    "rating": 4.8,
    "reviewsCount": 2368,
    "seller": "Nexus Official Fulfillment",
    "deliveryBy": "Express 24h",
    "specs": {
      "Top Feature": "AI Enhanced"
    },
    "features": [
      "Premium Build",
      "Ultra Fast Loading"
    ]
  }

].map(p => ({ ...p, reviews: this.generateMockReviews() })) as Product[];
    }

    getProducts(): Observable<Product[]> {
        return this.http.get<Product[]>(`${this.apiUrl}/products`).pipe(
            tap(data => { 
                if (data && data.length > 0) {
                    this.products = data.map(p => ({...p, reviews: p.reviews || this.generateMockReviews()}));
                }
            }),
            catchError(() => of(this.products))
        );
    }

    getProductById(id: string): Observable<Product | undefined> {
        return this.http.get<Product>(`${this.apiUrl}/products/${id}`).pipe(
            tap(product => {
                if (product && !product.reviews) {
                    product.reviews = this.generateMockReviews();
                }
                // sync to local state array
                const idx = this.products.findIndex(p => p.id === id);
                if (idx !== -1) {
                    this.products[idx] = product;
                }
            }),
            catchError(() => of(this.products.find(p => p.id === id)))
        );
    }

    getFeaturedProducts(): Observable<Product[]> {
        return this.http.get<Product[]>(`${this.apiUrl}/products`).pipe(
            tap(data => { if (data && data.length > 0) this.products = data; }),
            catchError(() => of(this.products.slice(0, 4)))
        );
    }

    searchProducts(query: string): Observable<Product[]> {
        if (!query || query.trim() === '') return of([]);
        const lowerQuery = query.toLowerCase();
        const results = this.products.filter(p =>
            p.name.toLowerCase().includes(lowerQuery) ||
            p.description.toLowerCase().includes(lowerQuery)
        );
        return of(results);
    }

    getRecentlyViewed(): Observable<Product[]> {
        if (typeof localStorage === 'undefined') return of([]);
        const saved = localStorage.getItem('recently_viewed');
        if (!saved) return of([]);
        const validIds: string[] = JSON.parse(saved);
        return of(validIds.map(id => this.products.find(p => p.id === id)).filter((p): p is Product => !!p));
    }

    addToRecentlyViewed(product: Product) {
        if (typeof localStorage === 'undefined') return;
        const saved = localStorage.getItem('recently_viewed');
        let ids: string[] = saved ? JSON.parse(saved) : [];
        ids = ids.filter(id => id !== product.id);
        ids.unshift(product.id);
        if (ids.length > 5) ids = ids.slice(0, 5);
        localStorage.setItem('recently_viewed', JSON.stringify(ids));
    }

    addReview(productId: string, review: Review) {
        const product = this.products.find(p => p.id === productId);
        if (product) {
            if (!product.reviews) {
                product.reviews = [];
            }
            product.reviews.unshift(review);

            // Recalculate rating
            const totalRating = product.reviews.reduce((acc, r) => acc + r.rating, 0);
            product.rating = totalRating / product.reviews.length;

            // Recalculate reviewsCount
            product.reviewsCount = product.reviews.length;
        }
    }

    updateStock(productId: string, quantityToDeduct: number) {
        const product = this.products.find(p => p.id === productId);
        if (product) {
            product.stock = Math.max(0, product.stock - quantityToDeduct);
        }
    }

    private generateMockReviews(): Review[] {
        return [
            { id: 'r1', userId: 'u1', userName: 'Alex K.', rating: 5, comment: 'Incredible performance!', date: new Date() },
            { id: 'r2', userId: 'u2', userName: 'Sarah J.', rating: 4, comment: 'Great value for money.', date: new Date() }
        ];
    }
}