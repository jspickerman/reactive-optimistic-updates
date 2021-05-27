import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserComponent } from './user.component';

describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;
  let h3: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    h3 = fixture.nativeElement.querySelector('h3');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it ('should display name', () => {
    fixture.detectChanges();
    expect(h3.textContent).toContain(component.user.name);
  })
});
