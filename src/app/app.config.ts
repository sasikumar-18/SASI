import { ApplicationConfig, importProvidersFrom, LOCALE_ID, DEFAULT_CURRENCY_CODE, provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { environment } from '../environments/environment';
import { LucideAngularModule, ShoppingCart, User, LogIn, LogOut, Home, Package, Search, Trash2, Plus, Minus, Star, ArrowRight, ShieldCheck, Truck, Clock, Mail, Lock, AlertCircle } from 'lucide-angular';
import { registerLocaleData } from '@angular/common';
import localeIn from '@angular/common/locales/en-IN';

registerLocaleData(localeIn);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideHttpClient(),
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    { provide: LOCALE_ID, useValue: 'en-IN' },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'INR' },
    importProvidersFrom(
      LucideAngularModule.pick({
        ShoppingCart, User, LogIn, LogOut, Home, Package, Search, Trash2, Plus, Minus, Star, ArrowRight, ShieldCheck, Truck, Clock, Mail, Lock, AlertCircle
      })
    )
  ]
};
