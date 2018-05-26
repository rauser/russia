import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import {Item} from 'ionic-angular';

@Injectable()
export class FirebaseProvider {

  constructor(public afd: AngularFireDatabase) {
    console.log('Hello FirebaseProvider Provider');
  }

  getExpenses(){
    return this.afd.list('/expenses').valueChanges();
  }

  addExpense(expense: any){
    this.afd.list('/expenses').push(expense);
  }

  removeExpense(id){
    this.afd.list('/expenses').remove(id);
  }

}
