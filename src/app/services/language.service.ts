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
            'NAV_HOME': 'హోమ్',
            'NAV_CATALOG': 'కేటలాగ్',
            'NAV_COMPARE': 'పోల్చండి',
            'NAV_EXCHANGE': 'మార్పిడి',
            'NAV_ORDERS': 'ఆర్డర్ చరిత్ర',
            'NAV_SEARCH': 'వెతకండి...',
            'NAV_LOGIN': 'లాగిన్ అవ్వండి',
            'NAV_LOGOUT': 'లాగ్ అవుట్',
            'NAV_ACC': 'యాక్సెస్ ప్రోటోకాల్',
            'BTN_ADD_CART': 'బ్యాగ్‌లో చేర్చండి',
            'LBL_PRICE': 'ధర',
            'LBL_RATING': 'రేటింగ్',
            'LBL_HIGHLIGHTS': 'ముఖ్యాంశాలు'
        },
        ta: {
            'NAV_HOME': 'முகப்பு',
            'NAV_CATALOG': 'கேடலாக்',
            'NAV_COMPARE': 'ஒப்பிடுக',
            'NAV_EXCHANGE': 'பரிமாற்றம்',
            'NAV_ORDERS': 'ஆர்டர் வரலாறு',
            'NAV_SEARCH': 'தேடுக...',
            'NAV_LOGIN': 'உள்நுழைக',
            'NAV_LOGOUT': 'வெளியேறு',
            'NAV_ACC': 'அணுகல் விதிமுறை',
            'BTN_ADD_CART': 'பையில் சேர்க்கவும்',
            'LBL_PRICE': 'விலை',
            'LBL_RATING': 'மதிப்பீடு',
            'LBL_HIGHLIGHTS': 'சிறப்பம்சங்கள்'
        },
        hi: {
            'NAV_HOME': 'होम',
            'NAV_CATALOG': 'सूची',
            'NAV_COMPARE': 'तुलना करें',
            'NAV_EXCHANGE': 'विनिमय',
            'NAV_ORDERS': 'ऑर्डर इतिहास',
            'NAV_SEARCH': 'खोजें...',
            'NAV_LOGIN': 'लॉग इन करें',
            'NAV_LOGOUT': 'लॉग आउट',
            'NAV_ACC': 'एक्सेस प्रोटोकॉल',
            'BTN_ADD_CART': 'बैग में डालें',
            'LBL_PRICE': 'कीमत',
            'LBL_RATING': 'रेटिंग',
            'LBL_HIGHLIGHTS': 'मुख्य विशेषताएं'
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