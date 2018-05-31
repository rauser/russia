import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {UsersProvider} from "../../providers/users/users";
import {FirebaseProvider} from "../../providers/firebase/firebase";
import {DatePipe} from "@angular/common";
import {VariousProvider} from "../../providers/various/various";


export interface Games{
  id: number,
  name: string,
  value: number,
  img: string,
  selected: boolean
}

export interface Jacks{
  id: number,
  color: string,
  value: number,
  img: string,
  selected: boolean,
}

@IonicPage()
@Component({
  selector: 'page-skat',
  templateUrl: 'skat.html',
})
export class SkatPage {

  games: Games[] = [
    {id: 1, name: 'Karo', value: 9, img: 'assets/imgs/icons8-diamanten-48.png', selected: false},
    {id: 2, name: 'Herz', value: 10, img: 'assets/imgs/icons8-herzen-48.png', selected: false},
    {id: 3, name: 'Pik', value: 11, img: 'assets/imgs/icons8-pik-48.png', selected: false},
    {id: 4, name: 'Kreuz', value: 12, img: 'assets/imgs/icons8-kreuz-50.png', selected: false},
    {id: 5, name: 'Grand', value: 24, img: 'assets/imgs/G.png', selected: false},
    {id: 6, name: 'Null', value: 23, img: 'assets/imgs/N.png', selected: false},
    {id: 7, name: 'Ramsch', value: 0, img: 'assets/imgs/R.png', selected: false},
  ];

  jacks: Jacks[] = [
    {id: 1, color: 'Kreuz', value: 1, img: 'assets/imgs/KreuzBube.jpg', selected: false},
    {id: 2, color: 'Pik', value: 2, img: 'assets/imgs/PikBube.jpg', selected: false},
    {id: 3, color: 'Herz', value: 3, img: 'assets/imgs/HerzBube.jpg', selected: false},
    {id: 4, color: 'Karo', value: 4, img: 'assets/imgs/KaroBube.jpg', selected: false},
  ];

  showpastgames: boolean = false;

  players: any[] = [];

  pastgames: any[] = [];

  currentcounter: any;

  game: {playerid: number,
    player: string,
    img: string,
    gameid: number,
    game: string,
    buben: number,
    multiplier: number,
    value: number,
    points: number,
    hand: boolean,
    schneider: boolean,
    schneiderangesagt: boolean,
    schwarz: boolean,
    schwarzangesagt: boolean,
    offen: boolean,
    lost: boolean,
    datetime: string,
    datetimeiso: string,
  } = {
    playerid: 0,
    player: '',
    img: '',
    gameid: 0,
    game: '',
    buben: 0,
    multiplier: 0,
    value: 0,
    points: 0,
    hand: false,
    schneider: false,
    schneiderangesagt: false,
    schwarz: false,
    schwarzangesagt: false,
    offen: false,
    lost: false,
    datetime: '',
    datetimeiso: '',
  };

  constructor(public navCtrl: NavController,
              public userProv: UsersProvider,
              public fireProv: FirebaseProvider,
              public datePipe: DatePipe,
              public varProv: VariousProvider,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SkatPage');
    this.loadPlayers();
    this.loadPastGames();
    this.loadCurrentCounter();
  }

  loadPlayers(){
    this.players = this.userProv.getUsers();
    for(let player of this.players){
      player.selected = false;
    }
  }

  loadCurrentCounter(){
    this.fireProv.getSkatCounter().subscribe(
      (res) => {
        this.currentcounter = {};
        console.log(res);
        for(let counter in res){
          res[counter].key = counter;
          this.currentcounter = res[counter];
        }
        this.calculateCurrentUserPoints();
      },
      (err) => {console.log(err)}
    );
  }

  loadPastGames(){
    this.fireProv.getSkatGames().subscribe(
      (res) => {
        this.pastgames = [];
        console.log(res);
        for(let pastgame in res){
          res[pastgame].key = pastgame;
          this.pastgames.push(res[pastgame]);
        }
        this.pastgames.reverse();
        this.calculateGlobalUserPoints();
        this.calculateCurrentUserPoints();
      },
      (err) => {console.log(err)}
    );
  }

