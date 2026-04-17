import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmLabel: string;
  confirmColor?: 'primary' | 'warn';
  icon?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="dialog-wrap">
      <div class="dialog-icon" [class.warn]="data.confirmColor === 'warn'">
        <mat-icon>{{ data.icon ?? 'help_outline' }}</mat-icon>
      </div>
      <h2 mat-dialog-title class="dialog-title">{{ data.title }}</h2>
      <mat-dialog-content class="dialog-msg">{{ data.message }}</mat-dialog-content>
      <mat-dialog-actions class="dialog-actions">
        <button mat-stroked-button (click)="ref.close(false)">Cancelar</button>
        <button mat-flat-button [color]="data.confirmColor ?? 'primary'" (click)="ref.close(true)">
          {{ data.confirmLabel }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-wrap  { padding: 28px 24px 16px; max-width: 380px; text-align: center; }
    .dialog-icon  { display: flex; justify-content: center; margin-bottom: 12px; }
    .dialog-icon mat-icon { font-size: 44px; width: 44px; height: 44px; color: #1565c0; }
    .dialog-icon.warn mat-icon { color: #c62828; }
    .dialog-title { font-size: 1.15rem; font-weight: 700; color: #1a1a2e; margin: 0 0 4px; }
    .dialog-msg   { font-size: 0.88rem; color: rgba(0,0,0,0.55); line-height: 1.5; }
    .dialog-actions { display: flex; justify-content: center; gap: 12px; padding-top: 20px; }
  `],
})
export class ConfirmDialog {
  readonly data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);
  readonly ref  = inject(MatDialogRef<ConfirmDialog>);
}
