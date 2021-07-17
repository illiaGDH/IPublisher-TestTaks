import { ComponentStore } from "@ngrx/component-store";
import { VehicleCode } from "../shared/interface";

interface TransportStatusState {
  vehicleCodes: VehicleCode[];
  organizationId: string | null;
  departmentId: string | null;
  contragentId: string | null;
}

export class TransportStatusStore extends ComponentStore<TransportStatusState> {
  constructor() {
    super({
      vehicleCodes: [],
      organizationId: null,
      departmentId: null,
      contragentId: null
    });
  }
}