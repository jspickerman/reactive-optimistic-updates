import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, merge, Observable, Subject } from 'rxjs';
import { flatMap, map, mergeMap, shareReplay, startWith, switchMapTo, tap, withLatestFrom } from 'rxjs/operators';
import { ApiResponse, User, UserCollectionResponse, UserService } from '../services/user.service';

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

  /* Page State */
  loaded$!: Observable<boolean>;
  listError$!: Observable<boolean>;
  updateError$!: Observable<boolean>;

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

    this.listError$ = apiResponse$.pipe(
      map((res: UserCollectionResponse) => !!(res.error))
    );

    // const newUserResponse$ = this.addUser$.pipe(
    //   mergeMap((newUser: User) => this.userService.updateUser(newUser))
    // );

    // const newUser$ = newUserResponse$.pipe(
    //   map((res: ApiResponse) => res.data)
    // );

    // this.updateError$ = newUserResponse$.pipe(
    //   map((res: ApiResponse) => !(res.error)),
    //   startWith(false)
    // )

    const optimisticUsers$: Observable<User[]> = this.addUser$.pipe(
      withLatestFrom(latestApiUsers$),
      map(([newUser, users]) => {
        console.log('latest: ', users);
        return [...users, newUser];
      })
    );

    // const newUsers$: Observable<User[]> = combineLatest([newUser$, optimisticUsers$]).pipe(
    //   tap(([newUser, optimisticUsers]) => console.log('new user: ', optimisticUsers)),
    //   // map(([newUser, optimisticUsers]) => optimisticUsers.map((user) => !user.id && user.name === newUser.name ? newUser : user))
    // )

    this.loaded$ = apiResponse$.pipe(
      map(() => true)
    );

    this.users$ = latestApiUsers$;
  }
}
