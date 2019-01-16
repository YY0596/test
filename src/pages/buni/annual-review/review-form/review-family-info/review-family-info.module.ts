import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReviewFamilyInfoPage } from './review-family-info';

@NgModule({
  declarations: [
    ReviewFamilyInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(ReviewFamilyInfoPage),
  ],
})
export class ReviewFamilyInfoPageModule {}
