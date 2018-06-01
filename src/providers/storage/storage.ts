import { Injectable } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import {FirebaseProvider} from "../firebase/firebase";

@Injectable()
export class StorageProvider {

  constructor(public fireProv: FirebaseProvider,
              private afStorage: AngularFireStorage) {
    console.log('Hello StorageProvider Provider');
  }

  uploadToStorage(information, name) {
    return this.afStorage.ref('/tickets/').child(name).put(information);
  }

  getDownloadUrl(name: string){
    console.log(name);
   // return this.afStorage.ref('/tickets/'+name).getDownloadURL();
  }

  storeInfoToDatabase(metainfo) {
    let toSave = {
      created: metainfo.timeCreated,
      url: metainfo.downloadURLs[0],
      fullPath: metainfo.fullPath,
      contentType: metainfo.contentType
    };
    return this.fireProv.addTicket(toSave);;
  }

  deleteTicket(file) {
    let key = file.key;
    let storagePath = file.fullPath;

    this.fireProv.deleteTicket(key);
    return this.afStorage.ref(storagePath).delete();
  }
}
