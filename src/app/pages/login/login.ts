import { Component, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LucideAngularModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  error = '';
  loading = false;

  async onSubmit() {
    this.loading = true;
    this.error = '';
    try {
      await firstValueFrom(this.authService.login(this.email, this.password));
      this.router.navigate(['/']);
    } catch (e: any) {
      if (e.error && e.error.error) {
        this.error = e.error.error;
      } else {
        this.error = 'Login failed. Please check your network or credentials.';
      }
      console.error(e);
    } finally {
      this.loading = false;
    }
  }
}
