import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {VariousProvider} from "../../providers/various/various";
import {FirebaseProvider} from "../../providers/firebase/firebase";
import {DatePipe} from "@angular/common";

export interface Sleep{
  name: string,
  city: string,
  adress: string,
  arrival: string,
  arrivaliso: string,
  departure: string,
  type: string,
  comment: string,
}

@IonicPage()
@Component({
  selector: 'page-sleep',
  templateUrl: 'sleep.html',
})
export class SleepPage {

  sleepsToShow: any[] = [];

  types: string[] = [
    'Hotel',
    'Hostel',
    'AirBnB',
    'Sonstiges'
  ];

  newsleep: Sleep = {
    name: '',
    city: '',
    adress: '',
    arrival: new Date().toISOString(),
    arrivaliso: new Date().toISOString(),
    departure: new Date().toISOString(),
    type: 'Hotel',
    comment: ''
  };

  constructor(public navCtrl: NavController,
              public fireProv: FirebaseProvider,
              public datePipe: DatePipe,
              public varProv: VariousProvider,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SleepPage');
    this.getSleeps();
  }

  getSleeps(){
    this.fireProv.getSleeps().subscribe(
      (res) => {
        this.sleepsToShow = [];
        console.log(res);
        for(let sleep in res){
          res[sleep].key = sleep;
          this.sleepsToShow.push(res[sleep]);
        }
        this.sleepsToShow.sort((a, b) =>{
          return +new Date(a.arrivaliso) - +new Date(b.arrivaliso);
        });
      },
      (err) => {console.log(err)}
    );

  }

  addSleep(){
    this.newsleep.arrival = this.datePipe.transform(this.newsleep.arrivaliso, 'dd.MM.yyyy - HH:mm');
    this.newsleep.departure = this.datePipe.transform(this.newsleep.departure, 'dd.MM.yyyy - HH:mm');
    this.fireProv.addSleep(this.newsleep).then(() => {
      this.varProv.showToast('Reise eingetragen');
      this.newsleep.arrivaliso = new Date().toISOString();
      this.newsleep.arrival = new Date().toISOString();
      this.newsleep.departure = new Date().toISOString();
      this.newsleep.name = '';
      this.newsleep.city = '';
      this.newsleep.adress = '';
      this.newsleep.type = 'Hotel';
      this.newsleep.comment = '';
    });
  }

  removeSleep(key: any){
    this.fireProv.removeSleep(key);
  }


}
