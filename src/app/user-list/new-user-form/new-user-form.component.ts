import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User, UserService } from '../../services/user.service';

@Component({
  selector: 'app-new-user-form',
  templateUrl: './new-user-form.component.html',
  styleUrls: ['./new-user-form.component.css']
})
export class NewUserFormComponent implements OnInit {

  @Output()
  newUser = new EventEmitter<User>();

  userForm = new FormGroup({
    name: new FormControl({value: ''}, Validators.required),
    field: new FormControl({value: ''}, Validators.required),
    dateOfBirth: new FormControl({value: ''}, Validators.required)
  })

  constructor(private userService: UserService) { }

  ngOnInit(): void {
  }

  // TODO: Basic format validation on date input?
  submit(): void {
    // const user: User = {
    //   name: this.name,
    //   field: this.field,
    //   dateOfBirth: this.dateOfBirth
    // }

    // this.newUser.emit(user);
    // this.userService.updateUser(user);
  }
}
