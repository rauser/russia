import {Component, NgZone} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {VariousProvider} from "../../providers/various/various";
import {FirebaseProvider} from "../../providers/firebase/firebase";
import {StorageProvider} from "../../providers/storage/storage";
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {FileChooser} from "@ionic-native/file-chooser";

export interface Ticket{
  name: string;
}
@IonicPage()
@Component({
  selector: 'page-tickets',
  templateUrl: 'tickets.html',
})
export class TicketsPage {

  nativepath: any;
  tickets: any[] = [];

  constructor(public navCtrl: NavController,
              public varProv: VariousProvider,
              public alertCtrl: AlertController,
              public fireProv: FirebaseProvider,
              public fileChooser: FileChooser,
              private iab: InAppBrowser,
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
          this.tickets.push(res[ticket]);
        }
        console.log(this.tickets);
      },
      (err) => {console.log(err)}
    );
  }

  addTicket() {
    this.fileChooser.open().then((url) => {
      (<any>window).FilePath.resolveNativePath(url, (result) => {
          this.nativepath = result;
          this.uploadimage();
        }
      )
    })
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
    let newName = `${new Date().getTime()}.pdf`;
    console.log(newName);
    this.storageProv.uploadToStorage(text, newName).then(
      (res) => {
        console.log('Upload success');
        let ticket: Ticket = {name: newName};
        this.fireProv.addTicket(ticket);
      },
      (err) => {console.log('Upload failed', err)}
    )
  }

  deleteFile(file) {
    this.storageProv.deleteTicket(file).subscribe(() => {
      this.varProv.showToast('Ticket gelöscht');
    });
  }

  viewFile(url) {
    this.iab.create(url);
  }
}
