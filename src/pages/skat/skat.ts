import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {UsersProvider} from "../../providers/users/users";
import {FirebaseProvider} from "../../providers/firebase/firebase";


export interface Games{
  id: number,
  name: string,
  value: number,
}

@IonicPage()
@Component({
  selector: 'page-skat',
  templateUrl: 'skat.html',
})
export class SkatPage {

  games: Games[] = [
    {id: 1, name: 'Karo', value: 9},
    {id: 2, name: 'Herz', value: 10},
    {id: 3, name: 'Pik', value: 11},
    {id: 4, name: 'Kreuz', value: 12},
    {id: 5, name: 'Grand', value: 24},
    {id: 6, name: 'Null', value: 23},
    {id: 7, name: 'Ramsch', value: 0},
  ];

  hand: boolean = false;
  schneider: boolean = false;
  schneiderangesagt: boolean = false;
  schwarz: boolean = false;
  schwarzangesagt: boolean = false;
  offen: boolean = false;
  lost: boolean = false;

  buben: number = 1;
  multiplier: number = 1;

  players: any[] = [];

  game: {playerid: number, gameid: number, points: number} = {playerid: 1, gameid: 1, points: 0};

  constructor(public navCtrl: NavController,
              public userProv: UsersProvider,
              public fireProv: FirebaseProvider,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SkatPage');
    this.loadPlayers();
    this.loadPastGames();
  }

  loadPlayers(){
    this.players = this.userProv.getUsers();
  }

  loadPastGames(){
    this.fireProv.getSkatGames().subscribe(
      (res) => {console.log(res)},
      (err) => {console.log(err)},
      () => {console.log('Complete')}
    );
  }

  calculatePoints(){
    if(this.game.gameid < 6){
      this.multiplier = this.buben + 1;
      if(this.schneider)
        this.multiplier++;
      if(this.schwarz)
        this.multiplier++;
      if(this.hand){
        this.multiplier++;
        if(this.schneiderangesagt)
          this.multiplier++;
        if(this.schwarzangesagt)
          this.multiplier++;
        if(this.offen)
          this.multiplier++;
      }
      for(let game of this.games){
        if(this.game.gameid == game.id){
          this.game.points = game.value * this.multiplier;
        }
      }
    }
    else if(this.game.gameid == 6){
      this.game.points = 23;
      if(this.hand)
        this.game.points = 35;
      if(this.offen)
        this.game.points = 46;
      if(this.hand && this.offen)
        this.game.points = 59;
    }
    if(this.lost){
      this.game.points *= -2;
    }
  }

  saveGame(){
    this.calculatePoints();
    this.fireProv.addSkatGame(this.game);
  }

}
