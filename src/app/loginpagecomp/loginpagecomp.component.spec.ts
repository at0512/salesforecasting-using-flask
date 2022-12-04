import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginpagecompComponent } from './loginpagecomp.component';

describe('LoginpagecompComponent', () => {
  let component: LoginpagecompComponent;
  let fixture: ComponentFixture<LoginpagecompComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginpagecompComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginpagecompComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
