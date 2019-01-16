import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BuniPage } from './buni';

@NgModule({
  declarations: [
    BuniPage,
  ],
  imports: [
    IonicPageModule.forChild(BuniPage),
  ],
})
export class BuniPageModule {}
