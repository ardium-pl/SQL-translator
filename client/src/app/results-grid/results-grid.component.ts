import { Component, computed, inject, Signal } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { DataFetchingService } from '../services/data-fetching.service';

@Component({
  selector: 'app-results-grid',
  standalone: true,
  imports: [AgGridAngular],
  templateUrl: './results-grid.component.html',
  styleUrl: './results-grid.component.scss',
})
export class ResultsGridComponent {
  readonly dataFetchingService = inject(DataFetchingService);

  rowData = this.dataFetchingService.rowData
  colDefs = computed<ColDef[]>((): ColDef[] => {
    console.log("⚙️ Updating column definitions ...")
    const columnNames = Object.keys(this.dataFetchingService.rowData()[0]);
    const colDefs = columnNames.map((name) => ({
      field: name,
    }));
    return colDefs;
  });
}
