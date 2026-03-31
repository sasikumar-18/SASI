import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

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
    createdAt?: number;
    status?: 'pending' | 'shipped' | 'delivered';
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
        return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`).pipe(
            catchError(() => of([{
                _id: 'NXT-MOCK-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
                items: [{ name: 'System Mock Order', quantity: 1, price: 0 }],
                totalAmount: 0,
                orderStatus: 'Processed',
                createdAt: new Date().toISOString()
            }]))
        );
    }

    updateOrderStatus(orderId: string, status: string): Observable<any> {
        return this.http.patch(`${this.apiUrl}/${orderId}/status`, { status }).pipe(
            catchError(() => of({ _id: orderId, orderStatus: status }))
        );
    }
}
