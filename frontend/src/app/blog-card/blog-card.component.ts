import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ImageUrlPipe } from '../pipes/image-url.pipe';

@Component({
  selector: 'app-blog-card',
  standalone: true,
  imports: [CommonModule, MatIconModule, ImageUrlPipe],
  templateUrl: './blog-card.component.html',
  styleUrls: ['./blog-card.component.scss']
})
export class BlogCardComponent {
  @Input() title: string = '';
  @Input() date: string | null = '';
  @Input() image: string = '';
  @Input() category: string = '';
  @Input() author: any = null;
  @Input() likeCount: number = 0;
  @Input() commentCount: number = 0;
  @Output() cardClick = new EventEmitter<void>();
}
