import { Injectable, signal, computed } from '@angular/core';

export interface CardApplication {
    status: 'none' | 'pending' | 'approved' | 'rejected';
    creditLimit: number;
    cardNumber?: string;
    appliedDate?: number;
}

@Injectable({
    providedIn: 'root'
})
export class NexusCardService {
    private storageKey = 'nexus_card_status';

    application = signal<CardApplication>(this.loadApplication());

    isApproved = computed(() => this.application().status === 'approved');

    private loadApplication(): CardApplication {
        if (typeof localStorage !== 'undefined') {
            const saved = localStorage.getItem(this.storageKey);
            if (saved) return JSON.parse(saved);
        }
        return { status: 'none', creditLimit: 0 };
    }

    apply(data: any) {
        this.application.set({ status: 'pending', creditLimit: 0, appliedDate: Date.now() });
        this.save();

        // Simulate instant approval after 3 seconds
        setTimeout(() => {
            const isSuccess = Math.random() > 0.3; // 70% approval rate
            if (isSuccess) {
                this.application.set({
                    status: 'approved',
                    creditLimit: 50000 + Math.floor(Math.random() * 150000),
                    cardNumber: 'XXXX-XXXX-XXXX-' + Math.floor(1000 + Math.random() * 9000),
                    appliedDate: Date.now()
                });
            } else {
                this.application.set({ status: 'rejected', creditLimit: 0 });
            }
            this.save();
        }, 3000);
    }

    private save() {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(this.storageKey, JSON.stringify(this.application()));
        }
    }

    calculateEMI(amount: number, months: number): number {
        const interestRate = 0.14; // 14% p.a.
        const monthlyRate = interestRate / 12;
        const emi = (amount * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
        return Math.round(emi);
    }
}
