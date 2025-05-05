import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaComponent } from './pla.component';

describe('PlaComponent', () => {
  let component: PlaComponent;
  let fixture: ComponentFixture<PlaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
