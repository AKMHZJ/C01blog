import { Component, OnInit, inject, effect, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BlogCardComponent } from '../../app/blog-card/blog-card.component';
import { AuthService } from '../services/auth.service';
import { PostService } from '../services/post.service';
import { UserService } from '../services/user.service';
import { NotificationService } from '../services/notification.service';
import { Post } from '../models/post';
import { ThemeService } from '../services/theme.service';
import { PostEditorComponent } from '../post-editor/post-editor.component';
import { MatIconModule } from '@angular/material/icon';

import { ImageUrlPipe } from '../pipes/image-url.pipe';

@Component({
  selector: 'app-my-blog',
  standalone: true,
  imports: [CommonModule, FormsModule, BlogCardComponent, PostEditorComponent, MatIconModule, ImageUrlPipe],
  templateUrl: './my-blog.component.html',
  styleUrls: ['./my-blog.component.scss'],
})
export class MyBlogComponent implements OnInit {
  myPosts: Post[] = [];
  showPostEditor = false;
  editingPost: Post | null = null;
  isLoading = false; 

  // Profile editing state
  showProfileEditor = false;
  isSavingProfile = false;
  editDisplayName = '';
  editBio = '';
  editAvatar = '';

  public authService = inject(AuthService);
  private postService = inject(PostService);
  private userService = inject(UserService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);
  public theme = inject(ThemeService);
  private cdr = inject(ChangeDetectorRef);

  get isDark() {
    return this.theme.isDark();
  }

  user: any = null;

  constructor() {
    effect(() => {
      const u = this.authService.currentUser();
      if (u) {
        // Defer initial load to avoid NG0100
        setTimeout(() => {
          this.user = u;
          if (u.id) {
            this.loadUserPosts(u.id);
            // Also fetch detailed user info for counts
            this.userService.getMe().subscribe(detailedUser => {
              this.user = detailedUser;
              this.cdr.markForCheck();
            });
          }
          this.cdr.markForCheck();
        }, 0);
      }
    });
  }

  ngOnInit() {}

  loadUserPosts(userId: string) {
    this.postService.getPostsByUser(userId).subscribe(posts => {
      setTimeout(() => {
        this.myPosts = posts;
        this.cdr.markForCheck();
      }, 0);
    });
  }

  // Profile Editor Methods
  openProfileEditor() {
    this.editDisplayName = this.user?.displayName || '';
    this.editBio = this.user?.bio || '';
    this.editAvatar = this.user?.avatar || '';
    this.showProfileEditor = true;
  }

  closeProfileEditor() {
    this.showProfileEditor = false;
  }

  onAvatarSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.postService.uploadImage(file).subscribe({
        next: (res) => {
          setTimeout(() => {
            this.editAvatar = res.url;
            this.notificationService.showSuccess('Avatar uploaded');
            this.cdr.markForCheck();
          }, 0);
        },
        error: () => this.notificationService.showError('Avatar upload failed')
      });
    }
  }

  handleProfileSave() {
    this.isSavingProfile = true;
    const payload = {
      displayName: this.editDisplayName,
      bio: this.editBio,
      avatar: this.editAvatar
    };

    this.userService.updateProfile(payload).subscribe({
      next: (updatedUser) => {
        setTimeout(() => {
          this.user = updatedUser;
          // Update auth service state too
          const token = localStorage.getItem('token');
          this.authService.saveUser({ ...updatedUser, token });
          
          this.isSavingProfile = false;
          this.closeProfileEditor();
          this.notificationService.showSuccess('Profile updated');
          this.cdr.markForCheck();
        }, 0);
      },
      error: (err) => {
        console.error('Error updating profile:', err);
        this.isSavingProfile = false;
        this.notificationService.showError('Failed to update profile: ' + (err.error?.message || err.message || 'Unknown error'));
      }
    });
  }

  openEditor(post: Post | null = null) {
    this.editingPost = post;
    this.showPostEditor = true;
  }

  handleCancel() {
    this.showPostEditor = false;
    this.editingPost = null;
  }

  handleSave(post: any) {
    console.log('Creating/updating post payload:', post);
    this.isLoading = true;

    if (this.editingPost) {
      // Update existing post
      this.postService.updatePost({ ...this.editingPost, ...post }).subscribe({
        next: () => {
          this.loadUserPosts(this.user?.id || '1');
          this.handleCancel();
          this.isLoading = false;
          this.notificationService.showSuccess('Post updated successfully');
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error updating post:', err);
          this.isLoading = false;
          this.notificationService.showError('Failed to update post');
        },
      });
    } else {
      // Create new post
      this.postService.addPost(post).subscribe({
        next: () => {
          this.isLoading = false;
          this.notificationService.showSuccess('Post published successfully');
          this.router.navigate(['/feed']);
        },
        error: (err) => {
          console.error('Error creating post:', err);
          this.isLoading = false;
          this.notificationService.showError('Failed to publish post');
        },
      });
    }
  }

  handleEdit(post: any, event: Event) {
    event.stopPropagation();
    this.openEditor(post);
  }

  handleDelete(postId: string, event: Event) {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this post?')) {
      this.postService.deletePost(postId).subscribe({
        next: () => {
          this.loadUserPosts(this.user?.id || '1');
          this.notificationService.showSuccess('Post deleted');
        },
        error: (err) => {
          this.notificationService.showError('Failed to delete post');
        }
      });
    }
  }
}