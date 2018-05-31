import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import {DatePipe} from "@angular/common";
import {AlertController} from "ionic-angular";
import {VariousProvider} from "../various/various";

export interface StartCounter{
  start: string,
  startiso: string,
}

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

  getSleeps(){
    return this.afd.object('/sleeps/').valueChanges();
  }

  addSleep(sleep: any){
    return this.afd.list('/sleeps').push(sleep);
  }

  removeSleep(id){
    let alert = this.alertCtrl.create({
      title: 'Unterkunft löschen',
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
            this.afd.list('/sleeps').remove(id).then(() => {
              this.varProv.showToast('Unterkunft gelöscht');
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
    return this.afd.object('/skat').valueChanges();
  }

  addSkatGame(skatgame: any){
    return this.afd.list('/skat').push(skatgame);
  }

  removeSkatGame(id){
    let alert = this.alertCtrl.create({
      title: 'Spiel löschen',
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
            this.afd.list('/skat').remove(id).then(() => {
              this.varProv.showToast('Spiel gelöscht');
            }) .catch(() => {
              this.varProv.showToast('Löschen nicht möglich, frag Johann was los ist...');
            })
          }
        }
      ]
    });
    alert.present();
  }

  getSkatCounter(){
    return this.afd.object('/skatcounter').valueChanges();
  }

  deleteSkatCounter(counter: any){
    return this.afd.list('/skatcounter').remove(counter.key);
  }

  setSkatCounter(){
    let counter: StartCounter = {
      startiso: new Date().toISOString(),
      start: this.datePipe.transform(new Date().toISOString(), 'dd.MM.yyyy - HH:mm')
    };
    return this.afd.list('/skatcounter').push(counter);
  }

  resetSkatCounter(counter: any){
    console.log(counter);
    let alert = this.alertCtrl.create({
      title: 'Neue Liste',
      message: 'Die aktuelle Liste läuft seit ' + counter.start + ' und enthält ' + counter.games + ' Spiele.',
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel',
          handler: () => {
            console.log('Reset cancelled');
          }
        },
        {
          text: 'Reset',
          handler: () => {
            console.log('Reset confirmed');
            this.deleteSkatCounter(counter).then((res) => {
              console.log(res);
              this.setSkatCounter().then((res1) => {
                console.log(res1);
                this.varProv.showToast('Liste wurde neu gesetzt.');
              }, (err) => {
                console.log(err);
                this.varProv.showToast('Da hat was nicht geklappt beim Neu setzen, frag Johann was los ist...')
              })
            }) .catch((err) => {
              console.log(err);
              this.varProv.showToast('Da hat was nicht geklappt beim Löschen, frag Johann was los ist...');
            })
          }
        }
      ]
    });
    alert.present();
  }

}
