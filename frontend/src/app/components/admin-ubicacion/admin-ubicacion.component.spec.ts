import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminUbicacionComponent } from './admin-ubicacion.component';

describe('AdminUbicacionComponent', () => {
  let component: AdminUbicacionComponent;
  let fixture: ComponentFixture<AdminUbicacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminUbicacionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminUbicacionComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
