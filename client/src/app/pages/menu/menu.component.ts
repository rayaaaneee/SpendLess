import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { MenuItemComponent } from './item/item.component';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, MenuItemComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})

export class MenuComponent implements OnInit, OnDestroy {

    @ViewChild('barsContainer') barsContainer!: ElementRef;
    @ViewChild('menu') menu!: ElementRef;

    connected: boolean = false;

    constructor(
      @Inject(DOCUMENT) private document: Document,
      private router: Router,
      private authService: AuthService
    ) {
      this.connected = this.authService.isAuthenticated();
    }

    handleCrossClick = () => {
        if (this.menu) {
            this.menu.nativeElement.classList.remove('open');
        }
    }

    handleMenuClick = () => {
        if (this.menu) {
            this.menu.nativeElement.classList.add('open');
        }
    }

    handleClick = (e: Event) => {
      if (
          (this.menu.nativeElement && this.menu.nativeElement.classList.contains('open'))
          && ((this.menu.nativeElement !== (e.target as Node)) || (!this.menu.nativeElement.contains(e.target as Node)))
          && ((!this.barsContainer.nativeElement.contains(e.target as Node)))
      ) {
        this.menu.nativeElement.classList.remove('open');
      } else if (e.target === this.barsContainer.nativeElement || this.barsContainer.nativeElement.contains(e.target)){
        this.menu.nativeElement.classList.add('open');
      }
    };

    handleDisconnectClick = (e: Event) => {
      this.authService.logout();
      this.router.navigate(['/auth']);
    }

    handleConnectClick = (e: Event) => {
      this.router.navigate(['/auth']);
    }

    ngOnInit() {
      this.document.addEventListener('click', this.handleClick);
    }

    ngOnDestroy() {
      this.document.removeEventListener('click', this.handleClick);
    }

    homeClick() {
      this.router.navigate(['']);
    }
}
