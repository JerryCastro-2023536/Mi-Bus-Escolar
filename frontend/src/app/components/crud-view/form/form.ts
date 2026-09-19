import { Component, input, output, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormField } from '../../../models/crudDTO.interface';
import { CloudinaryService } from '../../../services/cloudinary.service';


@Component({
  selector: 'app-crud-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form.html',
  styleUrl: './form.css'
})
export class FormComponent {
  //CLOUDINARY
  private cloudinaryService = inject(CloudinaryService);
  uploading = signal<Record<string, boolean>>({});
  imageFolder = input<string>('');

  fields = input.required<FormField[]>();
  item = input<any | null>(null);
  errors = input<Record<string, string>>({});

  save = output<any>();
  cancel = output<void>();

  /** Modelo del formulario */
  model: Record<string, any> = {};

  constructor() {
    // Reconstrucción del modelo
    effect(() => {
      const current = this.item();
      const initial: Record<string, any> = {};
      for (const field of this.fields()) {
        initial[field.key] = current
          ? this.formatInputValue(current[field.key], field.type)
          : (field.type === 'checkbox' ? false : '');
      }
      this.model = initial;
    });
  }

  private formatInputValue(value: any, type: FormField['type']): any {
    if (!value || (type !== 'date' && type !== 'time' && type !== 'datetime-local')) return value;

    if (type === 'date') return String(value).slice(0, 10);
    if (type === 'time') return String(value).slice(0, 5);

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    const pad = (part: number) => String(part).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  get isEditMode(): boolean {
    return !!this.item();
  }

  //CLOUDINARY METHODS
  onFileSelected(key: string, event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.uploading.update(state => ({ ...state, [key]: true }));

    this.cloudinaryService.upload(file, this.imageFolder()).subscribe({
      next: (url) => {
        this.model[key] = url;
        this.uploading.update(state => ({ ...state, [key]: false }));
      },
      error: () => {
        this.uploading.update(state => ({ ...state, [key]: false }));
        alert('No se pudo subir la imagen. Intenta de nuevo.');
      }
    });

    input.value = '';
  }

  removeImage(key: string) {
    this.model[key] = '';
  }

  isUploading(key: string): boolean {
    return !!this.uploading()[key];
  }

  hasPendingUploads(): boolean {
    return Object.values(this.uploading()).some(v => v);
  }

  onSubmit() {
    if (this.hasPendingUploads()) return;
    this.save.emit(this.model);
  }

  draggingImage = false;

  onDragOverImage(event: DragEvent): void {
    event.preventDefault(); 
    event.stopPropagation();
    this.draggingImage = true;
  }


  onDragLeaveImage(event: DragEvent): void {
    event.preventDefault();
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    if (
      event.clientX <= rect.left ||
      event.clientX >= rect.right ||
      event.clientY <= rect.top ||
      event.clientY >= rect.bottom
    ) {
      this.draggingImage = false;
    }
  }

  onFileDrop(key: string, event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.draggingImage = false;

    const file = event.dataTransfer?.files?.[0];
    if (!file) return;

    const input = document.getElementById(key) as HTMLInputElement | null;
    if (!input) return;

    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    input.files = dataTransfer.files;
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }

  onCancel() {
    this.cancel.emit();
  }
}