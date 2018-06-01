import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {UsersProvider} from "../../providers/users/users";
import {FirebaseProvider} from "../../providers/firebase/firebase";

@IonicPage()
@Component({
  selector: 'page-othergame',
  templateUrl: 'othergame.html',
})
export class OthergamePage {

  players: any[] = [];
  points: any[] = [];

  constructor(public navCtrl: NavController,
              public userProv: UsersProvider,
              public fireProv: FirebaseProvider,
              public alertCtrl: AlertController,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OthergamePage');
    this.loadPlayers();
    this.getPoints();
  }

  loadPlayers(){
    this.players = this.userProv.getUsers();
  }


  getPoints(){
    this.fireProv.getOtherPoints().subscribe(
      (res) => {
        this.points = [];
        console.log(res);
        for(let pastgame in res){
          res[pastgame].key = pastgame;
          this.points.push(res[pastgame]);
        }
        console.log(this.points);
        this.setUserPoints();
      },
      (err) => {console.log(err)}
    );
  }

  setUserPoints(){
    for(let player of this.players){
      player.points = 0;
      player.newpoints = 0;
      for(let point of this.points){
        if(player.id == point.id){
          if(point.points)
            player.points = +point.points;
        }
      }
    }
  }

  setNewUserPoints(){
    for(let point of this.points){
      this.fireProv.deleteOtherPoints(point.key);
    }
    for(let player of this.players) {
      if (player.newpoints)
        player.points += +player.newpoints;
      console.log(player);
      this.fireProv.addOtherPoint(player);
    }
  }

  resetCounter(){
    let alert = this.alertCtrl.create({
    title: 'Punktestand reseten',
    message: 'Sicher, dass du die Punkte auf 0 setzen willst?',
    buttons: [
      {
        text: 'Abbrechen',
        role: 'cancel',
        handler: () => {
          console.log('Delete cancelled');
        }
      },
      {
        text: 'Reset',
        handler: () => {
          console.log('Delete confirmed');
          for(let point of this.points){
            this.fireProv.deleteOtherPoints(point.key);
          }
        }
      }
    ]
  });
    alert.present();
  }
}
