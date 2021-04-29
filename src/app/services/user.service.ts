import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { delay, map, scan, startWith } from 'rxjs/operators';

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
      startWith(fakeUsers)
    );
    this.response$ = this.users$.pipe(
      map((users) => {
        return {
          data: users, 
          error: ''
        }
      })
    )
  }

  getUsers(): Observable<ApiResponse> {
    return this.response$.pipe(delay(500));
  }

  updateUser(user: User): Observable<ApiResponse> {
    this.newUser$.next(user);
    return this.response$.pipe(delay(650));
  }
}
