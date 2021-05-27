import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, tap} from 'rxjs/operators';
import { v4 as uuid } from 'uuid';

export interface User {
  id?: string;
  name: string;
  dateOfBirth: string;
  field: string;
};

export interface ApiResponse<Type = any> {
  data: Type;
  error: string;
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

/* Newly created users go here. Local variable is to avoid some funky pass-by-reference issues */
let newUsers: User[] = [];

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  getUsers(): Observable<ApiResponse<User[]>> {
    return of({data: [...fakeUsers, ...newUsers], error: ''}).pipe(
      delay(2500)
    )
  }

  addUser(user: User): Observable<ApiResponse<User>> {
    const newUser = {...user, id: uuid()}
    newUsers = [...newUsers, newUser];
    return of({data: newUser, error: ''}).pipe(
      delay(450)
    )
  }
}
