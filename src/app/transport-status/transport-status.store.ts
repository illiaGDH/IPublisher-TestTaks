import { ComponentStore } from "@ngrx/component-store";
import { Observable } from "rxjs";
import { Contragent, Department, Organization, Vehicle, VehicleCode } from "../shared/interface";

interface TransportStatusState {
  vehicleCodes: VehicleCode[];
  organizationId: string | null;
  departmentId: string | null;
  contragentId: string | null;
}

export class TransportStatusStore extends ComponentStore<TransportStatusState> {

  private getAndSortBy <T extends 'Organization' | 'Department' | 'Contragent'> (typeToSortBy: T) {
    return (arr: VehicleCode[]): Vehicle[T][] => {
      return arr.map((v => v.Vehicle[typeToSortBy]))
      .filter((v, i, arr) => !!v && !!v.id && v.name && arr.findIndex(_v => _v?.id == v?.id) === i)
      .sort((cur, next) => cur.name.toLowerCase().localeCompare(next.name.toLowerCase()));
    }
  }

  constructor() {
    super({
      vehicleCodes: [],
      organizationId: null,
      departmentId: null,
      contragentId: null
    });
  }
  
  readonly vehicleCodes$ = this.select(state => state.vehicleCodes);
  readonly organizationId$ = this.select(state => state.organizationId);
  readonly departmentId$ = this.select(state => state.departmentId);
  readonly contragentId$ = this.select(state => state.contragentId);

  readonly organizations$: Observable<Organization[]> = this.select(this.vehicleCodes$, this.getAndSortBy("Organization"));
  readonly vehicleCodesFilteredByOrganization$ = this.select(
    this.vehicleCodes$,
    this.organizationId$,
    (arr, id) => !id ? arr : arr.filter(vehicleCode => vehicleCode?.Vehicle?.organizationId === id)
  );

  readonly departments$: Observable<Department[]> = this.select(this.vehicleCodesFilteredByOrganization$, this.getAndSortBy('Department'));
  readonly vehicleCodesFilteredByDepartment$ = this.select(
    this.vehicleCodesFilteredByOrganization$,
    this.departmentId$,
    (arr, id) => !id ? arr : arr.filter(vehicleCode => vehicleCode?.Vehicle?.departmentId === id)
  );

  readonly contragents$: Observable<Contragent[]> = this.select(this.vehicleCodesFilteredByDepartment$, this.getAndSortBy('Contragent'));
  readonly vehicleCodesFilteredByContragent$ = this.select(
    this.vehicleCodesFilteredByDepartment$,
    this.contragentId$,
    (arr, id) => !id ? arr : arr.filter(vehicleCode => vehicleCode?.Vehicle?.contragentId === id)
  );

  readonly setOrganizationId = this.updater((state, organizationId: string | null) => ({ ...state, organizationId }));
  readonly setDepartmentId = this.updater((state, departmentId: string | null) => ({ ...state, departmentId }));
  readonly setContragentId = this.updater((state, contragentId: string | null) => ({ ...state, contragentId }));
}

