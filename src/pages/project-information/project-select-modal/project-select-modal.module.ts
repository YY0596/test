import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProjectSelectModalPage } from './project-select-modal';

@NgModule({
  declarations: [
    ProjectSelectModalPage,
  ],
  imports: [
    IonicPageModule.forChild(ProjectSelectModalPage),
  ],
})
export class ProjectSelectModalPageModule {}
