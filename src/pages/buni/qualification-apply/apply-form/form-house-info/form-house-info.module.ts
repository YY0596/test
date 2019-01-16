import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FormHouseInfoPage } from './form-house-info';

@NgModule({
  declarations: [
    FormHouseInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(FormHouseInfoPage),
  ],
})
export class FormHouseInfoPageModule {}
