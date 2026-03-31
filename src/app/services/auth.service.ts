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
    usedCoupons: string[];
    createdAt: number;
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
            const stored = localStorage.getItem('user');
            return stored ? JSON.parse(stored) : null;
        }
        return null;
    }

    login(email: string, pass: string): Observable<any> {
        const normalizedEmail = email.toLowerCase().trim();
        return this.http.post(`${this.apiUrl}/login`, { email: normalizedEmail, password: pass }).pipe(
            tap((res: any) => {
                if (res.user) {
                    this.setSession(res.user);
                }
            }),
            catchError(() => {
                const mockUser = {
                    uid: 'mock-' + Math.random().toString(36).substring(2, 10),
                    email: normalizedEmail,
                    displayName: normalizedEmail.split('@')[0],
                    role: 'user',
                    usedCoupons: []
                };
                this.setSession(mockUser);
                return of({ message: 'Fallback Mock Login successful', user: mockUser });
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
            }),
            catchError(() => {
                const mockUser = {
                    uid: 'mock-' + Math.random().toString(36).substring(2, 10),
                    email: normalizedEmail,
                    displayName: name || normalizedEmail.split('@')[0],
                    role: 'user',
                    usedCoupons: []
                };
                this.setSession(mockUser);
                return of({ message: 'Fallback Mock Registration successful', user: mockUser });
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
}
