import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { firstValueFrom, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

@Component({
    selector: 'app-orders',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './orders.html',
    styleUrl: './orders.css'
})
export class Orders implements OnInit {
    private orderService = inject(OrderService);
    private authService = inject(AuthService);
    cartService = inject(CartService);

    orders$: Observable<any[]> = this.authService.user$.pipe(
        switchMap(user => {
            if (user) {
                return this.orderService.getUserOrders(user.uid).pipe(
                    catchError(err => {
                        console.error('CRITICAL: Order retrieval failure.', err);
                        return of([]);
                    })
                );
            }
            return of([]);
        })
    );

    localStatusOverrides: { [key: string]: string } = {};

    ngOnInit() {
        // Orders will be loaded via the orders$ observable
    }

    getDisplayStatus(order: any): string {
        return this.localStatusOverrides[order._id] || order.status || order.orderStatus;
    }

    trackingOrderId: string | null = null;

    // Status Steps for Tracking UI
    private normalSteps = ['Ordered', 'Shipped', 'Delivered'];
    private returnSteps = ['Return Requested', 'Return Approved', 'Refund Initiated', 'Refunded'];

    getTrackingSteps(status: string): string[] {
        if (this.returnSteps.includes(status) || status === 'Returned') {
            return this.returnSteps;
        }
        return this.normalSteps;
    }

    getProgressWidth(status: string): string {
        const steps = this.getTrackingSteps(status);
        const idx = steps.indexOf(status);
        if (idx === -1) return '0%';
        if (idx === steps.length - 1) return '100%';
        return `${(idx / (steps.length - 1)) * 100}%`;
    }

    getStatusColor(status: string): string {
        switch (status.toLowerCase()) {
            case 'ordered': return 'text-blue-500 bg-blue-500/10';
            case 'shipped': return 'text-amber-500 bg-amber-500/10';
            case 'delivered': return 'text-emerald-500 bg-emerald-500/10';
            case 'processing': return 'text-slate-500 bg-slate-500/10';

            // Return/Refund Statuses
            case 'return requested': return 'text-orange-500 bg-orange-500/10';
            case 'return approved': return 'text-indigo-500 bg-indigo-500/10';
            case 'refund initiated': return 'text-violet-500 bg-violet-500/10';
            case 'refunded': return 'text-red-500 bg-red-500/10';
            case 'returned': return 'text-orange-500 bg-orange-500/10';

            default: return 'text-slate-500 bg-slate-500/10';
        }
    }

    trackOrder(orderId: string) {
        // Toggle tracking view
        this.trackingOrderId = this.trackingOrderId === orderId ? null : orderId;
    }

    isStepCompleted(currentStatus: string, step: string): boolean {
        // Normal Flow
        const normalFlow = ['Ordered', 'Shipped', 'Delivered'];

        // Return Flow
        const returnFlow = ['Return Requested', 'Return Approved', 'Refund Initiated', 'Refunded'];

        if (returnFlow.includes(currentStatus)) {
            // If we are in return flow, check against return steps
            const currentIdx = returnFlow.indexOf(currentStatus);
            const stepIdx = returnFlow.indexOf(step);
            if (stepIdx !== -1) return stepIdx <= currentIdx;
        }

        const currentIdx = normalFlow.indexOf(currentStatus);
        const stepIdx = normalFlow.indexOf(step);

        if (currentIdx === -1) return step === 'Ordered'; // Default to first if unknown
        return stepIdx <= currentIdx;
    }

    showReturnReasonModal = false;
    returningOrderId: string | null = null;
    returnReason = '';
    returnReasonDetails = '';

    openReturnModal(orderId: string) {
        this.returningOrderId = orderId;
        this.returnReason = '';
        this.returnReasonDetails = '';
        this.showReturnReasonModal = true;
    }

    closeReturnModal() {
        this.showReturnReasonModal = false;
        this.returningOrderId = null;
    }

    submitReturn() {
        if (!this.returningOrderId || !this.returnReason) return;
        const orderId = this.returningOrderId;
        
        const status = 'Return Requested';
        this.localStatusOverrides[orderId] = status;
        this.orderService.updateOrderStatus(orderId, status).subscribe();

        // Simulate Admin Approval after 3 seconds
        setTimeout(() => {
            if (this.localStatusOverrides[orderId] === 'Return Requested') {
                const approvedStatus = 'Return Approved';
                this.localStatusOverrides[orderId] = approvedStatus;
                this.orderService.updateOrderStatus(orderId, approvedStatus).subscribe();
            }
        }, 3000);

        // Simulate Refund after 6 seconds
        setTimeout(() => {
            if (this.localStatusOverrides[orderId] === 'Return Approved') {
                const refundedStatus = 'Refund Initiated';
                this.localStatusOverrides[orderId] = refundedStatus;
                this.orderService.updateOrderStatus(orderId, refundedStatus).subscribe();

                setTimeout(() => {
                    if (this.localStatusOverrides[orderId] === 'Refund Initiated') {
                        this.localStatusOverrides[orderId] = 'Refunded';
                    }
                }, 3000);
            }
        }, 6000);

        this.closeReturnModal();
    }

    cancelOrder(orderId: string) {
        if (confirm('Are you sure you want to cancel this order?\n\nThis action is irreversible.')) {
            const status = 'Refunded';
            this.localStatusOverrides[orderId] = status;
            this.orderService.updateOrderStatus(orderId, status).subscribe();
            alert(`Order [${orderId.slice(-6).toUpperCase()}] has been cancelled.\n\nRefund initiated. Status updated to REFUNDED.`);
        }
    }

    buyAgain(order: any) {
        // Mock product reconstruction for cart injection
        order.items.forEach((item: any) => {
            const mockProduct = {
                id: item.productId,
                name: item.name,
                price: item.price,
                imageUrl: item.imageUrl,
                stock: 99, 
                category: 'mobile', 
                description: '',
                rating: 5
            } as any;
            this.cartService.addToCart(mockProduct);
        });
        alert(`Hardware configurations from order [${order._id.slice(-6).toUpperCase()}] synchronized to your vault.\n`);
    }

    advanceOrder(orderId: string, currentStatus: string) {
        const flow = ['Ordered', 'Shipped', 'Delivered'];
        const currentIdx = flow.indexOf(currentStatus) === -1 ? 0 : flow.indexOf(currentStatus);

        let nextStatus = 'Ordered';
        if (currentIdx < flow.length - 1) {
            nextStatus = flow[currentIdx + 1];
        }

        this.localStatusOverrides[orderId] = nextStatus;
        this.orderService.updateOrderStatus(orderId, nextStatus).subscribe({
            next: () => console.log('Status updated in backend'),
            error: (err) => console.error('Failed to sync status', err)
        });
    }

    printInvoice(order: any) {
        const printContent = `
            NEXUS DIGITAL RECEIPT
            ---------------------
            Order ID: ${order._id}
            Date: ${new Date(order.createdAt).toLocaleDateString()}
            
            Customer: ${order.shippingAddress.name}
            Address: ${order.shippingAddress.address}, ${order.shippingAddress.city}
            
            Items:
            ${order.items.map((i: any) => `- ${i.name} (x${i.quantity}): ₹${i.price}`).join('\n')}
            
            Total: ₹${order.totalAmount}
            Payment: ${order.paymentMethod}
            
            THANK YOU FOR CHOOSING THE NEXUS.
        `;
        const win = window.open('', '_blank');
        if (win) {
            win.document.write(`<pre>${printContent}</pre>`);
            win.document.close();
            win.print();
        }
    }
}
