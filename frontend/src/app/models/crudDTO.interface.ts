export interface CrudConfig {
    title: string;
    subtitle: string;
    apiEndpoint: string;
    kpis: KpiConfig[];
    tableColumns: TableColumn[];
    formFields: FormField[];
}

export interface TableColumn {
    key: string;
    label: string;
    type: 'text' | 'badge' | 'date' | 'number';
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
    type: 'text' | 'email' | 'password' | 'number' | 'select' | 'checkbox';
    required?: boolean;
    options?: FormSelectOption[];
}

export interface FormSelectOption {
    value: string | number;
    label: string;
}
