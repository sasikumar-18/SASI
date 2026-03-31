import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WishlistService } from '../../services/wishlist.service';

@Component({
    selector: 'app-wishlist',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './wishlist.html',
    styleUrl: './wishlist.css',
})
export class Wishlist {
    wishlistService = inject(WishlistService);
}
