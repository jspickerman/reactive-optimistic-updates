import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { delay, map, scan, startWith, tap } from 'rxjs/operators';

export interface User {
  name: string;
  dateOfBirth: string;
  field: string; 
};

export interface ApiResponse {
  data: any;
  error: string;
}

let fakeUsers: User[] = [
  {
    name: 'Isaac Newton',
    dateOfBirth: '01-04-1643',
    field: 'Mathematics'
  },
  {
    name: 'Albert Einstein',
    dateOfBirth: '03-14-1879',
    field: 'Physics'
  },
  {
    name: 'Marie Curie',
    dateOfBirth: '07-04-1934',
    field: 'Chemistry'
  }
];

@Injectable({
  providedIn: 'root'
})
export class UserService {

  users$: Observable<User[]>;
  response$: Observable<ApiResponse>;
  newUser$ = new Subject<User>();

  constructor() { 
    this.users$ = this.newUser$.pipe(
      scan((fakeUsers, newUser) =>  [...fakeUsers, newUser], fakeUsers),
      startWith(fakeUsers),
      tap((users) => console.log('user scan: ', users))
    );
    this.response$ = this.users$.pipe(
      map((users) => {
        console.log('here are the users: ', users)
        return {
          data: users, 
          error: ''
        }
      })
    )
  }

  getUsers(): Observable<ApiResponse> {
    console.log('get users!');
    // return this.response$.pipe(delay(500));
    return of({data: fakeUsers, error: ''}).pipe(
      delay(500)
    )
  }

  updateUser(user: User): Observable<ApiResponse> {
    console.log('update user!');
    // this.newUser$.next(user);
    // return this.response$.pipe(delay(650));
    // fakeUsers.push(user);
    return of({data: user, error: ''}).pipe(
      delay(500)
    )
  }
}
