import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PlacementFormPage } from './placement-form';

@NgModule({
  declarations: [
    PlacementFormPage,
  ],
  imports: [
    IonicPageModule.forChild(PlacementFormPage),
  ],
})
export class PlacementFormPageModule {}
