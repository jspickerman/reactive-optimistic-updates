import { Component, OnInit } from '@angular/core';
import { merge, Observable, Subject } from 'rxjs';
import { map, mergeMap, shareReplay, startWith, switchMapTo, withLatestFrom } from 'rxjs/operators';
import { ApiResponse, User, UserCollectionResponse, UserResourceResponse, UserService } from '../services/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  /* Data Streams and Subjects */
  users$: Observable<User[]>;
  addUser$ = new Subject<User>();
  postUser$ = new Subject();
  refreshUsers$ = new Subject();

  /* API State Tracking */
  listLoaded$!: Observable<boolean>;
  listError$!: Observable<boolean>;
  newUserError$!: Observable<boolean>;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    const apiResponse$: Observable<UserCollectionResponse> = this.userService.getUsers();
    const apiUsers$: Observable<User[]> = apiResponse$.pipe(
      map((res: UserCollectionResponse) => res.data)
    );
    const latestApiUsers$: Observable<User[]> = apiUsers$.pipe(
      shareReplay()
    );
    const refreshedApiUsers$: Observable<User[]> = this.refreshUsers$.pipe(
      switchMapTo(apiUsers$),
    );

    this.listLoaded$ = apiResponse$.pipe(
      map(() => true)
    );

    this.listError$ = apiResponse$.pipe(
      map((res: UserCollectionResponse) => !!(res.error))
    );

    const newUserResponse$: Observable<UserResourceResponse> = this.addUser$.pipe(
      mergeMap((newUser: User) => this.userService.updateUser(newUser))
    );

    const newUser$: Observable<User> = newUserResponse$.pipe(
      map((res: ApiResponse) => res.data)
    );

    this.newUserError$ = newUserResponse$.pipe(
      map((res: ApiResponse) => !!(res.error)),
      startWith(false)
    )

    const optimisticUsers$: Observable<User[]> = this.addUser$.pipe(
      withLatestFrom(latestApiUsers$),
      map(([newUser, users]) => {
        return [...users, newUser];
      })
    );

    const newUsers$: Observable<User[]> = newUser$.pipe(
      withLatestFrom(optimisticUsers$),
      map(([newUser, optimisticUsers]) => optimisticUsers.map((user) => !user.id && user.name === newUser.name ? newUser : user))
    )

    this.users$ = merge(latestApiUsers$, refreshedApiUsers$, optimisticUsers$, newUsers$);
  }
}
