import { Component, input, output, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormField } from '../../../models/crudDTO.interface';


@Component({
  selector: 'app-crud-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form.html',
  styleUrl: './form.css'
})
export class FormComponent {
  fields = input.required<FormField[]>();
  item = input<any | null>(null);

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
        initial[field.key] = current ? current[field.key] : (field.type === 'checkbox' ? false : '');
      }
      this.model = initial;
    });
  }

  get isEditMode(): boolean {
    return !!this.item();
  }

  onSubmit() {
    this.save.emit(this.model);
  }

  onCancel() {
    this.cancel.emit();
  }
}