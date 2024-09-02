import { Component, Inject } from '@angular/core';

import { MatButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { FormsModule } from '@angular/forms';
import { MatListOption, MatSelectionList } from '@angular/material/list';

import { ShopService } from '../../../core/services/shop.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-filters-dialog',
  standalone: true,
  imports: [
    FormsModule,
    MatButton,
    MatDivider,
    MatListOption,
    MatSelectionList,
  ],
  templateUrl: './filters-dialog.component.html',
  styleUrl: './filters-dialog.component.scss',
})
export class FiltersDialogComponent {
  selectedBrands: string[] = [];
  selectedTypes: string[] = [];

  constructor(
    public readonly shopService: ShopService,
    private readonly dialogRef: MatDialogRef<FiltersDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    data: { selectedBrands: string[]; selectedTypes: string[] }
  ) {
    this.selectedBrands = data.selectedBrands;
    this.selectedTypes = data.selectedTypes;
  }

  applyFilters() {
    this.dialogRef.close({
      selectedBrands: this.selectedBrands,
      selectedTypes: this.selectedTypes,
    });
  }
}
