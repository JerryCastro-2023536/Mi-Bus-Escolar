import { inject, Injectable } from "@angular/core";
import { ApiResponse } from "../models/apiResponseDTO.interface";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";

@Injectable({ providedIn: 'root' })
export class CrudService {
    private http = inject(HttpClient);
    private baseUrl = environment.API_URL;

    getAll<T>(endpoint: string): Observable<ApiResponse<T[]>> {
        return this.http.get<ApiResponse<T[]>>(`${this.baseUrl}${endpoint}`);
    }

    getById<T>(endpoint: string, id: string | number): Observable<ApiResponse<T>> {
        return this.http.get<ApiResponse<T>>(`${this.baseUrl}${endpoint}/${id}`);
    }

    create<T>(endpoint: string, data: Partial<T>): Observable<ApiResponse<T>> {
        return this.http.post<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, data);
    }

    update<T>(endpoint: string, id: string | number, data: Partial<T>): Observable<ApiResponse<T>> {
        return this.http.put<ApiResponse<T>>(`${this.baseUrl}${endpoint}/${id}`, data);
    }

    delete(endpoint: string, id: string | number): Observable<ApiResponse<void>> {
        return this.http.delete<ApiResponse<void>>(`${this.baseUrl}${endpoint}/${id}`);
    }

    getKpis(endpoint: string): Observable<ApiResponse<Record<string, number | string>>> {
    return this.http.get<ApiResponse<Record<string, number | string>>>(
        `${this.baseUrl}/kpis${endpoint}`
    );
}
}