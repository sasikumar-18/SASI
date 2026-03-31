import { Pipe, PipeTransform, inject } from '@angular/core';
import { LanguageService } from '../services/language.service';

@Pipe({
    name: 'translate',
    standalone: true,
    pure: false // Impure to detect signal changes automatically if needed, or we rely on signal
})
export class TranslatePipe implements PipeTransform {
    private languageService = inject(LanguageService);

    transform(key: string): string {
        return this.languageService.translate(key);
    }
}
