import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../services/admin.service';
import { ReportService } from '../services/report.service';
import { PostService } from '../services/post.service';
import { ThemeService } from '../services/theme.service';
import { AuthService } from '../services/auth.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnInit {
  overview: any = null;
  users: any[] = [];
  posts: any[] = [];
  reports: any[] = [];
  loading = true;
  error = '';
  activeTab: 'overview' | 'users' | 'posts' | 'reports' = 'overview';

  confirmationData: {
    message: string;
    action: () => void;
  } | null = null;

  private admin = inject(AdminService);
  private postService = inject(PostService);
  private reportService = inject(ReportService);
  public theme = inject(ThemeService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  get isDark() {
    return this.theme.isDark();
  }

  get currentUser() {
    return this.authService.currentUser();
  }

  // Helper for template
  String = String;

  constructor() {}

  ngOnInit(): void {
    this.refresh();
  }

  refresh() {
    this.loading = true;
    this.error = '';
    this.cdr.detectChanges();

    this.admin.getOverview().subscribe({
      next: (o) => {
        this.overview = o;
        this.loadUsers();
        this.loadPosts();
        this.loadReports();
      },
      error: (e) => {
        console.error(e);
        this.error = 'Failed to load overview';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadUsers() {
    this.admin.getUsers().subscribe({
      next: (u) => {
        this.users = u || [];
        this.cdr.detectChanges();
      },
      error: (e) => {
        console.error(e);
      }
    });
  }

  loadPosts() {
    this.admin.getPosts().subscribe({
      next: (p) => {
        this.posts = p || [];
        this.loading = false; // Assume last one finishes loading
        this.cdr.detectChanges();
      },
      error: (e) => {
        console.error(e);
      }
    });
  }

  loadReports() {
    this.reportService.getReports().subscribe({
      next: (r) => {
        this.reports = r || [];
        this.cdr.detectChanges();
      },
      error: (e) => {
        console.error(e);
      }
    });
  }

  setTab(tab: 'overview' | 'users' | 'posts' | 'reports') {
    this.activeTab = tab;
    this.cdr.detectChanges();
  }

  openConfirm(message: string, action: () => void) {
    this.confirmationData = { message, action };
  }

  confirmAction() {
    if (this.confirmationData) {
      this.confirmationData.action();
      this.confirmationData = null;
    }
  }

  cancelConfirm() {
    this.confirmationData = null;
  }

  toggleBan(u: any) {
    const action = u.banned ? 'Unban' : 'Ban';
    this.openConfirm(`${action} user ${u.username}?`, () => {
      const newStatus = !u.banned;
      const originalStatus = u.banned;
      u.banned = newStatus;
      
      this.admin.banUser(String(u.id), newStatus).subscribe({
        next: () => {
          this.cdr.detectChanges();
        },
        error: (e) => {
          console.error(e);
          u.banned = originalStatus;
          this.error = 'Failed to update ban status';
          this.cdr.detectChanges();
        }
      });
    });
  }

  banUserById(userId: string) {
    if (!userId) return;
    this.openConfirm('Ban this user?', () => {
      this.admin.banUser(userId, true).subscribe({
        next: () => {
          // Update local user list if exists
          const u = this.users.find(x => String(x.id) === userId);
          if (u) u.banned = true;
          this.refresh();
        },
        error: (e) => {
          console.error(e);
          this.error = 'Failed to ban user';
          this.cdr.detectChanges();
        }
      });
    });
  }

  deleteUser(u: any) {
    this.openConfirm(`Permanently delete user ${u.username}? This will also delete all their posts and comments.`, () => {
      this.admin.deleteUser(String(u.id)).subscribe({
        next: () => {
          this.users = this.users.filter(x => String(x.id) !== String(u.id));
          this.refresh();
        },
        error: (e) => {
          console.error(e);
          this.error = 'Delete failed';
          this.cdr.detectChanges();
        }
      });
    });
  }

  deletePost(p: any) {
    this.openConfirm(`Delete post "${p.title}"?`, () => {
      this.admin.deletePost(String(p.id)).subscribe({
        next: () => {
          this.posts = this.posts.filter(x => String(x.id) !== String(p.id));
          this.refresh();
        },
        error: (e) => {
          console.error(e);
          this.error = 'Failed to delete post';
          this.cdr.detectChanges();
        }
      });
    });
  }

  toggleHidePost(p: any) {
    const action = p.hidden ? 'Unhide' : 'Hide';
    this.openConfirm(`${action} post "${p.title}"?`, () => {
      this.postService.toggleHide(String(p.id)).subscribe({
        next: (updated) => {
          p.hidden = updated.hidden;
          this.cdr.detectChanges();
        },
        error: (e) => {
          console.error(e);
          this.error = 'Failed to update post visibility';
          this.cdr.detectChanges();
        }
      });
    });
  }

  deletePostById(postId: string) {
    if (!postId) return;
    this.openConfirm('Delete this reported post?', () => {
      this.admin.deletePost(postId).subscribe({
        next: () => {
          this.refresh();
        },
        error: (e) => {
          console.error(e);
          this.error = 'Failed to delete post';
          this.cdr.detectChanges();
        }
      });
    });
  }

  resolveReport(r: any, status: 'RESOLVED' | 'DISMISSED') {
    this.openConfirm(`Mark report as ${status}?`, () => {
      this.reportService.updateStatus(String(r.id), status).subscribe({
        next: () => {
          r.status = status;
          this.cdr.detectChanges();
        },
        error: (e) => {
          console.error(e);
          this.error = 'Failed to update report status';
          this.cdr.detectChanges();
        }
      });
    });
  }
}