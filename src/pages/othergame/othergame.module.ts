import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OthergamePage } from './othergame';

@NgModule({
  declarations: [
    OthergamePage,
  ],
  imports: [
    IonicPageModule.forChild(OthergamePage),
  ],
})
export class OthergamePageModule {}
