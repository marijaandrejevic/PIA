import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistracijaPoljoprivrednikComponent } from './registracija-poljoprivrednik.component';

describe('RegistracijaPoljoprivrednikComponent', () => {
  let component: RegistracijaPoljoprivrednikComponent;
  let fixture: ComponentFixture<RegistracijaPoljoprivrednikComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistracijaPoljoprivrednikComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistracijaPoljoprivrednikComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
