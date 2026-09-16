import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChoferDashboardComponents } from './chofer-dashboard.components';

describe('ChoferDashboardComponents', () => {
  let component: ChoferDashboardComponents;
  let fixture: ComponentFixture<ChoferDashboardComponents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChoferDashboardComponents],
    }).compileComponents();

    fixture = TestBed.createComponent(ChoferDashboardComponents);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
