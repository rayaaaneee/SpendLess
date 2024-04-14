import {Title} from "@angular/platform-browser";

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss'
})
export class NotFoundComponent {

  title = 'Page Not Found';

  constructor(private titleService: Title) {
    this.titleService.setTitle(this.title);
  }


  ngOnInit() {
  }
}
