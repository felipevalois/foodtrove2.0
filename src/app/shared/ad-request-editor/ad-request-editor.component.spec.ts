import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdRequestEditorComponent } from './ad-request-editor.component';

describe('AdRequestEditorComponent', () => {
  let component: AdRequestEditorComponent;
  let fixture: ComponentFixture<AdRequestEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdRequestEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdRequestEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
