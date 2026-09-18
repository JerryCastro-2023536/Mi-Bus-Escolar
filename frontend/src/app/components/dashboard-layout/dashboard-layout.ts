import { Component, computed, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet, ActivatedRouteSnapshot } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar';
import { HeaderComponent } from './header/header';
import { LoginService } from '../../services/login';
import { miBusEscolarBrand, miBusEscolarSidebarConfig } from '../../config/sidebar-nav.config';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs/operators';

function getDeepestRouteData(router: Router): Record<string, any> {
    let node: ActivatedRouteSnapshot = router.routerState.snapshot.root;
    while (node.firstChild) {
        node = node.firstChild;
    }
    return node.data ?? {};
}

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [SidebarComponent, HeaderComponent, RouterOutlet],
    templateUrl: './dashboard-layout.html',
    styleUrl: './dashboard-layout.css'
})
export class DashboardComponent {

    private loginService = inject(LoginService);
    private router = inject(Router);
    hideHeader = () => !!this.routeData()['hideHeader'];

    private routeData = toSignal(
        this.router.events.pipe(
            filter((e): e is NavigationEnd => e instanceof NavigationEnd),
            map(() => getDeepestRouteData(this.router)),
            startWith(getDeepestRouteData(this.router))
        ),
        { initialValue: {} as Record<string, any> }
    );

    pageTitle = () => this.routeData()['title'] as string | undefined;
    pageSubtitle = () => this.routeData()['subtitle'] as string | undefined;

    brand = miBusEscolarBrand;
    sections = miBusEscolarSidebarConfig;

    sidebarUser = computed(() => {
        const u = this.loginService.user();
        return u
            ? { name: u.nombre ?? u.name ?? 'Usuario', role: u.rol, foto: u.foto_usuario }
            : null;
    });

    onLogout(): void {
        this.loginService.logout();
        this.router.navigateByUrl('/login');
    }
}