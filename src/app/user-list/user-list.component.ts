import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, merge, Observable, Subject } from 'rxjs';
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
  listError$ = new Subject<boolean>();
  updateError$ = new Subject<boolean>();

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    const apiResponse$: Observable<ApiResponse> = this.userService.getUsers();
    const apiUsers$: Observable<User[]> = apiResponse$.pipe(
      tap((res: ApiResponse) => this.listError$.next(!!(res.error))),
      map((res: ApiResponse) => res.data)
    );
    const latestApiUsers$: Observable<User[]> = apiUsers$.pipe(
      shareReplay()
    );

    const newUser$ = this.addUser$.pipe(
      mergeMap((newUser: User) => this.userService.updateUser(newUser).pipe(
        tap((res: ApiResponse) => this.updateError$.next(!!(res.error))),
        map((res: ApiResponse) => res.data)
      ))
    );

    const optimisticUsers$: Observable<User[]> = this.addUser$.pipe(
      withLatestFrom(latestApiUsers$),
      map(([newUser, users]) => {
        // console.log(newUser);
        console.log('latest: ', users);
        return [...users, newUser];
      }),
      tap((opt) => console.log('optimistic: ', opt))
    );

    const newUsers$ = combineLatest([newUser$, optimisticUsers$]).pipe(
      tap((data) => console.log('new stream: ', data))
    )

    const refreshedApiUsers$: Observable<User[]> = this.refreshUsers$.pipe(
      switchMapTo(apiUsers$),
    );

    this.loaded$ = apiResponse$.pipe(
      map(() => true),
      startWith(false)
    );

    this.users$ = merge(latestApiUsers$, newUsers$, refreshedApiUsers$);
  }
}
