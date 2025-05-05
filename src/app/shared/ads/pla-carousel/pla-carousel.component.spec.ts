import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaCarouselComponent } from './pla-carousel.component';

describe('PlaCarouselComponent', () => {
  let component: PlaCarouselComponent;
  let fixture: ComponentFixture<PlaCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaCarouselComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlaCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
