import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NexusCardService } from '../../services/nexus-card.service';

@Component({
    selector: 'app-nexus-card-apply',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './nexus-card-apply.html',
    styleUrl: './nexus-card-apply.css'
})
export class NexusCardApply {
    cardService = inject(NexusCardService);

    formData = {
        pan: '',
        income: 0,
        employment: 'Salaried',
        pincode: ''
    };

    applying = signal(false);

    onSubmit() {
        this.applying.set(true);
        this.cardService.apply(this.formData);

        // Wait for service timeout logic
        setTimeout(() => {
            this.applying.set(false);
        }, 3500);
    }
}
