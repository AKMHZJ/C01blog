import { Component, Input, Output, EventEmitter, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { PostService } from '../services/post.service';
import { NotificationService } from '../services/notification.service';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-post-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MarkdownModule],
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
  private cdr = inject(ChangeDetectorRef);

  isDark = true;
  title = '';
  category = 'Lifestyle';
  // Existing image field for backward compatibility / main cover
  image = '';
  // New field for multiple media
  mediaUrls: string[] = [];
  
  content = '';
  isUploading = false;
  
  showPreview = false;

  ngOnInit() {
    if (this.post) {
      this.title = this.post.title;
      this.category = this.post.category;
      this.image = this.post.image;
      // Load existing mediaUrls if available, otherwise fallback to empty
      this.mediaUrls = this.post.mediaUrls || [];
      // If we have an image but no mediaUrls, add the image to mediaUrls
      if (this.image && this.mediaUrls.length === 0) {
        this.mediaUrls.push(this.image);
      }
      this.content = this.post.content.join('\n\n');
    }
  }

  togglePreview() {
    this.showPreview = !this.showPreview;
  }

  insertMarkdown(prefix: string, suffix: string) {
    const textarea = document.querySelector('.textarea-content') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = this.content;
    const before = text.substring(0, start);
    const selected = text.substring(start, end);
    const after = text.substring(end);

    this.content = before + prefix + selected + suffix + after;
    
    // Restore focus and selection (async to let binding update)
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
      this.cdr.detectChanges(); 
    }, 0);
  }

  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    if (!files || files.length === 0) return;

    const MAX_IMG_SIZE = 20 * 1024 * 1024; // 20MB
    const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB
    const MAX_TOTAL_SIZE = 120 * 1024 * 1024; // 120MB

    let currentSelectionSize = 0;
    const filesToUpload: File[] = [];

    // 1. Calculate size of already uploaded files? 
    // It's hard to know exact size of remote URLs without HEAD requests. 
    // Requirement says "if i chose multiple images or videos it shouldn't all of theme combined exceed 120Mb". 
    // This usually implies the *current upload batch* or total session uploads.
    // Let's assume it checks the *currently selected files* for the limit + validation on individual files.

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const isVideo = file.type.startsWith('video/');
      const isImage = file.type.startsWith('image/');

      if (!isVideo && !isImage) {
        this.notificationService.showError(`File ${file.name} is not a valid image or video.`);
        continue;
      }

      if (isImage && file.size > MAX_IMG_SIZE) {
        this.notificationService.showError(`Image ${file.name} exceeds 20MB limit.`);
        continue;
      }

      if (isVideo && file.size > MAX_VIDEO_SIZE) {
        this.notificationService.showError(`Video ${file.name} exceeds 100MB limit.`);
        continue;
      }

      currentSelectionSize += file.size;
      filesToUpload.push(file);
    }

    if (currentSelectionSize > MAX_TOTAL_SIZE) {
      this.notificationService.showError(`Total size of selected files (${(currentSelectionSize / (1024*1024)).toFixed(1)}MB) exceeds 120MB limit.`);
      return;
    }

    if (filesToUpload.length === 0) return;

    this.isUploading = true;
    let completed = 0;

    // Upload files one by one
    filesToUpload.forEach(file => {
      this.postService.uploadImage(file).subscribe({
        next: (res) => {
          this.mediaUrls.push(res.url);
          // Set the first one as cover image if not set
          if (!this.image) {
            this.image = res.url;
          }
          completed++;
          if (completed === filesToUpload.length) {
            this.isUploading = false;
            this.notificationService.showSuccess(`Uploaded ${completed} file(s).`);
            this.cdr.detectChanges();
          }
        },
        error: (err) => {
          console.error('Upload error:', err);
          completed++;
          this.notificationService.showError(`Failed to upload ${file.name}`);
          if (completed === filesToUpload.length) {
            this.isUploading = false;
            this.cdr.detectChanges();
          }
        }
      });
    });
  }

  removeMedia(index: number) {
    const removedUrl = this.mediaUrls[index];
    this.mediaUrls.splice(index, 1);
    
    // If we removed the cover image, pick the next available one or clear it
    if (this.image === removedUrl) {
      this.image = this.mediaUrls.length > 0 ? this.mediaUrls[0] : '';
    }
  }

  setAsCover(url: string) {
    this.image = url;
  }

  isVideo(url: string): boolean {
    // Basic check based on extension or if we had metadata. 
    // Since we only store URL string, let's rely on common extensions.
    // Or simpler: Backend response for upload could return type, but here we only have URL string.
    // Let's check extension.
    if (!url) return false;
    const lower = url.toLowerCase();
    return lower.endsWith('.mp4') || lower.endsWith('.webm') || lower.endsWith('.ogg') || lower.endsWith('.mov');
  }

  getFullImageUrl(url: string): string {
    if (url && (url.startsWith('http') || url.startsWith('https'))) {
      return url;
    }
    if (url && url.startsWith('/api/media/files/')) {
      return `http://localhost:8080${url}`;
    }
    return url || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1080';
  }

  handleSubmit() {
    // Auto-generate excerpt from content
    const plainText = this.content.replace(/[#*`_]/g, ''); // Simple markdown strip
    const generatedExcerpt = plainText.length > 150 ? plainText.substring(0, 147) + '...' : plainText;

    const payload = {
      title: this.title,
      excerpt: generatedExcerpt,
      category: this.category,
      image: this.image || (this.mediaUrls.length > 0 ? this.mediaUrls[0] : 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1080'),
      mediaUrls: this.mediaUrls,
      content: this.content.split('\n\n').filter(p => p.trim()),
    };
    console.log('PostEditor payload:', payload);
    this.save.emit(payload);
  }
}