import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RentUploadImageInfoPage } from './rent-upload-image-info';
import { SelectPicturePageModule } from '../../../../shared/select-picture/select-picture.module';
@NgModule({
  declarations: [
    RentUploadImageInfoPage
  ],
  imports: [
    SelectPicturePageModule,
    IonicPageModule.forChild(RentUploadImageInfoPage),
  ],
})
export class ChangeUploadImageInfoPageModule {}
