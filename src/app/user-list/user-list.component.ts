import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, iif, merge, Observable, Subject } from 'rxjs';
import { map, mergeMap, shareReplay, startWith, withLatestFrom, tap, mapTo, filter } from 'rxjs/operators';
import { ApiResponse, User, UserService } from '../services/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  /* Data Streams and Subjects */
  users$: Observable<User[]>;
  addUser$ = new Subject<User>();
  fetchUsers$ = new BehaviorSubject<boolean>(true);

  /* API State Tracking */
  usersLoaded$!: Observable<boolean>;
  usersError$!: Observable<boolean>;
  newUserError$!: Observable<boolean>;

  constructor(private userService: UserService) { }

  private newUserIsTemp(newUser: User, tempUser: User): boolean {
    return (!tempUser.id && newUser.name === tempUser.name && newUser.dateOfBirth === tempUser.dateOfBirth);
  }

  ngOnInit(): void {
    /* API request response and user data */
    const apiResponse$: Observable<ApiResponse<User[]>> = this.fetchUsers$.pipe(
      mergeMap(() => this.userService.getUsers()),
      shareReplay()
    );

    const apiUsers$: Observable<User[]> = apiResponse$.pipe(
      map((res: ApiResponse<User[]>) => res?.data)
    );

    /* Boolean Observables derived from API data */
    this.usersLoaded$ = apiResponse$.pipe(
      mapTo(true),
      startWith(false)
    );

    this.usersError$ = apiResponse$.pipe(
      map((res: ApiResponse<User[]>) => !!(res.error)),
      startWith(false)
    );

    /* Optimistic list of users with mock user from form */
    const optimisticUsers$: Observable<User[]> = this.addUser$.pipe(
      withLatestFrom(apiUsers$),
      map(([newUser, users]) => [...users, newUser])
    );

    /* New user POST response, user data and error boolean */
    const newUserResponse$: Observable<ApiResponse<User>> = this.addUser$.pipe(
      mergeMap((newUser: User) => this.userService.addUser(newUser)),
      tap(() => this.fetchUsers$.next(true)),
      shareReplay()
    );

    const newUser$: Observable<User> = newUserResponse$.pipe(
      map((res: ApiResponse<User>) => res?.data)
    );

    this.newUserError$ = newUserResponse$.pipe(
      map((res: ApiResponse<User>) => !!(res.error)),
      startWith(false)
    );

    /* Updated list with optimistic user replaced by user from API */
    const newUsers$: Observable<User[]> = newUser$.pipe(
      withLatestFrom(optimisticUsers$),
      map(([newUser, optimisticUsers]) => optimisticUsers.map((user) => this.newUserIsTemp(newUser, user) ? newUser : user))
    );

    /* Flattened Observable for rendering users in UI */
    this.users$ = merge(apiUsers$, optimisticUsers$, newUsers$);
  }
}