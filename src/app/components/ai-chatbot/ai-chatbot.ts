import { Component, inject, signal, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { NexusCardService } from '../../services/nexus-card.service';
import { CartService } from '../../services/cart.service';
import { ExchangeService } from '../../services/exchange.service';
import { LucideAngularModule } from 'lucide-angular';
import { Product } from '../../models/product.model';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    type?: 'text' | 'comparison' | 'recommendation';
    data?: any;
}

@Component({
    selector: 'app-ai-chatbot',
    standalone: true,
    imports: [CommonModule, FormsModule, LucideAngularModule, RouterModule],
    templateUrl: './ai-chatbot.html',
    styleUrl: './ai-chatbot.css'
})
export class AIChatbot implements AfterViewChecked {
    private productService = inject(ProductService);
    private nexusCardService = inject(NexusCardService);
    private cartService = inject(CartService);
    private exchangeService = inject(ExchangeService);

    @ViewChild('scrollMe') private myScrollContainer!: ElementRef;

    isOpen = signal(false);
    isTyping = signal(false);
    userInput = signal('');

    messages = signal<Message[]>([
        {
            role: 'assistant',
            content: 'Nexus AI Initialized. I am your specialized hardware analyst. How can I optimize your acquisition experience today?',
            timestamp: new Date()
        }
    ]);

    ngAfterViewChecked() {
        this.scrollToBottom();
    }

    toggleChat() {
        this.isOpen.update(v => !v);
    }

    scrollToBottom(): void {
        try {
            this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        } catch (err) { }
    }

    async sendMessage() {
        const input = this.userInput().trim();
        if (!input) return;

        // User Message
        this.messages.update(m => [...m, {
            role: 'user',
            content: input,
            timestamp: new Date()
        }]);

        this.userInput.set('');
        this.isTyping.set(true);

        // Process Response
        setTimeout(async () => {
            const response = await this.generateResponse(input);
            this.messages.update(m => [...m, response]);
            this.isTyping.set(false);
        }, 1500);
    }

    private async generateResponse(input: string): Promise<Message> {
        const query = input.toLowerCase();

        // 1. Comparison Logic
        if (query.includes('compare') || query.includes('vs')) {
            return this.handleComparison(query);
        }

        // 2. Nexus Card Queries
        if (query.includes('card') || query.includes('emi') || query.includes('nexus card')) {
            return {
                role: 'assistant',
                content: 'The Nexus Card allows for instant EMI acquisition at 14% p.a. You can apply in the "Nexus Card" section of your dashboard. Approval is near-instant for qualified entities.',
                timestamp: new Date()
            };
        }

        // 3. Tax Queries
        if (query.includes('tax') || query.includes('fees')) {
            return {
                role: 'assistant',
                content: 'Institutional tax has been adjusted to 5% across all hardware segments to facilitate wider adoption of elite gear.',
                timestamp: new Date()
            };
        }

        // 4. Shipping/Delivery
        if (query.includes('shipping') || query.includes('delivery') || query.includes('arrive')) {
            return {
                role: 'assistant',
                content: 'Transit are optimized for speed. Mobiles and Accessories typically arrive within 1-3 digital cycles (days). All transit is currently COMPLIMENTARY.',
                timestamp: new Date()
            };
        }

        // 5. Exchange Queries
        if (query.includes('exchange') || query.includes('old phone') || query.includes('trade')) {
            return {
                role: 'assistant',
                content: 'The Nexus Exchange allows trade-ins for hardware credits up to â‚¹25,000. You can activate this directly on any mobile product page by selecting the "Exchange Offer" badge.',
                timestamp: new Date()
            };
        }

        // 5. Product Search / Recommendation
        if (query.includes('best') || query.includes('recommend') || query.includes('top')) {
            return this.handleRecommendation(query);
        }

        // Default Response
        return {
            role: 'assistant',
            content: 'I have analyzed your query. I can assist with Exchange (Save up to â‚¹25k), Tax (fixed at 5%), Shipping, and Technical Comparison between hardware units.',
            timestamp: new Date()
        };
    }

    private handleComparison(query: string): Message {
        // Simple extraction of product names (this is a mock/heuristic AI)
        // In a real app, this would call a search API
        const productsMatch = this.extractProductNames(query);

        if (productsMatch.length < 2) {
            return {
                role: 'assistant',
                content: 'To initiate comparison , please specify at least two hardware units. For example: "Compare iPhone 15 and Galaxy S24".',
                timestamp: new Date()
            };
        }

        return {
            role: 'assistant',
            content: `I am cross-referencing ${productsMatch.join(' and ')}. iPhone models generally lead in computational efficiency, while Samsung flagship units dominate in display luminosity and versatile optics. Which specific metric should I prioritize?`,
            timestamp: new Date(),
            type: 'comparison',
            data: productsMatch
        };
    }

    private handleRecommendation(query: string): Message {
        return {
            role: 'assistant',
            content: 'Based on current market sentiment and hardware benchmarks, the "iPhone 16 Pro Max" is the recommended for computational power, while the "Nothing Phone 3a Lite" offers the highest value-to-cost ratio in our repository.',
            timestamp: new Date(),
            type: 'recommendation'
        };
    }

    private extractProductNames(query: string): string[] {
        const brands = ['iphone', 'samsung', 'google', 'pixel', 'oneplus', 'xiaomi', 'nothing', 'sony', 'asus', 'motorola'];
        const found: string[] = [];
        brands.forEach(b => {
            if (query.includes(b)) found.push(b.charAt(0).toUpperCase() + b.slice(1));
        });
        return [...new Set(found)];
    }
}