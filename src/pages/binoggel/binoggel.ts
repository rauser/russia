import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {UsersProvider} from "../../providers/users/users";
import {FirebaseProvider} from "../../providers/firebase/firebase";
import {DatePipe} from "@angular/common";
import {VariousProvider} from "../../providers/various/various";

@IonicPage()
@Component({
  selector: 'page-binoggel',
  templateUrl: 'binoggel.html',
})
export class BinoggelPage {

  showpastgames: boolean = false;

  players: any[] = [];

  pastgames: any[] = [];

  currentcounter: any;

  game: {playerid: number,
    player: string,
    img: string,
    playedbyid: number,
    playedby: string,
    durch: boolean,
    hingelegt: boolean,
    abgegangen: boolean,
    gespielt: boolean,
    gereizt: number,
    gemeldet: number,
    gemacht: number,
    datetime: string,
    datetimeiso: string,
  } = {
    playerid: 0,
    player: '',
    img: '',
    playedbyid: 0,
    playedby: '',
    durch: false,
    hingelegt: false,
    abgegangen: false,
    gespielt: true,
    gereizt: 0,
    gemeldet: 0,
    gemacht: 0,
    datetime: '',
    datetimeiso: '',
  };

  constructor(public navCtrl: NavController,
              public userProv: UsersProvider,
              public datePipe: DatePipe,
              public fireProv: FirebaseProvider,
              public varProv: VariousProvider,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BinoggelPage');
    this.loadPlayers();
    this.loadPastGames();
    this.loadCurrentCounter();
  }

  loadPlayers(){
    this.players = this.userProv.getUsers();
    for(let player of this.players){
      player.selected = false;
      player.gemeldet = 0;
      player.gemacht = 0;
    }
  }

  loadCurrentCounter(){
    this.fireProv.getBinoggelCounter().subscribe(
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
    this.fireProv.getBinoggelGames().subscribe(
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
      player.pp = 0;
      player.p = 0;
      player.m = 0;
      player.mm = 0;
    }
    for(let game of this.pastgames){
      for(let player of this.players){
        if(!game.durch){
          if(game.playerid == player.id)
            player.points += +game.gemeldet + +game.gemacht;
        }
        else{
          if(game.playedbyid == player.id){
            if(game.hingelegt && !game.abgegangen) player.pp += 1;
            if(!game.hingelegt && !game.abgegangen) player.p += 1;
            if(!game.hingelegt && game.abgegangen) player.m += 1;
            if(game.hingelegt && game.abgegangen) player.mm += 1;
          }
        }
      }
    }
  }

  calculateCurrentUserPoints(){
    for(let player of this.players){
      player.currentpoints = 0;
      player.currentpp = 0;
      player.currentp = 0;
      player.currentm = 0;
      player.currentmm = 0;
    }
    if(this.currentcounter){
      this.currentcounter.games = 0;
      let counterdate = new Date(this.currentcounter.startiso);
      let spielcounter = 0;
      for(let game of this.pastgames){
        let gamedate = new Date(game.datetimeiso);
        if(gamedate >= counterdate){
          this.currentcounter.games++;
          if(!game.durch) {
            spielcounter++;
          }
          for(let player of this.players) {
            if(!game.durch){
              if (game.playerid == player.id) {
                player.currentpoints += +game.gemeldet + +game.gemacht;
              }
            }
            else {
              if (game.playedbyid == player.id) {
                if (game.hingelegt && !game.abgegangen) player.currentpp += 1;
                if (!game.hingelegt && !game.abgegangen) player.currentp += 1;
                if (!game.hingelegt && game.abgegangen) player.currentm += 1;
                if (game.hingelegt && game.abgegangen) player.currentmm += 1;
              }
            }
          }
        }
      }
      console.log(this.currentcounter);
      this.currentcounter.games -= spielcounter*2/3;
      console.log(this.currentcounter);
    }
  }

  selectPlayer(id: number){
    for(let player of this.players){
      player.selected = player.id == id;
      if(player.id == id){
        this.game.playedby = player.name;
        this.game.playedbyid = id;
        this.game.img = player.img;
      }
    }
  }

  saveGame(){
    this.game.datetimeiso = new Date().toISOString();
    this.game.datetime = this.datePipe.transform(this.game.datetimeiso, 'dd.MM.yyyy - HH:mm');
    console.log(this.game);
    if(!this.game.durch){
      let promises = [];
      for(let player of this.players){
        this.game.playerid = player.id;
        this.game.player = player.name;
        this.game.img = player.img;
        this.game.gemeldet = player.gemeldet;
        this.game.gemacht = player.gemacht;
        if(this.game.gespielt){
          let points = +this.game.gemeldet + +this.game.gemacht;
          console.log(this.game.gereizt, this.game.gemeldet, this.game.gemacht, points);
          if((player.id == this.game.playedbyid) && (this.game.gereizt > points)){
            this.game.gemacht = -2* this.game.gereizt - this.game.gemeldet;
          }
        }
        else{
          if(player.id == this.game.playedbyid){
            this.game.gemeldet = 0;
            this.game.gemacht = -1* this.game.gereizt;
          }
          else {
            this.game.gemacht = 40;
          }
        }
        console.log(this.game);
        promises.push(this.fireProv.addBinoggelGame(this.game));
      }
      Promise.all(promises).then(() => {
        this.varProv.showToast('Spiel gespeichert');
        this.resetGame();
      });
    }
    else{
      this.fireProv.addBinoggelGame(this.game).then(() => {
        this.varProv.showToast('Spiel gespeichert');
        this.resetGame();
      });
    }
  }

  resetGame(){
    this.game.playerid = 0;
    this.game.player = '';
    this.game.img = '';
    this.game.playedbyid = 0;
    this.game.playedby = '';
    this.game.durch = false;
    this.game.hingelegt = false;
    this.game.abgegangen = false;
    this.game.gespielt = true;
    this.game.gereizt = 0;
    this.game.gemeldet = 0;
    this.game.gemacht = 0;
    this.game.datetime = '';
    this.game.datetimeiso = '';
    this.loadPlayers();
    this.loadPastGames();
  }

  removeGame(key: any){
    this.fireProv.removeBinoggelGame(key);
  }

  showPastGames(){
    this.showpastgames = !this.showpastgames;
  }

  resetCounter(){
    this.fireProv.resetBinoggelCounter(this.currentcounter);
  }

}
