import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PublicAnouncementqhdPage } from './public-anouncementqhd';

import { PipesModule } from '../../pipes/PipesModule';


@NgModule({
  declarations: [
PublicAnouncementqhdPage,

  ],
  imports: [
    IonicPageModule.forChild(PublicAnouncementqhdPage),PipesModule
],
exports : [PublicAnouncementqhdPage]
})
export class PublicAnouncementqhdPageModule {}
