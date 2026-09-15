export interface SidebarItem {
    label: string;
    icon: string;       
    route: string;      
    exact?: boolean;      
}

export interface SidebarSection {
    title?: string;       
    items: SidebarItem[];
}

export interface SidebarBrand {
    name: string;
    tagline?: string;
    icon?: string;        
}

export interface SidebarUser {
    name: string;
    role?: string;
}
