import { Injectable } from '@angular/core';
import {FirebaseProvider} from "../firebase/firebase";
import firebase from 'firebase';

@Injectable()
export class StorageProvider {

  firestore = firebase.storage();

  constructor(public fireProv: FirebaseProvider) {
    console.log('Hello StorageProvider Provider');
  }

  uploadToStorage(file, name) {
    return this.firestore.ref('/tickets/').child(name).put(file);
  }

  getDownloadUrl(name: string){
    console.log(name);
    let reference = '/tickets/' + name;
    console.log(reference);
    return this.firestore.ref(reference).getDownloadURL();
  }

  deleteTicket(file) {
    let key = file.key;
    let storagePath = '/tickets/' + file.name;
    this.fireProv.deleteTicket(key);
    return this.firestore.ref(storagePath).delete();
  }
}
