import { Injectable } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { delay, map, scan, startWith, tap } from 'rxjs/operators';

export interface User {
  id?: string;
  name: string;
  dateOfBirth: string;
  field: string;
};

export interface ApiResponse {
  data: any;
  error: string;
}

export interface UserCollectionResponse extends ApiResponse {
  data: User[];
}

export interface UserResourceResponse extends ApiResponse {
  data: User;
}

let fakeUsers: User[] = [
  {
    id: '21431907-19ff-4527-b0ed-3b838ee80a1f',
    name: 'Isaac Newton',
    dateOfBirth: '01-04-1643',
    field: 'Mathematics'
  },
  {
    id: 'a2fbd5a1-2e42-40f1-8e65-adc894fe1a91',
    name: 'Albert Einstein',
    dateOfBirth: '03-14-1879',
    field: 'Physics'
  },
  {
    id: '9455c798-3e5b-4c16-8b0d-a66f61d23850',
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
    return of({data: {...user}, error: ''}).pipe(
      delay(500)
    )
  }
}
