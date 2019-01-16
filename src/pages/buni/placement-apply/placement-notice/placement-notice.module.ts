import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PlacementNoticePage } from './placement-notice';

@NgModule({
  declarations: [
    PlacementNoticePage,
  ],
  imports: [
    IonicPageModule.forChild(PlacementNoticePage),
  ],
})
export class PlacementNoticePageModule {}
