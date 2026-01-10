import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { BackendService } from "../../../../services/backend.service";
import { PrescriptionUpload } from "../models/PrescriptionUploadDTO";
import { Observable } from "rxjs";
import { PrescriptionResponse } from "../models/PrescriptionResponse";

@Injectable({
    providedIn: "root",
})
export class formulaService {
    private apiUrl = environment.apiUrl;
    private endpoint = "prescriptions"

    constructor(private readonly backend: BackendService) { }
    //Funcionalidades
    //Subir Formula
    uploadPrescription(dto: PrescriptionUpload): Observable<PrescriptionResponse> {
        const payload = this.toFormData(dto);
        return this.backend.post<PrescriptionResponse>(`${this.endpoint}/upload`, payload);
    }

    //Metodo para convertir La Tranformacion de datos(helper)
    private toFormData(dto: PrescriptionUpload): FormData {
    const formData = new FormData();
    
    formData.append('userId', dto.userId.toString());
    formData.append('observaciones', dto.observaciones || '');
    formData.append('file', dto.file);

    if (dto.fechaEmision) {
      formData.append('fechaEmision', dto.fechaEmision);
    }

    return formData;
  }


}