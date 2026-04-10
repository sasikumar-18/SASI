import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface UserProfile {
    uid: string;
    email: string;
    displayName: string;
    role: 'admin' | 'user';
    phone?: string;
    profilePic?: string;
    bio?: string;
    nexusPoints?: number; // Legacy, keeping for compatibility
    walletBalance: number;
    superCoins: number;
    giftCards: { code: string; balance: number }[];
    savedAddresses?: any[];
    usedCoupons: string[];
    createdAt: number | string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);
    private router = inject(Router);
    private apiUrl = 'http://localhost:5000/api/auth';

    currentUser = signal<any | null>(this.getUserFromStorage());
    userProfile = signal<UserProfile | null>(this.getUserFromStorage());

    private userSubject = new BehaviorSubject<any | null>(this.getUserFromStorage());
    user$ = this.userSubject.asObservable();

    constructor() { }

    private getUserFromStorage() {
        if (typeof localStorage !== 'undefined') {
            try {
                const stored = localStorage.getItem('user');
                return stored ? JSON.parse(stored) : null;
            } catch (e) {
                console.error('Session restoration breached:', e);
                localStorage.removeItem('user');
                return null;
            }
        }
        return null;
    }

    login(email: string, pass: string): Observable<any> {
        const normalizedEmail = email.toLowerCase().trim();
        return this.http.post(`${this.apiUrl}/login`, { email: normalizedEmail, password: pass }).pipe(
            tap((res: any) => {
                if (res.user) {
                    // Force inject 'admin' for specialized test email
                    if (normalizedEmail === 'admin@admin.com') res.user.role = 'admin';
                    this.setSession(res.user);
                }
            })
        );
    }

    register(email: string, pass: string, name: string): Observable<any> {
        const normalizedEmail = email.toLowerCase().trim();
        return this.http.post(`${this.apiUrl}/register`, { email: normalizedEmail, password: pass, name }).pipe(
            tap((res: any) => {
                if (res.user) {
                    this.setSession(res.user);
                }
            })
        );
    }

    private setSession(user: any) {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('user', JSON.stringify(user));
        }
        this.currentUser.set(user);
        this.userProfile.set(user);
        this.userSubject.next(user);
    }

    logout() {
        if (typeof localStorage !== 'undefined') {
            localStorage.removeItem('user');
        }
        this.currentUser.set(null);
        this.userProfile.set(null);
        this.userSubject.next(null);
        this.router.navigate(['/']);
    }

    addUsedCoupon(code: string) {
        const current = this.userProfile();
        if (current) {
            const updated = {
                ...current,
                usedCoupons: [...(current.usedCoupons || []), code.toUpperCase()]
            };
            this.setSession(updated);
        }
    }

    updateWallet(amount: number) {
        const current = this.userProfile();
        if (current) {
            const updated = { ...current, walletBalance: (current.walletBalance || 0) + amount };
            this.setSession(updated);
            this.syncFinancialsToCloud(updated);
        }
    }

    updateSuperCoins(amount: number) {
        const current = this.userProfile();
        if (current) {
            const updated = { ...current, superCoins: (current.superCoins || 0) + amount };
            this.setSession(updated);
            this.syncFinancialsToCloud(updated);
        }
    }

    private syncFinancialsToCloud(profile: UserProfile) {
        this.http.patch(`http://localhost:5000/api/users/${profile.uid}/financials`, {
            walletBalance: profile.walletBalance,
            superCoins: profile.superCoins,
            giftCards: profile.giftCards
        }).subscribe();
    }
}
