import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../services/admin.service';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnInit {
  overview: any = null;
  users: any[] = [];
  loading = true;
  error = '';
  activeTab: 'overview' | 'users' = 'overview';

  private admin = inject(AdminService);
  public theme = inject(ThemeService);
  private cdr = inject(ChangeDetectorRef);

  get isDark() {
    return this.theme.isDark();
  }

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
        this.admin.getUsers().subscribe({
          next: (u) => {
            this.users = u || [];
            this.loading = false;
            this.cdr.detectChanges();
          },
          error: (e) => {
            console.error(e);
            this.error = 'Failed to load users';
            this.loading = false;
            this.cdr.detectChanges();
          }
        });
      },
      error: (e) => {
        console.error(e);
        this.error = 'Failed to load overview';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  setTab(tab: 'overview' | 'users') {
    this.activeTab = tab;
  }

  updateRole(u: any, role: 'USER' | 'ADMIN') {
    const prev = u.role;
    u.role = role;
    this.admin.updateUserRole(String(u.id), role).subscribe({
      next: () => {},
      error: (e) => {
        console.error(e);
        u.role = prev;
        this.error = 'Role update failed';
      }
    });
  }

  deleteUser(u: any) {
    if (!confirm(`Delete user ${u.username}?`)) return;
    this.admin.deleteUser(String(u.id)).subscribe({
      next: () => {
        this.users = this.users.filter(x => String(x.id) !== String(u.id));
        this.refresh();
      },
      error: (e) => {
        console.error(e);
        this.error = 'Delete failed';
      }
    });
  }
}
