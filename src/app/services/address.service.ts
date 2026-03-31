import { Injectable, signal } from '@angular/core';

export interface Address {
    id: string;
    label: string; // e.g., 'Home', 'Office'
    fullName: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
    email: string;
    isDefault: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class AddressService {
    private storageKey = 'user_addresses';
    addresses = signal<Address[]>(this.loadAddresses());

    constructor() { }

    private loadAddresses(): Address[] {
        if (typeof localStorage !== 'undefined') {
            const saved = localStorage.getItem(this.storageKey);
            if (saved) return JSON.parse(saved);
        }

        // Return dummy default if empty for demo
        return [{
            id: 'addr_1',
            label: 'Home Base',
            fullName: 'Tech Enthusiast',
            street: '123 Innovation Blvd',
            city: 'Silicon Valley',
            state: 'CA',
            zip: '94043',
            phone: '555-0199',
            email: 'user@nexus.com',
            isDefault: true
        }];
    }

    private saveAddresses(addrs: Address[]) {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(this.storageKey, JSON.stringify(addrs));
        }
        this.addresses.set(addrs);
    }

    addAddress(addr: Omit<Address, 'id'>) {
        const newAddr = { ...addr, id: Math.random().toString(36).substr(2, 9) };
        const current = this.addresses();

        if (newAddr.isDefault) {
            // If new is default, unmark others
            current.forEach(a => a.isDefault = false);
        }

        this.saveAddresses([...current, newAddr]);
    }

    updateAddress(id: string, updates: Partial<Address>) {
        let current = this.addresses();

        if (updates.isDefault) {
            current = current.map(a => ({ ...a, isDefault: false }));
        }

        const updated = current.map(a => a.id === id ? { ...a, ...updates } : a);
        this.saveAddresses(updated);
    }

    deleteAddress(id: string) {
        this.saveAddresses(this.addresses().filter(a => a.id !== id));
    }

    getAddress(id: string) {
        return this.addresses().find(a => a.id === id);
    }
}
