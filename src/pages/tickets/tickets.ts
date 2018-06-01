import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {VariousProvider} from "../../providers/various/various";
import {FirebaseProvider} from "../../providers/firebase/firebase";
import {StorageProvider} from "../../providers/storage/storage";
import {FileChooser} from "@ionic-native/file-chooser";

export interface Ticket{
  name: string;
  description: string
}
@IonicPage()
@Component({
  selector: 'page-tickets',
  templateUrl: 'tickets.html',
})
export class TicketsPage {

  nativepath: any;
  tickets: any[] = [];

  newTicket: Ticket = {name: '', description: ''};

  constructor(public navCtrl: NavController,
              public varProv: VariousProvider,
              public alertCtrl: AlertController,
              public fireProv: FirebaseProvider,
              public fileChooser: FileChooser,
              public storageProv: StorageProvider,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TicketsPage');
    this.getTickets();
  }

  getTickets(){
    this.fireProv.getTickets().subscribe(
      (res) => {
        this.tickets = [];
        console.log(res);
        for(let ticket in res){
          res[ticket].key = ticket;
          this.storageProv.getDownloadUrl(res[ticket].name).then(
            (url) => {
              res[ticket].url = url;
              this.tickets.push(res[ticket]);
            }).catch(
            (err) => {console.log(err)}
          );
        }
        console.log(this.tickets);
      },
      (err) => {console.log(err)}
    );
  }

  addTicket() {
    if(this.newTicket.name && this.newTicket.description){
      this.fileChooser.open().then((url) => {
        this.varProv.showToast('Upload gestartet');
        (<any>window).FilePath.resolveNativePath(url, (result) => {
            this.nativepath = result;
            (<any>window).resolveLocalFileSystemURL(this.nativepath, (res) => {
              res.file((resFile) => {
                var reader = new FileReader();
                reader.readAsArrayBuffer(resFile);
                reader.onloadend = (evt: any) => {
                  var imgBlob = new Blob([evt.target.result], { type: 'file/pdf' } );
                  this.uploadInformation(imgBlob);
                }
              })
            })
          }
        )
      })
    }
    else {
      this.varProv.showToast('Name oder Beschreibung fehlt');
    }
  }

  uploadimage() {
    (<any>window).resolveLocalFileSystemURL(this.nativepath, (res) => {
      res.file((resFile) => {
        var reader = new FileReader();
        reader.readAsArrayBuffer(resFile);
        reader.onloadend = (evt: any) => {
          var imgBlob = new Blob([evt.target.result], { type: 'file/pdf' } );
          this.uploadInformation(imgBlob);
        }
      })
    })
  }

  uploadInformation(text) {
    this.newTicket.name = this.newTicket.name + '.pdf';
    this.storageProv.uploadToStorage(text, this.newTicket.name).then(
      (res) => {
        console.log(res);
        console.log('Upload success');
        this.fireProv.addTicket(this.newTicket).then(() => {
          this.varProv.showToast('Upload abgeschlossen');
          this.newTicket.name = '';
          this.newTicket.description = '';
        });
      },
      (err) => {console.log('Upload failed', err)}
    )
  }

  deleteFile(file) {
    let alert = this.alertCtrl.create({
      title: 'Ticket löschen',
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
            this.storageProv.deleteTicket(file).then(() => {
              this.varProv.showToast('Ticket gelöscht');
            });
          }
        }
      ]
    });
    alert.present();
  }

}
