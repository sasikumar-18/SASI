import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';

@Component({
    selector: 'app-notification-toast',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="fixed top-24 right-4 z-50 flex flex-col gap-4 pointer-events-none">
        @for (notification of notificationService.activeNotifications(); track notification.id) {
            <div class="pointer-events-auto w-80 bg-white/90 backdrop-blur-xl border border-white/20 p-5 rounded-2xl shadow-2xl animate-slide-in flex items-start gap-4">
                <div [class]="getIconClass(notification.type)">
                    <i [class]="getIcon(notification.type)"></i>
                </div>
                <div class="flex-1">
                    <h4 class="text-sm font-black uppercase tracking-wider text-slate-800 mb-1">{{ notification.title }}</h4>
                    <p class="text-xs font-medium text-slate-500 leading-relaxed">{{ notification.message }}</p>
                </div>
                <button (click)="notificationService.dismiss(notification.id)" class="text-slate-400 hover:text-slate-800">
                    <i class="fas fa-times text-xs"></i>
                </button>
            </div>
        }
    </div>
  `,
    styles: [`
    @keyframes slideIn {
        from { opacity: 0; transform: translateX(20px); }
        to { opacity: 1; transform: translateX(0); }
    }
    .animate-slide-in {
        animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
  `]
})
export class NotificationToast {
    notificationService = inject(NotificationService);

    getIconClass(type: string): string {
        switch (type) {
            case 'success': return 'w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500';
            case 'alert': return 'w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-500';
            default: return 'w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500';
        }
    }

    getIcon(type: string): string {
        switch (type) {
            case 'success': return 'fas fa-check-circle';
            case 'alert': return 'fas fa-arrow-down';
            default: return 'fas fa-info-circle';
        }
    }
}
