import { Injectable } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { delay, map, scan, startWith, tap } from 'rxjs/operators';
import { v4 as uuid } from 'uuid';

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

/* Initial set of fake user data */
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

/* Newly created users go here, this is to avoid some funky pass-by-reference issues */
let newUsers: User[] = [];

@Injectable({
  providedIn: 'root'
})
export class UserService {

  users$: Observable<User[]>;
  response$: Observable<ApiResponse>;
  newUser$ = new Subject<User>();

  constructor() { }

  getUsers(): Observable<ApiResponse> {
    console.log('get users!');
    return of({data: [...fakeUsers, ...newUsers], error: ''}).pipe(
      delay(500)
    )
  }

  updateUser(user: User): Observable<ApiResponse> {
    console.log('update user!');
    const createdUser = {...user, id: uuid()}
    newUsers = [...newUsers, createdUser];
    return of({data: createdUser, error: ''}).pipe(
      delay(5000)
    )
  }
}
