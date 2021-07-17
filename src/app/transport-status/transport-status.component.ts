import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs/operators';
import { VehicleCode } from '../shared/interface';
import { TransportStatusStore } from './transport-status.store';

@Component({
  selector: 'app-transport-status',
  templateUrl: './transport-status.component.html',
  styleUrls: ['./transport-status.component.scss'],
  providers: [TransportStatusStore]
})
export class TransportStatusComponent implements OnInit {

  constructor(
    private readonly store: TransportStatusStore,
    private readonly http: HttpClient
  ) { }

  ngOnInit(): void {
    this.http.get<VehicleCode[]>('./assets/data.json').pipe(
      tap(vehicleCodes => this.store.setState(state => ({ ...state, vehicleCodes })))
    ).subscribe();
  }

}
