import { Injectable, signal, computed } from '@angular/core';

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'success' | 'alert' | 'info';
    timestamp: number;
    read: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    activeNotifications = signal<Notification[]>([]); // For Toasts
    notifications = signal<Notification[]>([]); // For History Panel

    unreadCount = computed(() => this.notifications().filter(n => !n.read).length);

    constructor() {
        // --- Smart Mock Notifications ---

        // 1. Simulate "Back in Stock" after 30 seconds
        setTimeout(() => {
            this.show('Back in Stock', 'Apple Vision Pro is now available!', 'success');
        }, 15000);

        // 2. Simulate "Price Drop" for a Wishlist item
        setTimeout(() => {
            this.show('Price Drop Alert', 'Sony WH-1000XM5 price dropped by 15%!', 'alert');
        }, 8000);

        // 3. Simulate "Order Update"
        setTimeout(() => {
            this.show('Order Update', 'Your simulated order #A1X9 has been SHIPPED.', 'info');
        }, 30000);
    }

    show(title: string, message: string, type: 'success' | 'alert' | 'info' = 'info') {
        const id = Math.random().toString(36).substr(2, 9);
        const notification: Notification = {
            id, title, message, type,
            timestamp: Date.now(),
            read: false
        };

        // Add to history
        this.notifications.update(n => [notification, ...n]);

        // Add to active toasts
        this.activeNotifications.update(n => [notification, ...n]);

        // Auto dimiss toast only
        setTimeout(() => {
            this.dismissToast(id);
        }, 6000);
    }

    dismissToast(id: string) {
        this.activeNotifications.update(n => n.filter(item => item.id !== id));
    }

    dismiss(id: string) {
        this.dismissToast(id);
    }

    markAsRead(id: string) {
        this.notifications.update(n =>
            n.map(item => item.id === id ? { ...item, read: true } : item)
        );
    }

    markAllAsRead() {
        this.notifications.update(n => n.map(item => ({ ...item, read: true })));
    }

    clearAll() {
        this.notifications.set([]);
    }
}
