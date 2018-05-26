import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SkatPage } from './skat';

@NgModule({
  declarations: [
    SkatPage,
  ],
  imports: [
    IonicPageModule.forChild(SkatPage),
  ],
})
export class SkatPageModule {}
