import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandedShelfComponent } from './branded-shelf.component';

describe('BrandedShelfComponent', () => {
  let component: BrandedShelfComponent;
  let fixture: ComponentFixture<BrandedShelfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrandedShelfComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrandedShelfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
