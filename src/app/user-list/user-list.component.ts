import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, merge, Observable, Subject } from 'rxjs';
import { map, shareReplay, startWith, switchMapTo, tap, withLatestFrom } from 'rxjs/operators';
import { ApiResponse, User, UserService } from '../services/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  /* Data Streams and Subjects */
  users$: Observable<User[]>;
  newUser$ = new Subject<User>();
  refreshUsers$ = new Subject();

  /* Page State */
  loaded$: Observable<boolean>;
  error$: Observable<boolean>;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    const apiResponse$ = this.userService.getUsers();

    const apiUsers$: Observable<User[]> = apiResponse$.pipe(
      map((res: ApiResponse) => res?.data)
    );

    const latestApiUsers$: Observable<User[]> = apiUsers$.pipe(
      shareReplay()
    );

    const optimisticUsers$ = this.newUser$.pipe(
      withLatestFrom(latestApiUsers$),
      map(([newUser, users]) => [...users, newUser]),
      tap(() => this.refreshUsers$.next())
    );

    const refreshedApiUsers$: Observable<User[]> = this.refreshUsers$.pipe(
      tap(() => console.log('switching to refresh!')),
      switchMapTo(apiUsers$),
      tap((data) => console.log('switched value: ', data))
    );

    this.loaded$ = apiResponse$.pipe(
      tap(() => console.log('loaded')),
      map(() => true),
      startWith(false)
    );

    this.error$ = apiResponse$.pipe(
      map((res: ApiResponse) => !!(res.error))
    );

    this.users$ = merge(latestApiUsers$, optimisticUsers$, refreshedApiUsers$);
  }
}
