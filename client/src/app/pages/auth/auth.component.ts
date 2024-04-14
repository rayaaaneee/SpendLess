import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastModule],
  providers: [MessageService],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})

export class AuthComponent {

  registerUsername = '';
  registerPassword = '';

  loginUsername = '';
  loginPassword = '';

  constructor(
    private messageService: MessageService,
    private router: Router,
    private authService: AuthService,
  ) { }

  async login(e: SubmitEvent) {
    e.preventDefault();
    if (this.loginUsername === '' || this.loginPassword === '') {
      this.messageService.add({severity:'error', summary:'Username and password required'});
    } else {
      let data = await this.authService.login(this.loginUsername, this.loginPassword);
      if (data.success) {
        this.messageService.add({severity:'success', summary:'You successfully logged in !'});
        this.router.navigate(['/']);
      } else {
        this.messageService.add({severity:'error', summary:data.message});
      }
    }
    return;
  }

  async register(e: SubmitEvent) {
    e.preventDefault();
    if (this.registerUsername === '' || this.registerPassword === '') {
      this.messageService.add({severity:'error', summary:'Username and password required'});
    } else if (!this.registerPassword.match(/.*/)) {
      this.messageService.add({severity:'error', summary:'Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, and one number.'});
    } else {
      let response = await this.authService.register(this.registerUsername, this.registerPassword);
      if (response.token) {
        this.messageService.add({severity:'success', summary:'You successfully registered !'});
        this.router.navigate(['/']);
      } else {
        this.messageService.add({severity:'error', summary:response.message});
      }
    }
    return;
  }

}
