import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PostService } from '../services/post.service';
import { AuthService } from '../services/auth.service';
import { ThemeService } from '../services/theme.service';
import { Post, Comment } from '../models/post';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ImageUrlPipe } from '../pipes/image-url.pipe';
import { ReportDialogComponent } from '../report-dialog/report-dialog.component';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-post-page',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatDialogModule, ImageUrlPipe, MarkdownModule],
  templateUrl: './post-page.component.html',
  styleUrls: ['./post-page.component.scss']
})
export class PostPageComponent implements OnInit {
  post: Post | undefined;
  commentText: string = '';
  isLiked: boolean = false;

  // Comment editing state
  editingCommentId: string = '';
  editText: string = '';

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  public authService = inject(AuthService);
  private postService = inject(PostService);
  public theme = inject(ThemeService);
  private cdr = inject(ChangeDetectorRef);
  private dialog = inject(MatDialog);

  get currentUser() {
    return this.authService.currentUser();
  }

  get isDark() {
    return this.theme.isDark();
  }

  ngOnInit(): void {
    const postId = this.route.snapshot.paramMap.get('id');
    if (postId) {
      this.postService.getPost(postId).subscribe(post => {
        setTimeout(() => {
          this.post = post;
          this.checkInteractionStates();
          this.cdr.detectChanges();
        }, 0);
      });
    }
  }

  checkInteractionStates(): void {
    if (this.post && this.currentUser) {
      const userId = String(this.currentUser.id);
      this.isLiked = (this.post.likes || []).map(id => String(id)).includes(userId);
    }
  }

  handleLike(): void {
    if (!this.currentUser || !this.post) return;
    this.postService.toggleLike(this.post.id).subscribe(post => {
      setTimeout(() => {
        this.post = post;
        this.checkInteractionStates();
        this.cdr.detectChanges();
      }, 0);
    });
  }

  openReport(): void {
    if (!this.post) return;
    this.dialog.open(ReportDialogComponent, {
      data: { 
        postId: this.post.id, 
        postTitle: this.post.title,
        postAuthor: this.post.author?.username || 'Unknown'
      },
      width: '500px'
    });
  }

  handleCommentSubmit(): void {
    if (!this.currentUser || !this.commentText.trim() || !this.post) return;
    this.postService.addComment(this.post.id, this.commentText).subscribe(comment => {
      setTimeout(() => {
        if (this.post) {
          if (!this.post.comments) this.post.comments = [];
          this.post.comments.push(comment);
        }
        this.commentText = '';
        this.cdr.detectChanges();
      }, 0);
    });
  }

  isOwnComment(comment: Comment): boolean {
    if (!this.currentUser || !comment.author) return false;
    const commentAuthorId = String(comment.author.id || comment.author.userId || '');
    const currentUserId = String(this.currentUser.id || this.currentUser.userId || '');
    return commentAuthorId === currentUserId;
  }

  startEdit(comment: Comment): void {
    if (!comment || !comment.id) {
      console.warn('[PostPage] Cannot edit comment without ID', comment);
      return;
    }
    this.editingCommentId = comment.id;
    this.editText = comment.text;
    this.cdr.detectChanges();
  }

  cancelEdit(): void {
    this.editingCommentId = '';
    this.editText = '';
    this.cdr.detectChanges();
  }

  saveEdit(commentId: string): void {
    if (!this.post || !commentId || commentId === 'null' || !this.editText.trim()) return;
    
    console.log('[PostPage] Saving edit for comment:', commentId);
    this.postService.updateComment(this.post.id, commentId, this.editText).subscribe({
      next: (updatedComment) => {
        setTimeout(() => {
          if (this.post) {
            const idx = this.post.comments.findIndex(c => c.id === commentId);
            if (idx !== -1) {
              this.post.comments[idx] = updatedComment;
              console.log('[PostPage] Comment updated in local state');
            }
          }
          this.cancelEdit();
          this.cdr.detectChanges();
        }, 0);
      },
      error: (err) => {
        console.error('[PostPage] Failed to update comment:', err);
        alert('Could not update comment: ' + (err.error?.message || 'Server error'));
      }
    });
  }

  handleDeleteComment(commentId: string): void {
    if (!this.currentUser || !this.post || !commentId || commentId === 'null') {
      console.warn('[PostPage] Cannot delete comment: missing data or ID', { commentId, post: !!this.post });
      return;
    }
    
    if (confirm('Are you sure you want to delete this comment?')) {
      console.log('[PostPage] Deleting comment:', commentId);
      this.postService.deleteComment(this.post.id, commentId).subscribe({
        next: () => {
          setTimeout(() => {
            if (this.post) {
              this.post.comments = this.post.comments.filter(c => c.id !== commentId);
              console.log('[PostPage] Comment removed from local state');
            }
            this.cdr.detectChanges();
          }, 0);
        },
        error: (err) => {
          console.error('[PostPage] Failed to delete comment:', err);
          alert('Could not delete comment: ' + (err.error?.message || 'Server error'));
        }
      });
    }
  }

  formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  goBack(): void {
    this.router.navigate(['/feed']);
  }
}