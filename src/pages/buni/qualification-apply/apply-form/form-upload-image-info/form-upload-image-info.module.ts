import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FormUploadImageInfoPage } from './form-upload-image-info';
import { SelectPicturePageModule } from '../../../../../shared/select-picture/select-picture.module';
@NgModule({
  declarations: [
    FormUploadImageInfoPage
  ],
  imports: [
    SelectPicturePageModule,
    IonicPageModule.forChild(FormUploadImageInfoPage),
  ],
})
export class FormUploadImageInfoPageModule {}
