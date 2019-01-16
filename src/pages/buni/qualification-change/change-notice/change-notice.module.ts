import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChangeNoticePage } from './change-notice';

@NgModule({
  declarations: [
    ChangeNoticePage,
  ],
  imports: [
    IonicPageModule.forChild(ChangeNoticePage),
  ],
})
export class ChangeNoticePageModule {}
