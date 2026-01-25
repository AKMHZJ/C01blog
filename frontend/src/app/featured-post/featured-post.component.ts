import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ImageUrlPipe } from '../pipes/image-url.pipe';

@Component({
  selector: 'app-featured-post',
  standalone: true,
  imports: [CommonModule, MatIconModule, ImageUrlPipe],
  templateUrl: './featured-post.component.html',
  styleUrls: ['./featured-post.component.scss']
})
export class FeaturedPostComponent {
  @Input() title: string = '';
  @Input() excerpt: string = '';
  @Input() date: string | null = '';
  @Input() image: string = '';
  @Input() category: string = '';
  @Input() author: any = null;
  @Input() likeCount: number = 0;
  @Input() commentCount: number = 0;
  @Output() postClick = new EventEmitter<void>();
}
