import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AnnouncementDetailPage } from './announcement-detail';
import { PipesModule } from '../../../pipes/PipesModule';

@NgModule({
  declarations: [
    AnnouncementDetailPage,
  ],
  imports: [
IonicPageModule.forChild(AnnouncementDetailPage),
PipesModule
  ],
})
export class AnnouncementDetailPageModule {}
