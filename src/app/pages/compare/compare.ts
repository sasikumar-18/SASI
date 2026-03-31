import { Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CompareService } from '../../services/compare.service';
import { CartService } from '../../services/cart.service';

@Component({
    selector: 'app-compare',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './compare.html',
    styleUrl: './compare.css'
})
export class Compare {
    compareService = inject(CompareService);
    cartService = inject(CartService);

    generatingAnalysis = signal(false);
    aiAnalysis = signal<{ summary: string; winner: string; points: string[] } | null>(null);

    constructor() {
        // Automatically regenerate analysis when compare items change
        effect(() => {
            const items = this.compareService.items();
            if (items.length >= 2) {
                this.runAIAnalysis();
            } else {
                this.aiAnalysis.set(null);
            }
        }, { allowSignalWrites: true });
    }

    async runAIAnalysis() {
        this.generatingAnalysis.set(true);
        this.aiAnalysis.set(null);

        // Simulate AI thinking time
        await new Promise(resolve => setTimeout(resolve, 2000));

        const products = this.compareService.items();
        if (products.length < 2) {
            this.generatingAnalysis.set(false);
            return;
        }

        // Simple heuristic-based "AI" logic
        const analysis = this.generateInsights(products);
        this.aiAnalysis.set(analysis);
        this.generatingAnalysis.set(false);
    }

    private generateInsights(products: any[]) {
        const sortedByPrice = [...products].sort((a, b) => a.price - b.price);
        const sortedByRating = [...products].sort((a, b) => b.rating - a.rating);

        const cheapest = sortedByPrice[0];
        const premium = sortedByPrice[products.length - 1];
        const bestRated = sortedByRating[0];

        let summary = "";
        let winner = bestRated.name;
        let points: string[] = [];

        if (products.length === 2) {
            const [p1, p2] = products;
            summary = `Comparing ${p1.name} and ${p2.name}. `;
            if (Math.abs(p1.price - p2.price) > 10000) {
                summary += `There is a significant price gap of ₹${Math.abs(p1.price - p2.price).toLocaleString()}. `;
                points.push(`${cheapest.name} offers superior value for budget-conscious users.`);
                points.push(`${premium.name} is positioned as a flagship elite experience.`);
            } else {
                summary += `Both devices are in a similar price bracket, making the choice about specific features. `;
                points.push(`${bestRated.name} leads in user satisfaction with a ${bestRated.rating}/5 rating.`);
            }
        } else {
            summary = `Analyzing a set of ${products.length} devices. `;
            points.push(`${cheapest.name} is the most accessible entry point.`);
            points.push(`${premium.name} represents the peak of technical specifications in this group.`);
            points.push(`${bestRated.name} is the overall crowd favorite.`);
        }

        // Add spec-based points
        products.forEach(p => {
            if (p.specs?.Processor?.toLowerCase().includes('snapdragon') || p.specs?.Processor?.toLowerCase().includes('bionic')) {
                points.push(`${p.name} features a high-performance compute engine suitable for heavy workloads.`);
            }
            if (p.specs?.Battery?.toLowerCase().includes('5000') || p.specs?.Battery?.toLowerCase().includes('4500')) {
                points.push(`${p.name} provides extended operational endurance.`);
            }
        });

        return {
            summary,
            winner,
            points: [...new Set(points)].slice(0, 4) // Unique points, max 4
        };
    }

    getFeatureList(): string[] {
        // Collect all unique features from all products
        const products = this.compareService.items();
        const features = new Set<string>();

        products.forEach(p => {
            if (p.specs) {
                Object.keys(p.specs).forEach(key => features.add(key));
            }
        });

        return Array.from(features);
    }

    addToCart(product: any) {
        this.cartService.addToCart(product);
    }
}
