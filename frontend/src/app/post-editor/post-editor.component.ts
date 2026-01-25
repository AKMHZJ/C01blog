import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { PostService } from '../services/post.service';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-post-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './post-editor.component.html',
  styleUrls: ['./post-editor.component.scss']
})
export class PostEditorComponent {
  @Input() post: any = null;
  @Input() isLoading: boolean = false; 
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  private postService = inject(PostService);
  private notificationService = inject(NotificationService);

  isDark = true;
  title = '';
  excerpt = '';
  category = 'Lifestyle';
  image = '';
  content = '';
  isUploading = false;

  ngOnInit() {
    if (this.post) {
      this.title = this.post.title;
      this.excerpt = this.post.excerpt;
      this.category = this.post.category;
      this.image = this.post.image;
      this.content = this.post.content.join('\n\n');
    }
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.isUploading = true;
      this.postService.uploadImage(file).subscribe({
        next: (res) => {
          this.image = res.url;
          this.isUploading = false;
          this.notificationService.showSuccess('Image uploaded successfully');
        },
        error: (err) => {
          console.error('Upload error:', err);
          this.isUploading = false;
          this.notificationService.showError('Failed to upload image');
        }
      });
    }
  }

  getFullImageUrl(url: string): string {
    if (url && url.startsWith('/api/media/files/')) {
      return `http://localhost:8080${url}`;
    }
    return url || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1080';
  }

  handleSubmit() {
    const payload = {
      title: this.title,
      excerpt: this.excerpt,
      category: this.category,
      image: this.image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1080',
      content: this.content.split('\n\n').filter(p => p.trim()),
    };
    console.log('PostEditor payload:', payload);
    this.save.emit(payload);
  }
}
