import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProjHouseListPage } from './proj-house-list';

@NgModule({
  declarations: [
    ProjHouseListPage,
  ],
  imports: [
    IonicPageModule.forChild(ProjHouseListPage),
  ],
})
export class ProjHouseListPageModule {}
