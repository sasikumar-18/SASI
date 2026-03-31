import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { Footer } from './components/footer/footer';

import { NotificationToast } from './components/notification-toast/notification-toast';
import { AIChatbot } from './components/ai-chatbot/ai-chatbot';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar, Footer, NotificationToast, AIChatbot],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  title = 'mobile-shop-app';
}
