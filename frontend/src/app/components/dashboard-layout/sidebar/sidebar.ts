import { Component, OnInit, PLATFORM_ID, inject, input, output, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SidebarBrand, SidebarSection, SidebarUser } from '../../../models/sidebar.model';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, RouterLink, RouterLinkActive],
    templateUrl: './sidebar.html',
    styleUrl: './sidebar.css'
})
export class SidebarComponent implements OnInit {
    private platformId = inject(PLATFORM_ID);

    brand = input<SidebarBrand>({ name: 'Mi Bus Escolar', tagline: 'Transporte Seguro', icon: 'bus' });
    sections = input<SidebarSection[]>([]);
    user = input<SidebarUser | null>(null);

    storageKey = input<string>('sidebar-collapsed');
    logout = output<void>();

    collapsed = signal(false);

    ngOnInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            const saved = localStorage.getItem(this.storageKey());
            if (saved !== null) {
                this.collapsed.set(saved === 'true');
            }
        }
    }

    toggle(): void {
        this.collapsed.update(v => !v);

        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem(this.storageKey(), String(this.collapsed()));
        }
    }

    onLogout(): void {
        this.logout.emit();
    }
}
