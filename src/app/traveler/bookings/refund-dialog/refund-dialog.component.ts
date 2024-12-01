import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-refund-dialog',
    templateUrl: './refund-dialog.component.html',
    styleUrls: ['./refund-dialog.component.scss'],
    standalone: false
})
export class RefundDialogComponent {
  refundReason: string = '';

  constructor(private dialogRef: MatDialogRef<RefundDialogComponent>) {}

  confirm(): void {
    this.dialogRef.close(this.refundReason);
  }

  close(): void {
    this.dialogRef.close();
  }
}