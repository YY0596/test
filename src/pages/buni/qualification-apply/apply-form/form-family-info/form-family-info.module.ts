import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FormFamilyInfoPage } from './form-family-info';

@NgModule({
  declarations: [
    FormFamilyInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(FormFamilyInfoPage),
  ],
})
export class FormFamilyInfoPageModule {}
