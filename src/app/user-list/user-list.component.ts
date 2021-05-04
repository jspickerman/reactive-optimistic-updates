import { Component, OnInit } from '@angular/core';
import { merge, Observable, Subject } from 'rxjs';
import { map, mergeMap, shareReplay, startWith, switchMapTo, withLatestFrom, tap, switchMap } from 'rxjs/operators';
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
  refreshUsers$ = new Subject();

  /* API State Tracking */
  listLoaded$!: Observable<boolean>;
  listError$!: Observable<boolean>;
  newUserError$!: Observable<boolean>;

  constructor(private userService: UserService) { }

  private newUserIsTemp(newUser: User, tempUser: User): boolean {
    return (!tempUser.id && newUser.name === tempUser.name && newUser.dateOfBirth === tempUser.dateOfBirth);
  }

  ngOnInit(): void {
    /* Initial API request response and user data */
    const initialApiResponse$: Observable<UserCollectionResponse> = this.userService.getUsers().pipe(
      shareReplay()
    );
    const initialApiUsers$: Observable<User[]> = initialApiResponse$.pipe(
      map((res: UserCollectionResponse) => res?.data),
    );

    /* Re-fetched API request response and user data */
    const refreshedApiResponse$: Observable<UserCollectionResponse> = this.addUser$.pipe(
      mergeMap(() => this.userService.getUsers()),
      shareReplay()
    );
    const refreshedApiUsers$ = refreshedApiResponse$.pipe(
      map((res: UserCollectionResponse) => res?.data)
    );

    /* Flattened API Observables and derived values */
    const apiResponse$: Observable<UserCollectionResponse> = merge(initialApiResponse$, refreshedApiResponse$);
    const apiUsers$: Observable<User[]> = merge(initialApiUsers$, refreshedApiUsers$);

    this.listLoaded$ = apiResponse$.pipe(
      map(() => true),
      startWith(false)
    );

    this.listError$ = apiResponse$.pipe(
      map((res: UserCollectionResponse) => !!(res.error)),
      startWith(false)
    );

    /* Newly created user and derived values */
    const newUserResponse$: Observable<UserResourceResponse> = this.addUser$.pipe(
      mergeMap((newUser: User) => this.userService.updateUser(newUser)),
      shareReplay()
    );

    const newUser$: Observable<User> = newUserResponse$.pipe(
      map((res: ApiResponse) => res.data),
      tap(() => this.refreshUsers$.next())
    );

    this.newUserError$ = newUserResponse$.pipe(
      map((res: ApiResponse) => !!(res.error)),
      startWith(false)
    )

    /* Optimistic list of users with mock user from form */
    const optimisticUsers$: Observable<User[]> = this.addUser$.pipe(
      withLatestFrom(apiUsers$),
      map(([newUser, users]) => {
        return [...users, newUser];
      })
    );

    /* Updated list with optimistic user replaced by user from API */
    const newUsers$: Observable<User[]> = newUser$.pipe(
      withLatestFrom(optimisticUsers$),
      map(([newUser, optimisticUsers]) => optimisticUsers.map((user) => this.newUserIsTemp(newUser, user) ? newUser : user))
    )

    /* Flattened Observable for rendering users in UI */
    this.users$ = merge(apiUsers$, optimisticUsers$, newUsers$);
  }
}