  calculateGlobalUserPoints(){
    for(let player of this.players){
      player.points = 0;
    }
    for(let game of this.pastgames){
      for(let player of this.players){
        if(game.playerid == player.id)
          player.points += game.points;
      }
    }
  }

  calculateCurrentUserPoints(){
    for(let player of this.players){
      player.currentpoints = 0;
    }
    if(this.currentcounter){
      this.currentcounter.games = 0;
      let counterdate = new Date(this.currentcounter.startiso);
      let ramschcounter = 0;
      for(let game of this.pastgames){
        let gamedate = new Date(game.datetimeiso);
        if(gamedate >= counterdate){
          this.currentcounter.games++;
          if(game.gameid == 7)
            ramschcounter++;
          for(let player of this.players){
            if(game.playerid == player.id)
              player.currentpoints += game.points;
          }
        }
      }
      console.log(ramschcounter);
      console.log(this.currentcounter);
      this.currentcounter.games -= ramschcounter*2/3;
      console.log(this.currentcounter);
    }
  }

  selectPlayer(id: number){
    for(let player of this.players){
      player.selected = player.id == id;
      if(player.id == id){
        this.game.player = player.name;
        this.game.playerid = id;
        this.game.img = player.img;
      }
    }
  }

  selectGame(id: number){
    for(let game of this.games){
      game.selected = game.id == id;
      if(game.id == id){
        this.game.game = game.name;
        this.game.gameid = id;
      }
    }
    this.calculatePoints();
  }

  selectJack(id: number){
    for(let jack of this.jacks){
      jack.selected = jack.id <= id;
      if(jack.id == id)
        this.game.buben = jack.value;
    }
    this.calculatePoints();
  }

  calculatePoints(){
    if(this.game.gameid < 6){
      this.game.multiplier = this.game.buben + 1;
      if(this.game.schneider)
        this.game.multiplier++;
      if(this.game.schwarz)
        this.game.multiplier++;
      if(this.game.hand){
        this.game.multiplier++;
        if(this.game.schneiderangesagt)
          this.game.multiplier++;
        if(this.game.schwarzangesagt)
          this.game.multiplier++;
        if(this.game.offen)
          this.game.multiplier++;
      }
      for(let game of this.games){
        if(this.game.gameid == game.id){
          this.game.value = game.value;
          this.game.points = this.game.value * this.game.multiplier;
        }
      }
    }
    else if(this.game.gameid == 6){
      this.game.points = 23;
      if(this.game.hand)
        this.game.points = 35;
      if(this.game.offen)
        this.game.points = 46;
      if(this.game.hand && this.game.offen)
        this.game.points = 59;
    }
    if(this.game.lost && this.game.gameid < 7){
      this.game.points *= -2;
    }
  }

  saveGame(){
    this.calculatePoints();
    if(this.game.gameid == 7){
      this.game.points *= -1;
    }
    this.game.datetimeiso = new Date().toISOString();
    this.game.datetime = this.datePipe.transform(this.game.datetimeiso, 'dd.MM.yyyy - HH:mm');
    console.log(this.game);
    this.fireProv.addSkatGame(this.game).then(() => {
      this.varProv.showToast('Spiel gespeichert');
      this.game.playerid = 0;
      this.game.player = '';
      this.game.img = '';
      this.game.gameid = 0;
      this.game.game = '';
      this.game.buben = 0;
      this.game.multiplier = 0;
      this.game.value = 0;
      this.game.points = 0;
      this.game.hand = false;
      this.game.schneider = false;
      this.game.schneiderangesagt = false;
      this.game.schwarz = false;
      this.game.schwarzangesagt = false;
      this.game.offen = false;
      this.game.lost = false;
      this.game.datetime = '';
      this.game.datetimeiso = '';
      for(let player of this.players)
        player.selected = false;
      for(let game of this.games)
        game.selected = false;
      for(let jack of this.jacks)
        jack.selected = false;
    });
  }

  removeGame(key: any){
    this.fireProv.removeSkatGame(key);
  }

  showPastGames(){
    this.showpastgames = !this.showpastgames;
  }

  resetCounter(){
    this.fireProv.resetSkatCounter(this.currentcounter);
  }
}
