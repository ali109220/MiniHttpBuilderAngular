import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HtmlDocumentViewComponent } from './html-document-view.component';

describe('HtmlDocumentViewComponent', () => {
  let component: HtmlDocumentViewComponent;
  let fixture: ComponentFixture<HtmlDocumentViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HtmlDocumentViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HtmlDocumentViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
