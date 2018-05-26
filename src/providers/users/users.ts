import { Injectable } from '@angular/core';

export interface Users {
  id: number,
  name: string,
}

@Injectable()
export class UsersProvider {

  users: Users[] = [
    {id: 1, name: 'Julie'},
    {id: 2, name: 'Koos'},
    {id: 3, name: 'Johann'}
  ];

  constructor() {
    console.log('Hello UsersProvider Provider');
  }

  getUsers(){
    return this.users;
  }

}
