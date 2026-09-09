import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApiResponse } from '../models/apiResponseDTO.interface';

@Injectable({ providedIn: 'root' })
export class CrudService {
    private http = inject(HttpClient);
    private baseUrl = 'http://localhost:3000/api';

    getAll<T>(endpoint: string): Observable<T[]> {
        return this.http.get<ApiResponse<T[]>>(`${this.baseUrl}${endpoint}`).pipe(map(res => res.data));
    }

    getById<T>(endpoint: string, id: string | number): Observable<T> {
        return this.http.get<ApiResponse<T>>(`${this.baseUrl}${endpoint}/${id}`).pipe(map(res => res.data));
    }

    create<T>(endpoint: string, data: Partial<T>): Observable<T> {
        return this.http.post<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, data).pipe(map(res => res.data));
    }

    update<T>(endpoint: string, id: string | number, data: Partial<T>): Observable<T> {
        return this.http.put<ApiResponse<T>>(`${this.baseUrl}${endpoint}/${id}`, data).pipe(map(res => res.data));
    }

    delete(endpoint: string, id: string | number): Observable<void> {
        return this.http.delete<ApiResponse<void>>(`${this.baseUrl}${endpoint}/${id}`).pipe(map(() => undefined));
    }

    
}