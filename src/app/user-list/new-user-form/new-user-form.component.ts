import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { User, UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-new-user-form',
  templateUrl: './new-user-form.component.html',
  styleUrls: ['./new-user-form.component.css']
})
export class NewUserFormComponent implements OnInit {

  @Output()
  newUser = new EventEmitter<User>();

  name: String;
  field: String;
  dateOfBirth: String;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
  }

  submit(): void {
    this.newUser.emit({name: this.name, field: this.field, dateOfBirth: this.dateOfBirth});
    this.userService.updateUser({name: this.name, field: this.field, dateOfBirth: this.dateOfBirth});
  }
}
