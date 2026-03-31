export interface Review {
    id: string;
    userId: string;
    userName: string;
    rating: number; // 1-5
    comment: string;
    date: Date;
    images?: string[];
    helpfulCount?: number;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    discount?: number;
    seller?: string;
    deliveryBy?: string;
    category: 'mobile' | 'accessory' | 'audio' | 'wearable' | 'tablet' | 'gaming' | 'laptop' | 'smarthome' | 'camera' | 'tws';
    imageUrl: string;
    images?: string[];
    stock: number;
    rating: number;
    reviewsCount?: number;
    reviews?: Review[];
    specs?: {
        [key: string]: string;
    };
    features?: string[];
}
