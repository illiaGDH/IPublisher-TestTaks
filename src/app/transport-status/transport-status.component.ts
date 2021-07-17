import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { asapScheduler, Observable } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { VehicleCode } from '../shared/interface';
import { TransportStatusStore } from './transport-status.store';

interface TableRow {
  vehicle: string;
  organization: string;
  department: string;
  contragent: string;
  code: string;
  trailer: string;
  drivers: string[];
}

@Component({
  selector: 'app-transport-status',
  templateUrl: './transport-status.component.html',
  styleUrls: ['./transport-status.component.scss'],
  providers: [TransportStatusStore]
})
export class TransportStatusComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  readonly dataSource = new MatTableDataSource<TableRow>();

  readonly displayedColumns: (keyof TableRow)[] = [
    'vehicle',
    'organization',
    'department',
    'contragent',
    'code',
    'trailer',
    'drivers',
  ];

  readonly trackById = <T extends { id: string }>(index: number, item: T): any => item.id ?? index;

  private tableRows$: Observable<TableRow[]> = this.store.select(
    this.store.vehicleCodesFilteredByContragent$,
    codes => codes.map(vehicleCode => ({
      vehicle: vehicleCode.Vehicle?.name,
      organization: vehicleCode.Vehicle?.Organization?.name,
      department: vehicleCode.Vehicle?.Department?.name,
      contragent: vehicleCode.Vehicle?.Contragent?.name,
      code: vehicleCode.code1c,
      trailer: vehicleCode.Aggregate?.name,
      drivers: vehicleCode.Drivers?.map(driver => driver?.name).filter(v => !!v),
    })),
  );

  constructor(
    readonly store: TransportStatusStore,
    private readonly http: HttpClient
  ) { }

  ngOnInit(): void {
    
    this.http.get<VehicleCode[]>('./assets/data.json').pipe(
      delay(500),
      tap(vehicleCodes => this.store.setState(state => ({ ...state, vehicleCodes })))
    ).subscribe();
  }

  ngAfterViewInit(): void {
    asapScheduler.schedule(() => this.tableRows$.subscribe(v => this.dataSource.data = v));
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  search(enteredValue: string): void {
    this.dataSource.filter = enteredValue.trim().toLowerCase();
    this.dataSource.paginator.firstPage();
  }
}
