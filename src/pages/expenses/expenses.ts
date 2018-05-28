import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {FirebaseProvider} from "../../providers/firebase/firebase";
import {UsersProvider} from "../../providers/users/users";
import {VariousProvider} from "../../providers/various/various";

export interface Expense{
  amount: number,
  expense: string,
  userid: number,
  user: string,
}

@IonicPage()
@Component({
  selector: 'page-expenses',
  templateUrl: 'expenses.html',
})
export class ExpensesPage {

  expenses: any[] = [];
  expensesToShow: any[] = [];

  newexpense: Expense = {amount: 0, expense: '', userid: 1, user: ''};

  users: any[] = [];

  constructor(public navCtrl: NavController,
              public fireProv: FirebaseProvider,
              public usersProv: UsersProvider,
              public varProv: VariousProvider,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ExpensesPage');
    this.users = this.usersProv.getUsers();
    this.getExpenses();
  }

  getExpenses(){
    this.fireProv.getExpenses().subscribe(
      (res) => {
        this.expenses = [];
        for(let user of this.users){
          user.credit = 0;
        }
        console.log(res);
        for(let expense in res){
          res[expense].key = expense;
          this.expenses.push(res[expense]);
          for(let user of this.users){
            if(res[expense].userid == user.id){
              user.credit += res[expense].amount * ((this.users.length - 1)/(this.users.length));
            } else {
              user.credit -= res[expense].amount * (1 / this.users.length);
            }
          }
        }
        this.expensesToShow = this.expenses.reverse();
        console.log(this.expenses);
      },
      (err) => {console.log(err)}
    );
  }

  addExpense(){
    for(let user of this.users){
      if(user.id == this.newexpense.userid){
        this.newexpense.user = user.name;
      }
    }
    if(this.newexpense.user && this.newexpense.userid && this.newexpense.amount && this.newexpense.expense){
      this.fireProv.addExpense(this.newexpense).then(() => {
        this.varProv.showToast('Ausgabe eingetragen');
        this.newexpense.amount = 0;
        this.newexpense.userid = 1;
        this.newexpense.expense = '';
      });
    }
  }

  removeExpense(key: any){
    this.fireProv.removeExpense(key);
  }

}
