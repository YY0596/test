import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReviewPropertyInfoPage } from './review-property-info';

@NgModule({
  declarations: [
    ReviewPropertyInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(ReviewPropertyInfoPage),
  ],
})
export class ReviewPropertyInfoPageModule {}
