import { Injectable, signal, computed } from '@angular/core';

export interface ExchangeDevice {
    id: string;
    brand: string;
    model: string;
    baseValue: number;
}

@Injectable({
    providedIn: 'root'
})
export class ExchangeService {
    // Current active exchange in the session
    selectedDevice = signal<ExchangeDevice | null>(null);
    isExchangeActive = signal(false);

    // Mock Database of popular devices for exchange
    popularDevices: ExchangeDevice[] = [
        { id: 'ex1', brand: 'Apple', model: 'iPhone 13', baseValue: 25000 },
        { id: 'ex2', brand: 'Apple', model: 'iPhone 12', baseValue: 18000 },
        { id: 'ex3', brand: 'Samsung', model: 'Galaxy S22', baseValue: 22000 },
        { id: 'ex4', brand: 'Samsung', model: 'Galaxy S21', baseValue: 15000 },
        { id: 'ex5', brand: 'Google', model: 'Pixel 7', baseValue: 20000 },
        { id: 'ex6', brand: 'OnePlus', model: '9 Pro', baseValue: 12000 }
    ];

    getValuation(deviceId: string, condition: 'perfect' | 'good' | 'average'): number {
        const device = this.popularDevices.find(d => d.id === deviceId);
        if (!device) return 0;

        const multipliers = {
            'perfect': 1.0,
            'good': 0.8,
            'average': 0.6
        };

        return Math.floor(device.baseValue * multipliers[condition]);
    }

    applyExchange(device: ExchangeDevice, value: number) {
        this.selectedDevice.set({ ...device, baseValue: value });
        this.isExchangeActive.set(true);
    }

    reset() {
        this.selectedDevice.set(null);
        this.isExchangeActive.set(false);
    }
}
