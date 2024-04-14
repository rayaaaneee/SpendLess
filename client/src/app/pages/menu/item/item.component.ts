import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'menu-item',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './item.component.html',
  styleUrl: './item.component.scss'
})
export class MenuItemComponent implements OnInit {

  @Input() text: string = '';
  @Input() to: string = '';

  constructor() {
  }

  ngOnInit() {
  }
}
