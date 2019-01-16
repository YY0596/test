import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PublicAnnouncementPage } from './public-announcement';
import { PipesModule } from '../../pipes/PipesModule';

@NgModule({
  declarations: [
PublicAnnouncementPage,

  ],
  imports: [
    IonicPageModule.forChild(PublicAnnouncementPage),PipesModule
],
exports : [PublicAnnouncementPage, ]
})
export class PublicAnnouncementPageModule {}
