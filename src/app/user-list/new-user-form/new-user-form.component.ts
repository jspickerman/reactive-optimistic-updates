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

  name: String;
  field: String;
  dateOfBirth: String;

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

    this.newUser.emit(user); // Should we wait until this submits? We technically have a tiny race condition, server-side refresh scenario could be fleshed out to make the optimistic feature make more sense. Maybe the server could sort them?
    this.userService.updateUser(user);
  }
}
