import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { ProductList } from './pages/product-list/product-list';
import { ProductDetail } from './pages/product-detail/product-detail';
import { Cart } from './pages/cart/cart';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Checkout } from './pages/checkout/checkout';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'products', component: ProductList },
    { path: 'products/:id', component: ProductDetail },
    { path: 'cart', component: Cart },
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    { path: 'checkout', component: Checkout },
    { path: 'orders', loadComponent: () => import('./pages/orders/orders').then(m => m.Orders) },
    { path: 'wishlist', loadComponent: () => import('./pages/wishlist/wishlist').then(m => m.Wishlist) },
    { path: 'compare', loadComponent: () => import('./pages/compare/compare').then(m => m.Compare) },
    { path: 'support', loadComponent: () => import('./pages/support/support').then(m => m.Support) },
    { path: 'nexus-card', loadComponent: () => import('./pages/nexus-card-apply/nexus-card-apply').then(m => m.NexusCardApply) },
    { path: 'admin', loadComponent: () => import('./pages/admin/admin').then(m => m.Admin) },
    { path: '**', redirectTo: '' }
];
