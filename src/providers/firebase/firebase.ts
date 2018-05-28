import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import {DatePipe} from "@angular/common";
import {AlertController} from "ionic-angular";
import {VariousProvider} from "../various/various";

@Injectable()
export class FirebaseProvider {

  constructor(public afd: AngularFireDatabase,
              public datePipe: DatePipe,
              public alertCtrl: AlertController,
              public varProv: VariousProvider) {
    console.log('Hello FirebaseProvider Provider');
  }

  getDate(){
    let date = new Date().toISOString();
    console.log(date);
    return this.datePipe.transform(date , 'dd.MM.yyyy - HH:mm');
  }

  getExpenses(){
    return this.afd.object('/expenses/').valueChanges();
  }

  addExpense(expense: any){
    expense.date = this.getDate();
    console.log(expense.date);
    return this.afd.list('/expenses').push(expense);
  }

  removeExpense(id){
    let alert = this.alertCtrl.create({
      title: 'Ausgabe löschen',
      message: 'Sicher, dass du das löschen willst?',
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel',
          handler: () => {
            console.log('Delete cancelled');
          }
        },
        {
          text: 'Löschen',
          handler: () => {
            console.log('Delete confirmed');
            this.afd.list('/expenses').remove(id).then(() => {
              this.varProv.showToast('Ausgabe gelöscht');
            }) .catch(() => {
              this.varProv.showToast('Löschen nicht möglich, frag Johann was los ist...');
            })
          }
        }
      ]
    });
    alert.present();
  }

  getTravels(){
    return this.afd.object('/travels/').valueChanges();
  }

  addTravel(travel: any){
    return this.afd.list('/travels').push(travel);
  }

  removeTravel(id){
    let alert = this.alertCtrl.create({
      title: 'Reise löschen',
      message: 'Sicher, dass du das löschen willst?',
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel',
          handler: () => {
            console.log('Delete cancelled');
          }
        },
        {
          text: 'Löschen',
          handler: () => {
            console.log('Delete confirmed');
            this.afd.list('/travels').remove(id).then(() => {
              this.varProv.showToast('Reise gelöscht');
            }) .catch(() => {
              this.varProv.showToast('Löschen nicht möglich, frag Johann was los ist...');
            })
          }
        }
      ]
    });
    alert.present();
  }

  getSkatGames(){
    return this.afd.list('/skat').valueChanges();
  }

  addSkatGame(skatgame: any){
    this.afd.list('/skat').push(skatgame);
  }

  removeSkatGame(id){
    this.afd.list('skat').remove(id);
  }

}
