import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { User, UserService } from '../../services/user.service';

@Component({
  selector: 'app-new-user-form',
  templateUrl: './new-user-form.component.html',
  styleUrls: ['./new-user-form.component.css']
})
export class NewUserFormComponent implements OnDestroy {

  @Output()
  newUser = new EventEmitter<User>();

  userForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    field: ['', Validators.required],
    dateOfBirth: ['', Validators.required]
  });

  destroyed$ = new Subject<boolean>();

  constructor(private fb: FormBuilder, private userService: UserService) { }

  // TODO: Basic format validation on date input?
  submit(): void {
    const user: User = {
      name: this.userForm.get('name').value,
      field: this.userForm.get('field').value,
      dateOfBirth: this.userForm.get('dateOfBirth').value
    }

    this.newUser.emit(user);
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
