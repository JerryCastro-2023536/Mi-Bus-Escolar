import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { CloudinaryUploadResponse } from '../models/CloudinaryUploadResponse';
import { environment } from '../../environments/enviroments';

@Injectable({ providedIn: 'root' })
export class CloudinaryService {
    private http = inject(HttpClient);

    private readonly cloudName = environment.CLOUD_NAME;
    private readonly uploadPreset = environment.CLOUD_PRESET;
    private readonly uploadUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`;

    upload(file: File, folder?: string): Observable<string> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', this.uploadPreset);

        if (folder) {
            formData.append('folder', folder);
        }

        return this.http
            .post<CloudinaryUploadResponse>(this.uploadUrl, formData)
            .pipe(map(res => res.secure_url));
    }
}