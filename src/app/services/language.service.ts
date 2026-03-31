import { Injectable, signal, computed } from '@angular/core';

export type Language = 'en' | 'te' | 'ta' | 'hi';

@Injectable({
    providedIn: 'root'
})
export class LanguageService {
    currentLang = signal<Language>('en');

    private dictionaries: Record<Language, Record<string, string>> = {
        en: {
            'NAV_HOME': 'Home',
            'NAV_CATALOG': 'Catalog',
            'NAV_COMPARE': 'Compare',
            'NAV_EXCHANGE': 'Exchange',
            'NAV_ORDERS': 'Order History',
            'NAV_SEARCH': 'Search ...',
            'NAV_LOGIN': 'Join Vault',
            'NAV_LOGOUT': 'Terminate ',
            'NAV_ACC': 'Access ',
            'BTN_ADD_CART': 'Add to Bag',
            'LBL_PRICE': 'Price',
            'LBL_RATING': 'Rating',
            'LBL_HIGHLIGHTS': 'Highlights'
        },
        te: {
            'NAV_HOME': 'Ã Â°Â¹Ã Â±â€¹Ã Â°Â®Ã Â±Â', // Home
            'NAV_CATALOG': 'Ã Â°â€¢Ã Â±ÂÃ Â°Â¯Ã Â°Â¾Ã Â°Å¸Ã Â°Â²Ã Â°Â¾Ã Â°â€”Ã Â±Â', // Catalog
            'NAV_COMPARE': 'Ã Â°ÂªÃ Â±â€¹Ã Â°Â²Ã Â±ÂÃ Â°Å¡Ã Â°â€šÃ Â°Â¡Ã Â°Â¿', // Compare
            'NAV_EXCHANGE': 'Ã Â°Â®Ã Â°Â¾Ã Â°Â°Ã Â±ÂÃ Â°ÂªÃ Â°Â¿Ã Â°Â¡Ã Â°Â¿', // Exchange
            'NAV_ORDERS': 'Ã Â°â€ Ã Â°Â°Ã Â±ÂÃ Â°Â¡Ã Â°Â°Ã Â±Â Ã Â°Å¡Ã Â°Â°Ã Â°Â¿Ã Â°Â¤Ã Â±ÂÃ Â°Â°', // Order History
            'NAV_SEARCH': 'Ã Â°ÂµÃ Â±â€ Ã Â°Â¤Ã Â°â€¢Ã Â°â€šÃ Â°Â¡Ã Â°Â¿...', // Search...
            'NAV_LOGIN': 'Ã Â°Â²Ã Â°Â¾Ã Â°â€”Ã Â°Â¿Ã Â°Â¨Ã Â±Â Ã Â°â€¦Ã Â°ÂµÃ Â±ÂÃ Â°ÂµÃ Â°â€šÃ Â°Â¡Ã Â°Â¿', // Join/Login
            'NAV_LOGOUT': 'Ã Â°Â²Ã Â°Â¾Ã Â°â€”Ã Â±Â Ã Â°â€¦Ã Â°ÂµÃ Â±ÂÃ Â°Å¸Ã Â±Â', // Logout
            'NAV_ACC': 'Ã Â°Â¯Ã Â°Â¾Ã Â°â€¢Ã Â±ÂÃ Â°Â¸Ã Â±â€ Ã Â°Â¸Ã Â±Â Ã Â°ÂªÃ Â±ÂÃ Â°Â°Ã Â±â€¹Ã Â°Å¸Ã Â±â€¹Ã Â°â€¢Ã Â°Â¾Ã Â°Â²Ã Â±Â',
            'BTN_ADD_CART': 'Ã Â°Â¬Ã Â±ÂÃ Â°Â¯Ã Â°Â¾Ã Â°â€”Ã Â±ÂÃ¢â‚¬Å’Ã Â°Â²Ã Â±â€¹ Ã Â°Å¡Ã Â±â€¡Ã Â°Â°Ã Â±ÂÃ Â°Å¡Ã Â±Â', // Add to bag
            'LBL_PRICE': 'Ã Â°Â§Ã Â°Â°', // Price
            'LBL_RATING': 'Ã Â°Â°Ã Â±â€¡Ã Â°Å¸Ã Â°Â¿Ã Â°â€šÃ Â°â€”Ã Â±Â', // Rating
            'LBL_HIGHLIGHTS': 'Ã Â°Â®Ã Â±ÂÃ Â°â€“Ã Â±ÂÃ Â°Â¯Ã Â°Â¾Ã Â°â€šÃ Â°Â¶Ã Â°Â¾Ã Â°Â²Ã Â±Â' // Highlights
        },
        ta: {
            'NAV_HOME': 'Ã Â®Â®Ã Â¯ÂÃ Â®â€¢Ã Â®ÂªÃ Â¯ÂÃ Â®ÂªÃ Â¯Â', // Home
            'NAV_CATALOG': 'Ã Â®Â®Ã Â¯ÂÃ Â®Â´Ã Â¯Â Ã Â®ÂªÃ Â®Å¸Ã Â¯ÂÃ Â®Å¸Ã Â®Â¿Ã Â®Â¯Ã Â®Â²Ã Â¯Â', // Catalog
            'NAV_COMPARE': 'Ã Â®â€™Ã Â®ÂªÃ Â¯ÂÃ Â®ÂªÃ Â®Â¿Ã Â®Å¸Ã Â¯Â', // Compare
            'NAV_EXCHANGE': 'Ã Â®ÂªÃ Â®Â°Ã Â®Â¿Ã Â®Â®Ã Â®Â¾Ã Â®Â±Ã Â¯ÂÃ Â®Â±Ã Â®Â®Ã Â¯Â', // Exchange
            'NAV_ORDERS': 'Ã Â®â€ Ã Â®Â°Ã Â¯ÂÃ Â®Å¸Ã Â®Â°Ã Â¯Â Ã Â®ÂµÃ Â®Â°Ã Â®Â²Ã Â®Â¾Ã Â®Â±Ã Â¯Â', // Order History
            'NAV_SEARCH': 'Ã Â®Â¤Ã Â¯â€¡Ã Â®Å¸Ã Â¯ÂÃ Â®â€¢...', // Search...
            'NAV_LOGIN': 'Ã Â®â€°Ã Â®Â³Ã Â¯ÂÃ Â®Â¨Ã Â¯ÂÃ Â®Â´Ã Â¯Ë†Ã Â®Â¯', // Login
            'NAV_LOGOUT': 'Ã Â®ÂµÃ Â¯â€ Ã Â®Â³Ã Â®Â¿Ã Â®Â¯Ã Â¯â€¡Ã Â®Â±Ã Â¯Â', // Logout
            'NAV_ACC': 'Ã Â®â€¦Ã Â®Â£Ã Â¯ÂÃ Â®â€¢Ã Â®Â²Ã Â¯Â Ã Â®ÂµÃ Â®Â¿Ã Â®Â¤Ã Â®Â¿Ã Â®Â®Ã Â¯ÂÃ Â®Â±Ã Â¯Ë†',
            'BTN_ADD_CART': 'Ã Â®ÂªÃ Â¯Ë†Ã Â®Â¯Ã Â®Â¿Ã Â®Â²Ã Â¯Â Ã Â®Å¡Ã Â¯â€¡Ã Â®Â°Ã Â¯ÂÃ Â®â€¢Ã Â¯ÂÃ Â®â€¢Ã Â®ÂµÃ Â¯ÂÃ Â®Â®Ã Â¯Â',
            'LBL_PRICE': 'Ã Â®ÂµÃ Â®Â¿Ã Â®Â²Ã Â¯Ë†',
            'LBL_RATING': 'Ã Â®Â®Ã Â®Â¤Ã Â®Â¿Ã Â®ÂªÃ Â¯ÂÃ Â®ÂªÃ Â¯â‚¬Ã Â®Å¸Ã Â¯Â',
            'LBL_HIGHLIGHTS': 'Ã Â®Å¡Ã Â®Â¿Ã Â®Â±Ã Â®ÂªÃ Â¯ÂÃ Â®ÂªÃ Â®Â®Ã Â¯ÂÃ Â®Å¡Ã Â®â„¢Ã Â¯ÂÃ Â®â€¢Ã Â®Â³Ã Â¯Â'
        },
        hi: {
            'NAV_HOME': 'Ã Â¤Â¹Ã Â¥â€¹Ã Â¤Â®', // Home
            'NAV_CATALOG': 'Ã Â¤Â¸Ã Â¥â€šÃ Â¤Å¡Ã Â¥â‚¬', // Catalog
            'NAV_COMPARE': 'Ã Â¤Â¤Ã Â¥ÂÃ Â¤Â²Ã Â¤Â¨Ã Â¤Â¾ Ã Â¤â€¢Ã Â¤Â°Ã Â¥â€¡Ã Â¤â€š', // Compare
            'NAV_EXCHANGE': 'Ã Â¤ÂµÃ Â¤Â¿Ã Â¤Â¨Ã Â¤Â¿Ã Â¤Â®Ã Â¤Â¯', // Exchange
            'NAV_ORDERS': 'Ã Â¤â€˜Ã Â¤Â°Ã Â¥ÂÃ Â¤Â¡Ã Â¤Â° Ã Â¤â€¡Ã Â¤Â¤Ã Â¤Â¿Ã Â¤Â¹Ã Â¤Â¾Ã Â¤Â¸', // Order History
            'NAV_SEARCH': 'Ã Â¤â€“Ã Â¥â€¹Ã Â¤Å“Ã Â¥â€¡Ã Â¤â€š...', // Search...
            'NAV_LOGIN': 'Ã Â¤Â²Ã Â¥â€°Ã Â¤â€” Ã Â¤â€¡Ã Â¤Â¨ Ã Â¤â€¢Ã Â¤Â°Ã Â¥â€¡Ã Â¤â€š', // Login
            'NAV_LOGOUT': 'Ã Â¤Â²Ã Â¥â€°Ã Â¤â€” Ã Â¤â€ Ã Â¤â€°Ã Â¤Å¸', // Logout
            'NAV_ACC': 'Ã Â¤ÂÃ Â¤â€¢Ã Â¥ÂÃ Â¤Â¸Ã Â¥â€¡Ã Â¤Â¸ Ã Â¤ÂªÃ Â¥ÂÃ Â¤Â°Ã Â¥â€¹Ã Â¤Å¸Ã Â¥â€¹Ã Â¤â€¢Ã Â¥â€°Ã Â¤Â²',
            'BTN_ADD_CART': 'Ã Â¤Â¬Ã Â¥Ë†Ã Â¤â€” Ã Â¤Â®Ã Â¥â€¡Ã Â¤â€š Ã Â¤Â¡Ã Â¤Â¾Ã Â¤Â²Ã Â¥â€¡Ã Â¤â€š',
            'LBL_PRICE': 'Ã Â¤â€¢Ã Â¥â‚¬Ã Â¤Â®Ã Â¤Â¤',
            'LBL_RATING': 'Ã Â¤Â°Ã Â¥â€¡Ã Â¤Å¸Ã Â¤Â¿Ã Â¤â€šÃ Â¤â€”',
            'LBL_HIGHLIGHTS': 'Ã Â¤Â®Ã Â¥ÂÃ Â¤â€“Ã Â¥ÂÃ Â¤Â¯ Ã Â¤ÂµÃ Â¤Â¿Ã Â¤Â¶Ã Â¥â€¡Ã Â¤Â·Ã Â¤Â¤Ã Â¤Â¾Ã Â¤ÂÃ Â¤â€š'
        }
    };

    setLanguage(lang: Language) {
        this.currentLang.set(lang);
        document.documentElement.lang = lang;
    }

    translate(key: string): string {
        const lang = this.currentLang();
        return this.dictionaries[lang][key] || key;
    }
}