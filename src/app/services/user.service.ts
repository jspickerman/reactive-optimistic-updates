import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { delay, map, scan, startWith, tap } from 'rxjs/operators';

export interface User {
  name: String;
  dateOfBirth: String;
  field: String; 
};

export interface ApiResponse {
  data: User[];
  error: string;
}

let dummyUsers: User[] = [
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
      scan((dummyUsers, newUser) =>  [...dummyUsers, newUser], dummyUsers),
      startWith(dummyUsers)
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
    console.log('getting users!');
    return this.response$.pipe(delay(500));
  }

  updateUser(user: User): Observable<ApiResponse> {
    console.log('updating user!');
    this.newUser$.next(user);
    return this.response$.pipe(delay(650));
  }
}
