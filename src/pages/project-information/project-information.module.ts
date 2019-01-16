import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProjectInformationPage } from './project-information';

@NgModule({
  declarations: [
    ProjectInformationPage,
  ],
  imports: [
    IonicPageModule.forChild(ProjectInformationPage),
  ],
})
export class ProjectInformationPageModule {}
