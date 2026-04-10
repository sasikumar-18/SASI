import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './support.html',
  styleUrl: './support.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Support {
  faqs = [
    {
      q: 'How do I track my Nexus shipment?',
      a: 'Log in to your account and navigate to "My Digital Vault". You can monitor the real-time neural link of your hardware transit there.',
      open: false
    },
    {
      q: 'What is the Nexus Exchange Protocol?',
      a: 'Our trade-in system allows you to exchange eligible hardware for instant store credit towards new acquisition protocols.',
      open: false
    },
    {
      q: 'Is international shipping available?',
      a: 'Currently, the Nexus ships within the domestic sector. Global expansion is slated for next quarter.',
      open: false
    },
    {
      q: 'How to apply for a Nexus Card?',
      a: 'Visit our Nexus Card page to activate the application sequence. High-tier credit history ensures faster approval.',
      open: false
    }
  ];

  contactForm = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  isSubmitting = false;
  submitSuccess = false;

  submitForm() {
    this.isSubmitting = true;
    // Simulate API call
    setTimeout(() => {
      this.isSubmitting = false;
      this.submitSuccess = true;
      this.contactForm = { name: '', email: '', subject: '', message: '' };
    }, 1500);
  }

  toggleFaq(index: number) {
    this.faqs[index].open = !this.faqs[index].open;
  }
}
