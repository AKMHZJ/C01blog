import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ImageUrlPipe } from '../pipes/image-url.pipe';
import { ReportDialogComponent } from '../report-dialog/report-dialog.component';

@Component({
  selector: 'app-blog-card',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, ImageUrlPipe],
  templateUrl: './blog-card.component.html',
  styleUrls: ['./blog-card.component.scss']
})
export class BlogCardComponent {
  @Input() id: string = '';
  @Input() title: string = '';
  @Input() date: string | null = '';
  @Input() image: string = '';
  @Input() category: string = '';
  @Input() author: any = null;
  @Input() likeCount: number = 0;
  @Input() commentCount: number = 0;
  @Input() hidden: boolean = false;
  @Output() cardClick = new EventEmitter<void>();

  private dialog = inject(MatDialog);

  isVideo(url: string): boolean {
    if (!url) return false;
    const lower = url.toLowerCase();
    // Check against common video extensions or Cloudinary resource type 'video' in URL if applicable
    // Simple extension check for now
    return lower.endsWith('.mp4') || lower.endsWith('.webm') || lower.endsWith('.ogg') || lower.endsWith('.mov');
  }

  openReport(event: Event) {
    event.stopPropagation();
    this.dialog.open(ReportDialogComponent, {
      data: { postId: this.id, postTitle: this.title },
      width: '400px'
    });
  }
}
