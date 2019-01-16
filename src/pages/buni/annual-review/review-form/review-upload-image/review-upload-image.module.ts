import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReviewUploadImagePage } from './review-upload-image';
import { SelectPicturePageModule } from '../../../../../shared/select-picture/select-picture.module';

@NgModule({
  declarations: [
    ReviewUploadImagePage
  ],
  imports: [
    SelectPicturePageModule,
    IonicPageModule.forChild(ReviewUploadImagePage),
  ],
})
export class ReviewUploadImagePageModule {}
