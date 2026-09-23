import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapaComponent } from './mapa.component';

describe('MapaComponent', () => {
  let component: MapaComponent;
  let fixture: ComponentFixture<MapaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MapaComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should disable point selection while tracking a live route for users', () => {
    component.rol = 'usuario';
    component.posicionChofer = { lat: 14.62, lng: -90.52 };

    expect((component as any).debePermitirSeleccionPunto()).toBeFalse();
  });
});
