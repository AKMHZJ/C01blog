import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { ReportService } from '../services/report.service';

@Component({
  selector: 'app-report-dialog',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatDialogModule, 
    MatButtonModule, 
    MatFormFieldModule, 
    MatInputModule,
    MatRadioModule,
    MatIconModule
  ],
  templateUrl: './report-dialog.component.html',
  styleUrls: ['./report-dialog.component.scss']
})
export class ReportDialogComponent {
  step: 1 | 2 = 1;
  selectedReason: string = '';
  additionalDetails: string = '';
  loading = false;
  error = '';

  reasons = [
    'Spam or misleading content',
    'Harassment or bullying',
    'Hate speech or discrimination',
    'Violence or dangerous content',
    'Impersonation',
    'Other'
  ];
  
  private reportService = inject(ReportService);
  private dialogRef = inject(MatDialogRef<ReportDialogComponent>);
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: { postId: string, postTitle: string, postAuthor: string }) {}

  continueToReview() {
    if (this.selectedReason && this.additionalDetails.trim()) {
      this.step = 2;
    }
  }

  backToEdit() {
    this.step = 1;
  }

  submit() {
    if (!this.selectedReason || !this.additionalDetails.trim()) return;
    
    this.loading = true;
    this.error = '';

    const fullReason = `[${this.selectedReason}] ${this.additionalDetails}`;
    
    this.reportService.createReport(this.data.postId, fullReason).subscribe({
      next: () => {
        this.loading = false;
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to submit report. Please try again.';
        this.loading = false;
      }
    });
  }

  cancel() {
    this.dialogRef.close(false);
  }
}
