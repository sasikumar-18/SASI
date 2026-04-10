import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { OrderService } from '../../services/order.service';
import { UserService } from '../../services/user.service';
import { Product } from '../../models/product.model';
import { LucideAngularModule } from 'lucide-angular';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-admin',
    standalone: true,
    imports: [CommonModule, FormsModule, LucideAngularModule],
    templateUrl: './admin.html',
    styles: [`
        .ease-vault { transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); }
    `]
})
export class Admin implements OnInit {
    private productService = inject(ProductService);
    private orderService = inject(OrderService);
    private userService = inject(UserService);

    activeTab: 'products' | 'orders' | 'users' = 'products';
    isLoaded = false;
    
    // Product Management
    products: Product[] = [];
    showProductModal = false;
    isEditing = false;
    currentProduct: Partial<Product> = {};

    // Order Management
    orders: any[] = [];
    
    // User Management
    users: any[] = [];

    ngOnInit() {
        this.loadData();
        setTimeout(() => this.isLoaded = true, 500);
    }

    loadData() {
        this.productService.getProducts().subscribe(p => this.products = p);
        this.orderService.getAllOrders().subscribe(o => this.orders = o);
        this.userService.getAllUsers().subscribe(u => this.users = u);
    }

    // Product Command Methods
    openAddProduct() {
        this.isEditing = false;
        this.currentProduct = {
            name: '', price: 0, stock: 50, category: 'mobile', 
            description: '', imageUrl: '', rating: 5, reviewsCount: 0
        };
        this.showProductModal = true;
    }

    openEditProduct(product: Product) {
        this.isEditing = true;
        this.currentProduct = { ...product };
        this.showProductModal = true;
    }

    saveProduct() {
        if (this.isEditing) {
            this.productService.updateProduct(this.currentProduct.id!, this.currentProduct).subscribe(() => {
                this.loadData();
                this.showProductModal = false;
            });
        } else {
            this.productService.addProduct(this.currentProduct as Product).subscribe(() => {
                this.loadData();
                this.showProductModal = false;
            });
        }
    }

    deleteProduct(id: string) {
        if (confirm('Decommission this hardware from the Nexus Repository?')) {
            this.productService.deleteProduct(id).subscribe(() => this.loadData());
        }
    }

    updateOrderStatus(orderId: string, status: string) {
        this.orderService.updateOrderStatus(orderId, status).subscribe(() => this.loadData());
    }

    getRoleBadgeClass(role: string) {
        return role === 'admin' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500';
    }

    getStats() {
        return {
            inventory: this.products.length,
            revenue: this.orders.reduce((acc, o) => acc + (o.totalAmount || 0), 0),
            users: this.users.length,
            activeOrders: this.orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length
        };
    }
}
