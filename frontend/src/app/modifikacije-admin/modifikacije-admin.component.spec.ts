import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifikacijeAdminComponent } from './modifikacije-admin.component';

describe('ModifikacijeAdminComponent', () => {
  let component: ModifikacijeAdminComponent;
  let fixture: ComponentFixture<ModifikacijeAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModifikacijeAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifikacijeAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
