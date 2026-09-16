export interface CrudConfig {
    title: string;
    subtitle: string;
    apiEndpoint: string;
    idKey: string;
    kpis: KpiConfig[];
    tableColumns: TableColumn[];
    formFields: FormField[]; //CREAR
    formFieldsEdit?: FormField[];
}

export interface TableColumn {
    key: string;
    label: string;
    type: 'text' | 'badge' | 'date' | 'number' | 'image';
}

export interface KpiConfig {
    title: string;
    valueKey: string;
    subtitle?: string;
    icon?: string;
}

export interface FormField {
    key: string;
    label: string;
    type: 'text' | 'email' | 'password' | 'number' | 'select' | 'checkbox' | 'date' | 'image';
    required?: boolean;
    readonly?: boolean;
    readonlyOnCreate?: boolean;
    readonlyOnEdit?: boolean;
    options?: FormSelectOption[];
}

export interface FormSelectOption {
    value: string | number;
    label: string;
}