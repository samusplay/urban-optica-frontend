import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BackendService } from "../../../../services/backend.service";
import { PrescriptionResponse } from "../models/PrescriptionResponse";
import { PrescriptionUpload } from "../models/PrescriptionUploadDTO";

@Injectable({
  providedIn: "root",
})
export class formulaService {
  private endpoint = "prescriptions";

  constructor(private readonly backend: BackendService) {}
  // Funcionalidades
  // Subir Formula
  uploadPrescription(
    dto: PrescriptionUpload,
  ): Observable<PrescriptionResponse> {
    // 1. Convertimos a FormData usando el helper
    const payload = this.toFormData(dto);
    //dePURADOR
    console.log('--- REVISANDO FORM DATA ---');
    payload.forEach((value, key) => {
        console.log(key + ': ', value);
    });

    // 2. Enviamos la petición
    // La ruta final será: .../prescriptions/upload
    return this.backend.post<PrescriptionResponse>(
      `${this.endpoint}/upload`,
      payload,
    );
  }

  // Metodo para convertir La Tranformacion de datos(helper)
  private toFormData(dto: PrescriptionUpload): FormData {
    const formData = new FormData();

    // Append de datos básicos
    formData.append("userId", dto.userId.toString());
    formData.append("observaciones", dto.observaciones || "");

    // Append del archivo (Debe llamarse 'file' en el backend también)
    formData.append("file", dto.file);

    // Append opcional
    if (dto.fechaEmision) {
      formData.append("fechaEmision", dto.fechaEmision);
    }

    return formData;
  }
}
