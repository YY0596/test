import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChangeUploadImageInfoPage } from './change-upload-image-info';
import { SelectPicturePageModule } from '../../../../../shared/select-picture/select-picture.module';
@NgModule({
  declarations: [
    ChangeUploadImageInfoPage
  ],
  imports: [
    SelectPicturePageModule,
    IonicPageModule.forChild(ChangeUploadImageInfoPage),
  ],
})
export class ChangeUploadImageInfoPageModule {}
