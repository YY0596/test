import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProgressQueryPage } from './progress-query';

@NgModule({
  declarations: [
    ProgressQueryPage,
  ],
  imports: [
    IonicPageModule.forChild(ProgressQueryPage),
  ],
})
export class ProgressQueryPageModule {}
