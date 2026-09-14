import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChoferViewComponents } from './chofer-view.components';

describe('ChoferViewComponents', () => {
  let component: ChoferViewComponents;
  let fixture: ComponentFixture<ChoferViewComponents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChoferViewComponents],
    }).compileComponents();

    fixture = TestBed.createComponent(ChoferViewComponents);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
