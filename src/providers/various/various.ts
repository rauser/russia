import { Injectable } from '@angular/core';
import {ToastController} from "ionic-angular";

@Injectable()
export class VariousProvider {

  constructor(public toastCtrl: ToastController) {
    console.log('Hello VariousProvider Provider');
  }

  showToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 4000,
    });
    toast.present(toast);
  }

}
