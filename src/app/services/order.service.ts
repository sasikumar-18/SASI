import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface OrderRequest {
    userId: string;
    items: any[];
    totalAmount: number;
    shippingAddress: {
        name: string;
        address: string;
        city: string;
        state: string;
        zip: string;
        phone: string;
    };
    paymentMethod: string;
    createdAt?: number | string;
    orderStatus?: string;
    trackingNumber?: string;
    trackingHistory?: any[];
    taxAmount?: number;
    shippingCost?: number;
    notes?: string;
}

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:5000/api/orders';

    placeOrder(orderData: OrderRequest): Observable<any> {
        return this.http.post(this.apiUrl, orderData).pipe(
            catchError(() => of({ orderId: 'NEXUS-' + Math.random().toString(36).substring(2, 10).toUpperCase(), status: 'Paid via Fallback Mock' }))
        );
    }

    getUserOrders(userId: string): Observable<any[]> {
        const mockOrder = {
            _id: 'NEXUS-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
            items: [{ name: 'System Mock Order', quantity: 1, price: 0, imageUrl: 'https://placehold.co/100x100/101010/white?text=Nexus' }],
            totalAmount: 0,
            orderStatus: 'Ordered',
            shippingAddress: {
                name: 'System Administrator',
                address: 'Nexus Datacenter, Sector 4',
                city: 'Cyberabad',
                state: 'TS',
                zip: '500081',
                phone: '+91 98765 43210'
            },
            createdAt: new Date().toISOString()
        };

        return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`).pipe(
            map(orders => [mockOrder, ...orders]),
            catchError(() => of([mockOrder]))
        );
    }

    updateOrderStatus(orderId: string, status: string): Observable<any> {
        return this.http.patch(`${this.apiUrl}/${orderId}/status`, { status }).pipe(
            catchError(() => of({ _id: orderId, orderStatus: status }))
        );
    }

    // Admin Protocol
    getAllOrders(): Observable<any[]> {
        return this.http.get<any[]>('http://localhost:5000/api/admin/orders');
    }
}
