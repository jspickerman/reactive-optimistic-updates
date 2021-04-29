import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, merge, Observable, Subject } from 'rxjs';
import { flatMap, map, mergeMap, shareReplay, startWith, switchMapTo, tap, withLatestFrom } from 'rxjs/operators';
import { ApiResponse, User, UserService } from '../services/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  /* Data Streams and Subjects */
  users$!: Observable<User[]>;
  addUser$ = new Subject<User>();
  postUser$ = new Subject();
  refreshUsers$ = new Subject();

  /* Page State */
  loaded$!: Observable<boolean>;
  error$!: Observable<boolean>;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    const apiResponse$: Observable<ApiResponse> = this.userService.getUsers();
    const apiUsers$: Observable<User[]> = apiResponse$.pipe(
      map((res: ApiResponse) => res?.data)
    );
    const latestApiUsers$: Observable<User[]> = apiUsers$.pipe(
      shareReplay()
    );

    const newUser$ = this.addUser$.pipe(
      mergeMap((newUser: User) => this.userService.updateUser(newUser).pipe(map((res) => res.data)))
    );

    const mergedUsers$ = merge(newUser$, this.addUser$);

    const optimisticUsers$: Observable<User[]> = mergedUsers$.pipe(
      withLatestFrom(latestApiUsers$),
      map(([newUser, users]) => {
        // console.log(newUser);
        // console.log(users);
        return [...users, newUser];
      }),
      // tap(() => this.refreshUsers$.next())
    );

    const refreshedApiUsers$: Observable<User[]> = this.refreshUsers$.pipe(
      switchMapTo(apiUsers$),
    );

    this.loaded$ = apiResponse$.pipe(
      map(() => true),
      startWith(false)
    );

    this.error$ = apiResponse$.pipe(
      map((res: ApiResponse) => !!(res.error)),
    );

    this.users$ = merge(latestApiUsers$, optimisticUsers$, refreshedApiUsers$);
  }
}
