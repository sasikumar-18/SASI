import { Component, inject, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';
import { WishlistService } from '../../services/wishlist.service';
import { NotificationService } from '../../services/notification.service';
import { LanguageService, Language } from '../../services/language.service';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { CompareService } from '../../services/compare.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, FormsModule, TranslatePipe],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private router = inject(Router);
  cartService = inject(CartService);
  authService = inject(AuthService);
  themeService = inject(ThemeService);
  wishlistService = inject(WishlistService);
  notificationService = inject(NotificationService);
  languageService = inject(LanguageService);
  productService = inject(ProductService);
  compareService = inject(CompareService);

  languages: { code: Language, label: string }[] = [
    { code: 'en', label: 'ENG' },
    { code: 'te', label: 'తెలుగు' }, // Telugu
    { code: 'ta', label: 'தமிழ்' },  // Tamil
    { code: 'hi', label: 'हिंदी' }   // Hindi
  ];

  setLang(lang: Language) {
    this.languageService.setLanguage(lang);
  }

  isMenuOpen = false;
  showNotifications = false;
  searchTerm = '';
  isListening = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
    if (this.showNotifications) {
      // Keep unread status until explicitly clicked or "Mark all read" is used? 
      // Usually simplistic apps mark as read on open, but let's keep them unread for now.
    }
  }

  private ngZone = inject(NgZone);

  startVoiceSearch() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      // Sync recognition with repository language 
      const langMap: Record<string, string> = {
        'en': 'en-IN',
        'te': 'te-IN',
        'ta': 'ta-IN',
        'hi': 'hi-IN'
      };
      recognition.lang = langMap[this.languageService.currentLang()] || 'en-US';

      recognition.onstart = () => {
        this.ngZone.run(() => this.isListening = true);
      };

      recognition.onend = () => {
        this.ngZone.run(() => this.isListening = false);
      };

      recognition.onresult = (event: any) => {
        let transcript = event.results[0][0].transcript;
        // Clean transcript from trailing periods/punctuation
        transcript = transcript.replace(/[.?!]$/, '').trim();

        this.ngZone.run(() => {
          this.searchTerm = transcript;
          this.onSearch();
        });
      };

      recognition.onerror = (event: any) => {
        console.error('Voice Error:', event.error);
        this.ngZone.run(() => this.isListening = false);
        if (event.error === 'not-allowed') {
          alert('Voice access denied. Please enable microphone permissions in your browser .');
        }
      };

      try {
        recognition.start();
      } catch (e) {
        console.error('Recognition Start Failed:', e);
      }
    } else {
      alert('Voice assistant is not supported in this browser.');
    }
  }

  onSearch() {
    this.suggestions = [];
    if (this.searchTerm.trim()) {
      this.router.navigate(['/products'], { queryParams: { search: this.searchTerm } });
    }
  }

  suggestions: any[] = [];

  onSearchInput() {
    if (this.searchTerm.length < 2) {
      this.suggestions = [];
      return;
    }

    this.productService.searchProducts(this.searchTerm).subscribe((results: any[]) => {
      this.suggestions = results;
    });
  }

  selectSuggestion(product: any) {
    this.searchTerm = product.name;
    this.suggestions = [];
    this.router.navigate(['/products', product.id]);
  }
}