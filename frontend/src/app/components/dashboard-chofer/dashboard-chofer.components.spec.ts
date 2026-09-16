import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardChoferComponents } from './dashboard-chofer.components';

describe('DashboardChoferComponents', () => {
  let component: DashboardChoferComponents;
  let fixture: ComponentFixture<DashboardChoferComponents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardChoferComponents],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardChoferComponents);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
