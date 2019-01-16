import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PlacementInfoPage } from './placement-info';

@NgModule({
  declarations: [
    PlacementInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(PlacementInfoPage),
  ],
})
export class PlacementInfoPageModule {}
