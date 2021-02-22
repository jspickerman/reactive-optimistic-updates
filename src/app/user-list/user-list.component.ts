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

  users$: Observable<User[]>;
  newUser$ = new Subject<User>();
  refreshUsers$ = new Subject();

  loaded$: Observable<boolean>;
  error$ = new BehaviorSubject<boolean>(false);

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    const apiUsers$: Observable<User[]> = this.userService.getUsers().pipe(
      tap((res: ApiResponse) => this.error$.next(!!(res.error))),
      map((res: ApiResponse) => res?.data)
    );

    const latestApiUsers$: Observable<User[]> = apiUsers$.pipe(
      shareReplay()
    );

    const refreshedApiUsers$: Observable<User[]> = this.refreshUsers$.pipe(
      switchMapTo(apiUsers$)
    );

    const optimisticUsers$ = this.newUser$.pipe(
      tap(() => this.refreshUsers$.next()),
      withLatestFrom(latestApiUsers$),
      map(([newUser, users]) => [...users, newUser])
    );

    this.users$ = merge(apiUsers$, optimisticUsers$, refreshedApiUsers$);
    this.loaded$ = apiUsers$.pipe(
      map(() => true),
      startWith(false)
    );
  }

}
