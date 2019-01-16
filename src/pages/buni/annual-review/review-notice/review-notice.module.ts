import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReviewNoticePage } from './review-notice';

@NgModule({
  declarations: [
    ReviewNoticePage,
  ],
  imports: [
    IonicPageModule.forChild(ReviewNoticePage),
  ],
})
export class ReviewNoticePageModule {}
