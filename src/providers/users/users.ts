import { Injectable } from '@angular/core';

export interface Users {
  id: number,
  name: string,
  img: string
}

@Injectable()
export class UsersProvider {

  users: Users[] = [
    {id: 1, name: 'Julie', img: 'assets/imgs/Julian.JPG'},
    {id: 2, name: 'Koos', img: 'assets/imgs/Marcel.JPG'},
    {id: 3, name: 'Johann', img: 'assets/imgs/Johann.JPG'}
  ];

  constructor() {
    console.log('Hello UsersProvider Provider');
  }

  getUsers(){
    return this.users;
  }

}
