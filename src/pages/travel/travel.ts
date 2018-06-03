import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {VariousProvider} from "../../providers/various/various";
import {FirebaseProvider} from "../../providers/firebase/firebase";
import {DatePipe} from "@angular/common";

export interface Travel{
  origin: string,
  destination: string,
  start: string,
  end: string,
  startiso: string,
  transport: string,
  comment: string,
}

@IonicPage()
@Component({
  selector: 'page-travel',
  templateUrl: 'travel.html',
})
export class TravelPage {

  travelsToShow: any[] = [];

  transports: string[] = [
    'Auto',
    'Bahn',
    'Bus',
    'Flugzeug',
    'Schiff',
    'Sonstiges',
  ];

  newtravel: Travel = {
      origin: '',
      destination: '',
      start: new Date().toISOString(),
      end: new Date().toISOString(),
      startiso: new Date().toISOString(),
      transport: 'Auto',
      comment: ''
    };

  constructor(public navCtrl: NavController,
              public fireProv: FirebaseProvider,
              public datePipe: DatePipe,
              public varProv: VariousProvider,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TravelPage');
    this.getTravels();
  }

  getTravels(){
    this.fireProv.getTravels().subscribe(
      (res) => {
        this.travelsToShow = [];
        console.log(res);
        for(let travel in res){
          res[travel].key = travel;
          this.travelsToShow.push(res[travel]);
        }
        this.travelsToShow.sort((a, b) =>{
          return +new Date(a.startiso) - +new Date(b.startiso);
        });
      },
      (err) => {console.log(err)}
    );
  }

  addTravel(){
    this.newtravel.start = this.datePipe.transform(this.newtravel.startiso, 'dd.MM.yyyy - HH:mm');
    this.newtravel.end = this.datePipe.transform(this.newtravel.end, 'dd.MM.yyyy - HH:mm');
    this.fireProv.addTravel(this.newtravel).then(() => {
      this.varProv.showToast('Reise eingetragen');
      this.newtravel.start = new Date().toISOString();
      this.newtravel.startiso = new Date().toISOString();
      this.newtravel.end = new Date().toISOString();
      this.newtravel.origin = '';
      this.newtravel.destination = '';
      this.newtravel.transport = '';
      this.newtravel.comment = '';
    });
  }

  removeTravel(key: any){
    this.fireProv.removeTravel(key);
  }

}
