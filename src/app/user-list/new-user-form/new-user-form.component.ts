import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { User, UserService } from '../../services/user.service';

@Component({
  selector: 'app-new-user-form',
  templateUrl: './new-user-form.component.html',
  styleUrls: ['./new-user-form.component.css']
})
export class NewUserFormComponent implements OnInit {

  @Output()
  newUser = new EventEmitter<User>();

  name!: string;
  field!: string;
  dateOfBirth!: string;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
  }

  // TODO: Basic format validation on date input?
  submit(): void {
    const user: User = {
      name: this.name,
      field: this.field,
      dateOfBirth: this.dateOfBirth
    }

    this.newUser.emit(user);
    this.userService.updateUser(user);
  }
}
