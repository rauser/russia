import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {FirebaseProvider} from "../../providers/firebase/firebase";
import {AngularFireList} from "angularfire2/database";
import {UsersProvider} from "../../providers/users/users";
import {Observable} from "rxjs/Observable";

export interface Expense{
  amount: number,
  expense: string,
  userid: number,
  date: string,
}

@IonicPage()
@Component({
  selector: 'page-expenses',
  templateUrl: 'expenses.html',
})
export class ExpensesPage {

  expenses: Observable<any>;

  newexpense: Expense = {amount: 0, expense: 'Bier', userid: 1, date: new Date().toISOString()};

  users: any[] = [];

  constructor(public navCtrl: NavController,
              public fireProv: FirebaseProvider,
              public usersProv: UsersProvider,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ExpensesPage');
    this.getExpenses();
    this.users = this.usersProv.getUsers();
  }

  getExpenses(){
    this.fireProv.getExpenses().subscribe(
      res => {console.log(res)},
      err => {console.log(err)}
    );
  }

  addExpense(){
    this.fireProv.addExpense(this.newexpense);
  }

}
