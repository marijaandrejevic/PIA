import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistracijaPreduzeceComponent } from './registracija-preduzece.component';

describe('RegistracijaPreduzeceComponent', () => {
  let component: RegistracijaPreduzeceComponent;
  let fixture: ComponentFixture<RegistracijaPreduzeceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistracijaPreduzeceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistracijaPreduzeceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
